---
title: Caching Lottie assets in IndexedDB
date: Apr 7, 2025
readTime: 6 min read
summary: A small performance fix for repeat visits: store large animation assets locally and avoid downloading them again.
heroLabel: Frontend Performance
subtitle: How persistent client-side caching turned 800ms animation loads into near-instant replays.
authorName: Swayam
authorMeta: Apr 2025 - Frontend Engineer
tags: IndexedDB, Performance, Lottie, Caching, Frontend
externalUrl: https://swayamgupta20.medium.com/unlock-lightning-fast-lottie-loads-with-indexeddb-persistence-a124562e324b
---

<p class="lead">Lottie animations are great until they aren't. A single complex animation JSON can be 300KB+, and when you have six of them loading on app start, your startup waterfall turns into a waterfall of pain.</p>

We hit this at scale — animations were re-fetched on every cold start, parsed from scratch, and visibly janky on mid-range Android devices. The fix was dead simple in concept: **cache the payloads in IndexedDB and skip the network entirely on repeat visits.**

## The problem in numbers

On a 3G connection profile, our animation-heavy landing screen showed:

| Metric | Before | After |
|--------|--------|-------|
| Total animation payload | 1.8 MB | 0 (cache hit) |
| Time to first animation frame | ~820ms | ~90ms |
| Full screen interactive | ~2.4s | ~1.1s |

The bottleneck wasn't rendering — it was fetching and parsing the same unchanging JSON files over and over.

## The IndexedDB cache layer

The core idea: wrap IndexedDB in a tiny async cache with versioned keys. If the version matches, return from cache. If not, fetch, store, and return.

<div class="file-label">lottie-cache.js</div>

```js
const DB_NAME = 'lottie-cache'
const STORE_NAME = 'animations'
const DB_VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function getFromCache(key) {
  const db = await openDB()
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(key)
    req.onsuccess = () => resolve(req.result ?? null)
    req.onerror = () => resolve(null)
  })
}

async function putInCache(key, data) {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  tx.objectStore(STORE_NAME).put(data, key)
}
```

Keys are structured as `animationName:version` so cache invalidation is deterministic — push a new version string when the animation changes, and stale entries are never served.

## The fetch-or-cache flow

<div class="file-label">load-animation.js</div>

```js
export async function loadAnimation(name, version, url) {
  const cacheKey = `${name}:${version}`

  try {
    const cached = await getFromCache(cacheKey)
    if (cached) return cached
  } catch {
    // IndexedDB unavailable — fall through to network
  }

  const res = await fetch(url)
  const data = await res.json()

  try {
    await putInCache(cacheKey, data)
  } catch {
    // write failed — still usable, just won't cache
  }

  return data
}
```

Two things to notice:

1. **Every IndexedDB call is wrapped in try/catch.** Private browsing, storage pressure, or a corrupted DB should never block the animation from loading — it just falls back to network.
2. **No TTL-based expiry.** The version string *is* the cache key. New version = new key = automatic cache miss. Old entries get cleaned up by a periodic sweep on app init.

## Preloading critical animations

Not all animations are equal. The hero animation needs to be ready before the first meaningful paint, while others can load lazily.

```js
const CRITICAL = [
  { name: 'hero-intro', version: '3', url: '/anims/hero-intro.json' },
]

export function warmCriticalAnimations() {
  return Promise.all(
    CRITICAL.map(({ name, version, url }) =>
      loadAnimation(name, version, url)
    )
  )
}
```

We call `warmCriticalAnimations()` right after the initial React hydration completes, before non-critical content mounts. This gives the hero animation a head start without blocking the main bundle.

## Cache cleanup

Old versions pile up. A simple sweep on startup handles this:

```js
async function pruneOldEntries(activeKeys) {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  const allKeys = await new Promise((resolve) => {
    const req = store.getAllKeys()
    req.onsuccess = () => resolve(req.result)
  })

  for (const key of allKeys) {
    if (!activeKeys.has(key)) {
      store.delete(key)
    }
  }
}
```

Pass in a `Set` of currently active `name:version` keys, and everything else gets dropped. No manual bookkeeping needed.

## Gotchas we hit

**Safari private mode** — IndexedDB exists but throws on write. The try/catch fallback handles this, but we only discovered it after a bug report from iOS users.

**Storage quota** — On low-storage devices, `put` can throw `QuotaExceededError`. We added a catch that clears the entire store and retries once before giving up on caching for that session.

**JSON parse cost** — Caching the raw JSON string and parsing on read is actually slower than caching the parsed object. IndexedDB stores structured clones natively, so storing the parsed object avoids a redundant `JSON.parse()` on every cache hit.

## Outcome

The persistent cache approach gave us consistent sub-100ms animation loads on repeat visits, regardless of network conditions. The implementation is ~80 lines of code with zero dependencies. The pattern generalizes to any heavy static asset — we've since applied the same approach to large config blobs and map tile data.
