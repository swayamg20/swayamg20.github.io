---
title: Shipping one JavaScript SDK to web, React Native, and Node
date: Aug 17, 2025
readTime: 8 min read
summary: Notes on build boundaries, package exports, and keeping target-specific code out of the core.
heroLabel: Build Systems
subtitle: One codebase, multiple outputs — structuring an SDK that ships to web, React Native, and Node without duplicating anything.
authorName: Swayam
authorMeta: Aug 2025 - SDK Engineer
tags: JavaScript, Build Tooling, SDK, Rollup, Architecture
externalUrl: https://swayamgupta20.medium.com/building-a-multi-target-javascript-sdk-build-tooling-839ace1f491d
---

<p class="lead">Shipping separate repositories per platform sounds clean until release velocity drops and regressions multiply. The better model is one codebase with explicit target adapters and strict packaging boundaries.</p>

This article walks through the build architecture we settled on for a JavaScript SDK that targets three runtimes — browser, React Native, and Node — from a single source tree.

## The directory structure

The layout separates platform-agnostic core logic from thin runtime-specific adapters:

```
sdk/
├── src/
│   ├── core/              # platform-agnostic business logic
│   │   ├── client.js
│   │   ├── events.js
│   │   └── utils.js
│   ├── adapters/
│   │   ├── web.js          # browser-specific bindings
│   │   ├── native.js       # react native bindings
│   │   └── node.js         # node/server bindings
│   └── index.js            # main entry, re-exports core
├── rollup.config.js
├── package.json
└── tsconfig.json
```

The rule is simple: **nothing in `core/` imports from `adapters/`**. Adapters import core modules and wire them to platform-specific APIs (fetch vs. XMLHttpRequest, AsyncStorage vs. localStorage, etc).

## The adapter pattern

Each adapter implements the same interface. The core client accepts a `platform` adapter at initialization:

<div class="file-label">src/core/client.js</div>

```js
export function createClient(config, platform) {
  const { storage, http, logger } = platform

  return {
    async track(event, props) {
      const payload = buildPayload(event, props)
      const queue = await storage.get('event_queue') ?? []
      queue.push(payload)
      await storage.set('event_queue', queue)

      if (queue.length >= config.batchSize) {
        await flush(http, queue, config)
        await storage.set('event_queue', [])
      }
    },

    async identify(userId, traits) {
      await storage.set('user_id', userId)
      await storage.set('user_traits', traits)
      logger.debug(`identified ${userId}`)
    },
  }
}
```

<div class="file-label">src/adapters/web.js</div>

```js
import { createClient } from '../core/client.js'

const webPlatform = {
  storage: {
    get: (k) => JSON.parse(localStorage.getItem(k)),
    set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  },
  http: {
    post: (url, body) =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      }),
  },
  logger: console,
}

export function init(config) {
  return createClient(config, webPlatform)
}
```

<div class="file-label">src/adapters/native.js</div>

```js
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '../core/client.js'

const nativePlatform = {
  storage: {
    get: async (k) => JSON.parse(await AsyncStorage.getItem(k)),
    set: (k, v) => AsyncStorage.setItem(k, JSON.stringify(v)),
  },
  http: {
    post: (url, body) =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
  },
  logger: console,
}

export function init(config) {
  return createClient(config, nativePlatform)
}
```

The Node adapter follows the same shape but uses `node:fs` for storage and `undici` or native `fetch` for HTTP.

## The Rollup config

One config, three output targets, built in parallel:

<div class="file-label">rollup.config.js</div>

```js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

const shared = {
  plugins: [resolve(), commonjs(), terser()],
}

export default [
  {
    input: 'src/adapters/web.js',
    output: {
      file: 'dist/web/index.mjs',
      format: 'esm',
      sourcemap: true,
    },
    ...shared,
  },
  {
    input: 'src/adapters/native.js',
    output: {
      file: 'dist/native/index.mjs',
      format: 'esm',
      sourcemap: true,
    },
    external: ['@react-native-async-storage/async-storage'],
    ...shared,
  },
  {
    input: 'src/adapters/node.js',
    output: {
      file: 'dist/node/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
    external: ['node:fs', 'node:path'],
    ...shared,
  },
]
```

Each target only bundles what it needs. React Native peer deps stay external so they resolve from the host app. Node built-ins stay external too.

## Package.json exports map

This is the part that makes `import` just work for each consumer:

<div class="file-label">package.json (excerpt)</div>

```json
{
  "name": "@company/sdk",
  "exports": {
    ".": {
      "browser": "./dist/web/index.mjs",
      "react-native": "./dist/native/index.mjs",
      "node": {
        "require": "./dist/node/index.cjs",
        "import": "./dist/node/index.mjs"
      },
      "default": "./dist/web/index.mjs"
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "peerDependencies": {
    "@react-native-async-storage/async-storage": ">=1.0.0"
  },
  "peerDependenciesMeta": {
    "@react-native-async-storage/async-storage": {
      "optional": true
    }
  }
}
```

The `react-native` condition is resolved by Metro bundler. The `browser` condition is resolved by bundlers like webpack and Vite. Node uses the `node` condition. Every consumer just writes `import { init } from '@company/sdk'` and gets the right build.

## CI validation

Every PR runs three checks against the built artifacts:

```yaml
validate:
  steps:
    - run: npm run build
    - name: check web bundle
      run: node -e "import('./dist/web/index.mjs')"
    - name: check node bundle
      run: node -e "require('./dist/node/index.cjs')"
    - name: check exports
      run: |
        node -e "
          const pkg = require('./package.json');
          const ex = pkg.exports['.'];
          assert(ex.browser, 'missing browser export');
          assert(ex.node, 'missing node export');
          assert(ex['react-native'], 'missing RN export');
        "
```

This catches broken entry points before they reach npm. The React Native build gets validated separately in a dedicated RN test app.

## Gotchas

**Tree-shaking across targets** — Make sure `sideEffects: false` is set, and avoid top-level side effects in adapter files. Otherwise bundlers will pull in all three adapters into a web bundle.

**TypeScript declarations** — Generate one `.d.ts` from the core types using `tsc --emitDeclarationOnly`. All three adapters return the same `Client` type, so one declaration file works for all targets.

**Version drift** — When adapters diverge in behavior (web needs `keepalive: true`, Node needs different retry logic), the temptation is to add platform checks in core. Resist this. Keep the divergence in adapters, keep core clean.

## Result

One `npm publish`, three runtime targets, zero cross-target regressions in six months. The total adapter code is ~120 lines across all three targets. Everything else is shared.
