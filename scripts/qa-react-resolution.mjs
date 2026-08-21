import { chromium } from 'playwright'

const baseUrl = (process.env.REACT_RESOLUTION_BASE_URL || 'http://127.0.0.1:3001').replace(/\/$/, '')
const themeStorageKey = 'swayam-resolution-theme'

const projects = [
  ['reel2trip', 'Reel2Trip'],
  ['agentrelay', 'AgentRelay'],
  ['murmur', 'Murmur'],
  ['macos-intelligence-mcp', 'macOS Intelligence MCP'],
  ['synthio', 'Synthio'],
  ['fieldpulse', 'FieldPulse'],
  ['feather-analysis', 'Feather call analysis'],
  ['webrtc-voice-ai', 'WebRTC voice AI'],
  ['isro-xray-burst', 'ISRO X-ray burst automation'],
  ['journal-scraper', 'Journal scraper for data mining'],
]

const articles = [
  ['voice-travel-agent-openclaw', 'What I learned building a voice travel agent in four hours'],
  ['multi-target-javascript-sdk-build-tooling', 'Shipping one JavaScript SDK to web, React Native, and Node'],
  ['indexeddb-lottie-persistence', 'Caching Lottie assets in IndexedDB'],
  ['intelligence-at-the-speed-of-speech', 'Intelligence at the Speed of Speech'],
]

const projectSlugs = new Set(projects.map(([slug]) => slug))
const articleSlugs = new Set(articles.map(([slug]) => slug))

// These are deliberately the public URLs from the static prototype. The React
// app must keep every one directly refreshable while handling navigation as an SPA.
const routes = [
  { label: 'home', path: '/', heading: 'Hi, I’m Swayam Gupta.', kind: 'home' },
  { label: 'work', path: '/work.html', heading: 'Things I’ve built.', kind: 'work' },
  { label: 'writing', path: '/writing.html', heading: 'Notes from the build.', kind: 'writing' },
  { label: 'about', path: '/about.html', heading: '70% restless engineer. 30% thoughtful human.', kind: 'about' },
  { label: 'college', path: '/college.html', heading: 'Before the current chapter.', kind: 'college' },
  ...projects.map(([slug, heading]) => ({
    label: `project-${slug}`,
    path: `/project.html?project=${slug}`,
    heading,
    kind: 'project',
  })),
  ...articles.map(([slug, heading]) => ({
    label: `article-${slug}`,
    path: `/articles/${slug}/`,
    heading,
    kind: 'article',
  })),
]

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'narrow', width: 320, height: 800 },
]

const failures = []
const checkedLinks = new Map()

function fail(scope, message) {
  failures.push(`${scope}: ${message}`)
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function comparableText(value) {
  // A visual line break (`<br>`) may or may not contribute a whitespace text
  // node in JSX. Ignore that markup detail while still requiring exact words.
  return normalizeText(value).replace(/\s/g, '')
}

function createRuntimeMonitor(page, scope) {
  const consoleErrors = []
  const pageErrors = []
  const failedRequests = []
  const badResponses = []

  const onConsole = (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  }
  const onPageError = (error) => pageErrors.push(error.message)
  const onRequestFailed = (request) => {
    const reason = request.failure()?.errorText || 'unknown error'
    failedRequests.push(`${request.method()} ${request.url()} (${reason})`)
  }
  const onResponse = (response) => {
    if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`)
  }

  page.on('console', onConsole)
  page.on('pageerror', onPageError)
  page.on('requestfailed', onRequestFailed)
  page.on('response', onResponse)

  return {
    report() {
      for (const error of new Set(consoleErrors)) fail(scope, `console error: ${error}`)
      for (const error of new Set(pageErrors)) fail(scope, `page error: ${error}`)
      for (const request of new Set(failedRequests)) fail(scope, `failed request: ${request}`)
      for (const response of new Set(badResponses)) fail(scope, `bad response: ${response}`)
    },
    dispose() {
      page.off('console', onConsole)
      page.off('pageerror', onPageError)
      page.off('requestfailed', onRequestFailed)
      page.off('response', onResponse)
    },
  }
}

async function waitForRenderedPage(page) {
  await page.locator('h1').first().waitFor({ state: 'attached', timeout: 10000 })

  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready
  })

  const hasDeferredImages = await page.evaluate(
    () => [...document.images].some((image) => !image.complete || image.naturalWidth === 0),
  )

  if (hasDeferredImages) {
    await page.evaluate(async () => {
      const step = Math.max(window.innerHeight * 0.72, 280)
      const finalPosition = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)
      for (let position = 0; position <= finalPosition; position += step) {
        window.scrollTo(0, position)
        await new Promise((resolve) => window.setTimeout(resolve, 24))
      }
      window.scrollTo(0, finalPosition)
      await new Promise((resolve) => window.setTimeout(resolve, 80))
      window.scrollTo(0, 0)
    })
  }

  await page.waitForFunction(
    () => [...document.images].every((image) => image.complete),
    null,
    { timeout: 8000 },
  ).catch(() => {})

  await page.waitForTimeout(120)
}

function recordInternalLinks(scope, links) {
  for (const link of links) {
    const url = new URL(link)
    url.hash = ''
    const key = url.href
    if (!checkedLinks.has(key)) checkedLinks.set(key, new Set())
    checkedLinks.get(key).add(scope)
  }
}

function verifyContentCounts(scope, kind, counts) {
  if (kind === 'work' && counts.projects !== 10) {
    fail(scope, `expected 10 projects, got ${counts.projects}`)
  }

  if (
    kind === 'writing'
    && (counts.published !== 3 || counts.drafts !== 1 || counts.reading !== 5)
  ) {
    fail(
      scope,
      `expected 3 published, 1 draft, and 5 reads; got ${JSON.stringify({
        published: counts.published,
        drafts: counts.drafts,
        reading: counts.reading,
      })}`,
    )
  }

  if (
    kind === 'college'
    && (
      counts.recognition !== 3
      || counts.collegeProjects !== 2
      || counts.internships !== 4
      || counts.campus !== 2
    )
  ) {
    fail(
      scope,
      `expected college counts 3/2/4/2; got ${JSON.stringify({
        recognition: counts.recognition,
        projects: counts.collegeProjects,
        internships: counts.internships,
        campus: counts.campus,
      })}`,
    )
  }

  if (kind === 'about' && counts.contacts !== 5) {
    fail(scope, `expected 5 contact links, got ${counts.contacts}`)
  }
}

async function verifyDirectRoute(context, viewportName, route) {
  const scope = `${route.label}/${viewportName}`
  const page = await context.newPage()
  const monitor = createRuntimeMonitor(page, scope)

  try {
    const response = await page.goto(`${baseUrl}${route.path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    })

    if (!response) {
      fail(scope, 'direct navigation returned no document response')
    } else if (!response.ok()) {
      fail(scope, `direct navigation returned HTTP ${response.status()}`)
    }

    try {
      await waitForRenderedPage(page)
    } catch (error) {
      fail(scope, `page did not render an h1: ${error.message}`)
    }

    const state = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth
      const rootWidth = document.documentElement.scrollWidth
      const bodyWidth = document.body?.scrollWidth || 0

      const links = [...document.querySelectorAll('a[href]')]
        .map((anchor) => {
          try {
            return new URL(anchor.getAttribute('href'), window.location.href)
          } catch {
            return null
          }
        })
        .filter((url) => (
          url
          && (url.protocol === 'http:' || url.protocol === 'https:')
          && url.origin === window.location.origin
        ))
        .map((url) => url.href)

      const brokenLocalHashes = [...document.querySelectorAll('a[href]')]
        .map((anchor) => {
          try {
            const url = new URL(anchor.getAttribute('href'), window.location.href)
            return { href: anchor.getAttribute('href'), url }
          } catch {
            return null
          }
        })
        .filter((entry) => (
          entry
          && entry.url.origin === window.location.origin
          && entry.url.pathname === window.location.pathname
          && entry.url.search === window.location.search
          && entry.url.hash.length > 1
        ))
        .filter((entry) => {
          const id = decodeURIComponent(entry.url.hash.slice(1))
          return !document.getElementById(id) && !document.querySelector(`[name="${CSS.escape(id)}"]`)
        })
        .map((entry) => entry.href)

      return {
        title: document.title,
        heading: document.querySelector('h1')?.textContent || '',
        bodyTextLength: document.body?.innerText?.trim().length || 0,
        mainCount: document.querySelectorAll('main').length,
        overflow: Math.max(rootWidth, bodyWidth) > viewportWidth + 1,
        overflowWidths: { viewportWidth, rootWidth, bodyWidth },
        images: [...document.images].map((image) => ({
          src: image.currentSrc || image.src,
          complete: image.complete,
          naturalWidth: image.naturalWidth,
        })),
        links,
        brokenLocalHashes,
        theme: document.documentElement.dataset.theme || '',
        themeControls: [...document.querySelectorAll('[data-theme-toggle]')].map((button) => {
          const rect = button.getBoundingClientRect()
          return {
            tagName: button.tagName,
            ariaLabel: button.getAttribute('aria-label'),
            disabled: button.disabled,
            hasIcon: Boolean(button.querySelector('svg, .theme-icon')),
            width: rect.width,
            height: rect.height,
          }
        }),
        counts: {
          projects: document.querySelectorAll('[data-work-list] .work-entry').length,
          published: document.querySelectorAll('[data-writing-ledger] .article-row').length,
          drafts: document.querySelectorAll('[data-draft-ledger] .article-row').length,
          reading: document.querySelectorAll('[data-reading-ledger] .reading-row').length,
          recognition: document.querySelectorAll('[data-college-recognition] article').length,
          collegeProjects: document.querySelectorAll('[data-college-projects] > a').length,
          internships: document.querySelectorAll('[data-college-internships] article').length,
          campus: document.querySelectorAll('[data-college-campus] article').length,
          contacts: document.querySelectorAll('.contact-ledger > a').length,
        },
      }
    })

    const heading = normalizeText(state.heading)
    if (!heading) fail(scope, 'missing h1 text')
    if (comparableText(heading) !== comparableText(route.heading)) {
      fail(scope, `expected h1 "${route.heading}", got "${heading}"`)
    }
    if (!state.title) fail(scope, 'missing document title')
    if (state.bodyTextLength < 250) {
      fail(scope, `unexpectedly little rendered content (${state.bodyTextLength} characters)`)
    }
    if (state.mainCount !== 1) fail(scope, `expected exactly one main landmark, got ${state.mainCount}`)
    if (state.overflow) {
      fail(scope, `horizontal overflow ${JSON.stringify(state.overflowWidths)}`)
    }

    for (const image of state.images) {
      if (!image.complete || image.naturalWidth === 0) {
        fail(scope, `broken image ${image.src || '(missing source)'}`)
      }
    }
    for (const href of state.brokenLocalHashes) fail(scope, `broken same-page fragment ${href}`)

    if (state.theme !== 'dark') fail(scope, `expected seeded dark theme, got ${state.theme || 'unset'}`)
    if (state.themeControls.length !== 1) {
      fail(scope, `expected one shared theme control, got ${state.themeControls.length}`)
    } else {
      const [control] = state.themeControls
      if (control.tagName !== 'BUTTON' || control.disabled) {
        fail(scope, 'theme control is not an enabled button')
      }
      if (control.ariaLabel !== 'Switch to light mode') {
        fail(scope, `theme control has unexpected accessible label ${control.ariaLabel || 'missing'}`)
      }
      if (!control.hasIcon) fail(scope, 'theme control is missing its icon')
      if (control.width < 44 || control.height < 44) {
        fail(scope, `theme control target is ${control.width}x${control.height}, below 44x44`)
      }
    }

    verifyContentCounts(scope, route.kind, state.counts)
    recordInternalLinks(scope, state.links)

    console.log(
      `${viewportName.padEnd(7)} ${route.label.padEnd(43)} ${state.bodyTextLength} chars`,
    )
  } catch (error) {
    fail(scope, `unexpected QA exception: ${error.stack || error.message}`)
  } finally {
    await page.waitForTimeout(80).catch(() => {})
    monitor.report()
    monitor.dispose()
    await page.close()
  }
}

async function inspectThemeControl(page) {
  const controls = page.locator('[data-theme-toggle]')
  const count = await controls.count()
  if (count !== 1) return { count }

  return controls.first().evaluate((button) => {
    const rect = button.getBoundingClientRect()
    return {
      count: 1,
      tagName: button.tagName,
      ariaLabel: button.getAttribute('aria-label'),
      ariaPressed: button.getAttribute('aria-pressed'),
      disabled: button.disabled,
      hasIcon: Boolean(button.querySelector('svg, .theme-icon')),
      width: rect.width,
      height: rect.height,
    }
  })
}

async function verifyThemeContract(browser) {
  const scope = 'theme'
  const context = await browser.newContext({ viewport: viewports[0] })
  await context.addInitScript((storageKey) => {
    try {
      if (!window.localStorage.getItem(storageKey)) {
        window.localStorage.setItem(storageKey, 'dark')
      }
    } catch {
      // The test assertions below will report inaccessible persistence.
    }
  }, themeStorageKey)

  const page = await context.newPage()
  const monitor = createRuntimeMonitor(page, scope)

  try {
    await page.goto(`${baseUrl}/about.html`, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await waitForRenderedPage(page)

    const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme)
    if (initialTheme !== 'dark') fail(scope, `expected seeded dark theme, got ${initialTheme || 'unset'}`)

    const initialControl = await inspectThemeControl(page)
    if (initialControl.count !== 1) {
      fail(scope, `expected one theme control, got ${initialControl.count}`)
    } else {
      if (initialControl.tagName !== 'BUTTON') fail(scope, 'theme control is not a button')
      if (initialControl.disabled) fail(scope, 'theme control is disabled')
      if (initialControl.ariaLabel !== 'Switch to light mode') {
        fail(scope, `unexpected accessible label: ${initialControl.ariaLabel || 'missing'}`)
      }
      if (initialControl.ariaPressed !== 'false') {
        fail(scope, `expected aria-pressed="false" in dark mode, got ${initialControl.ariaPressed}`)
      }
      if (!initialControl.hasIcon) fail(scope, 'theme control is missing its icon')
      if (initialControl.width < 44 || initialControl.height < 44) {
        fail(scope, `theme control target is ${initialControl.width}x${initialControl.height}, below 44x44`)
      }
    }

    const accessibleLightAction = page.getByRole('button', {
      name: 'Switch to light mode',
      exact: true,
    })
    if (await accessibleLightAction.count() !== 1) {
      fail(scope, 'theme control is not discoverable by its accessible name')
    } else {
      await accessibleLightAction.click()
      await page.waitForFunction(() => document.documentElement.dataset.theme === 'light')
    }

    const storedAfterToggle = await page.evaluate(
      (storageKey) => window.localStorage.getItem(storageKey),
      themeStorageKey,
    )
    if (storedAfterToggle !== 'light') {
      fail(scope, `theme was not persisted after toggle; stored value is ${storedAfterToggle}`)
    }

    const writingLink = page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Writing', exact: true })
      .first()
    if (await writingLink.count() !== 1) {
      fail(scope, 'missing Writing link in primary navigation')
    } else {
      await writingLink.click()
      await page.waitForURL((url) => /\/writing(?:\.html)?\/?$/.test(url.pathname), { timeout: 5000 })
      const themeAfterNavigation = await page.evaluate(() => document.documentElement.dataset.theme)
      if (themeAfterNavigation !== 'light') {
        fail(scope, `theme did not survive client navigation; got ${themeAfterNavigation || 'unset'}`)
      }
    }

    await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 })
    await waitForRenderedPage(page)
    const reloadedState = await page.evaluate((storageKey) => ({
      theme: document.documentElement.dataset.theme,
      storedTheme: window.localStorage.getItem(storageKey),
    }), themeStorageKey)
    if (reloadedState.theme !== 'light' || reloadedState.storedTheme !== 'light') {
      fail(scope, `theme did not survive reload: ${JSON.stringify(reloadedState)}`)
    }

    const reloadedControl = await inspectThemeControl(page)
    if (reloadedControl.ariaLabel !== 'Switch to dark mode' || reloadedControl.ariaPressed !== 'true') {
      fail(
        scope,
        `light-theme control state is not accessible: ${JSON.stringify(reloadedControl)}`,
      )
    }
  } catch (error) {
    fail(scope, `unexpected QA exception: ${error.stack || error.message}`)
  } finally {
    await page.waitForTimeout(80).catch(() => {})
    monitor.report()
    monitor.dispose()
    await context.close()
  }
}

async function readLoaderState(page) {
  return page.evaluate(() => {
    const boot = document.querySelector('[data-boot]')
    if (!boot) {
      return { exists: false, visible: false, hidden: true, booting: false, word: '' }
    }

    const style = getComputedStyle(boot)
    const rect = boot.getBoundingClientRect()
    const visible = (
      !boot.hidden
      && style.display !== 'none'
      && style.visibility !== 'hidden'
      && Number.parseFloat(style.opacity || '1') > 0
      && rect.width > 0
      && rect.height > 0
    )

    return {
      exists: true,
      visible,
      hidden: boot.hidden,
      booting: document.documentElement.classList.contains('is-booting'),
      word: document.querySelector('[data-boot-word]')?.textContent?.trim() || '',
    }
  })
}

async function expectLoaderVisible(page, scope, expectedWord = null) {
  try {
    await page.waitForFunction(() => {
      const boot = document.querySelector('[data-boot]')
      if (!boot || boot.hidden) return false
      const style = getComputedStyle(boot)
      const rect = boot.getBoundingClientRect()
      return (
        style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number.parseFloat(style.opacity || '1') > 0
        && rect.width > 0
        && rect.height > 0
      )
    }, null, { timeout: 2500 })

    if (expectedWord) {
      await page.waitForFunction(
        (word) => document.querySelector('[data-boot-word]')?.textContent?.trim() === word,
        expectedWord,
        { timeout: 2500 },
      )
    }
  } catch {
    const state = await readLoaderState(page)
    fail(scope, `loader was not visibly running: ${JSON.stringify(state)}`)
    return false
  }

  const state = await readLoaderState(page)
  if (!state.word) fail(scope, 'visible loader has no resolved word')
  return true
}

async function waitForLoaderToFinish(page, scope) {
  try {
    await page.waitForFunction(() => {
      const boot = document.querySelector('[data-boot]')
      if (!boot || boot.hidden) return true
      return getComputedStyle(boot).display === 'none'
    }, null, { timeout: 6000 })
  } catch {
    const state = await readLoaderState(page)
    fail(scope, `loader did not finish: ${JSON.stringify(state)}`)
  }
}

async function expectLoaderAbsent(page, scope, observationMs = 1000) {
  const deadline = Date.now() + observationMs

  do {
    const state = await readLoaderState(page)
    if (state.visible || state.booting) {
      fail(scope, `loader ran again: ${JSON.stringify(state)}`)
      return
    }
    await page.waitForTimeout(50)
  } while (Date.now() < deadline)
}

async function clickPrimaryNavigation(page, name, scope) {
  const link = page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name, exact: true })
    .first()

  if (await link.count() !== 1) {
    fail(scope, `missing ${name} link in primary navigation`)
    return false
  }

  await link.click()
  return true
}

async function verifyLoaderContract(browser) {
  const initialScope = 'loader/initial-session'
  const context = await browser.newContext({
    viewport: { width: 960, height: 720 },
    reducedMotion: 'no-preference',
  })
  const page = await context.newPage()
  const monitor = createRuntimeMonitor(page, initialScope)

  try {
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await expectLoaderVisible(page, initialScope)
    await waitForLoaderToFinish(page, initialScope)

    await page.evaluate(() => {
      window.__resolutionQaDocumentToken = 'same-react-document'
    })

    if (await clickPrimaryNavigation(page, 'Work', initialScope)) {
      await page.waitForURL((url) => /\/work(?:\.html)?\/?$/.test(url.pathname), { timeout: 5000 })

      const homeLink = page.getByRole('link', { name: 'Swayam Gupta, home', exact: true }).first()
      if (await homeLink.count() !== 1) {
        fail(initialScope, 'missing accessible home link after navigating away')
      } else {
        await homeLink.click()
        await page.waitForURL((url) => /\/(?:index\.html)?$/.test(url.pathname), { timeout: 5000 })

        const documentToken = await page.evaluate(() => window.__resolutionQaDocumentToken)
        if (documentToken !== 'same-react-document') {
          fail(initialScope, 'navigation away and back replaced the document instead of using client routing')
        }
        await expectLoaderAbsent(page, 'loader/client-return')
      }
    }

    await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 })
    await expectLoaderAbsent(page, 'loader/same-session-reload')
  } catch (error) {
    fail(initialScope, `unexpected QA exception: ${error.stack || error.message}`)
  } finally {
    await page.waitForTimeout(80).catch(() => {})
    monitor.report()
    monitor.dispose()
    await context.close()
  }

  const newContextScope = 'loader/new-context'
  const newContext = await browser.newContext({
    viewport: { width: 960, height: 720 },
    reducedMotion: 'no-preference',
  })
  const newContextPage = await newContext.newPage()
  const newContextMonitor = createRuntimeMonitor(newContextPage, newContextScope)
  try {
    await newContextPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await expectLoaderVisible(newContextPage, newContextScope)
  } catch (error) {
    fail(newContextScope, `unexpected QA exception: ${error.stack || error.message}`)
  } finally {
    await newContextPage.waitForTimeout(80).catch(() => {})
    newContextMonitor.report()
    newContextMonitor.dispose()
    await newContext.close()
  }

  const reducedScope = 'loader/reduced-motion'
  const reducedContext = await browser.newContext({
    viewport: { width: 960, height: 720 },
    reducedMotion: 'reduce',
  })
  const reducedPage = await reducedContext.newPage()
  const reducedMonitor = createRuntimeMonitor(reducedPage, reducedScope)
  try {
    await reducedPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await expectLoaderVisible(reducedPage, reducedScope, 'SWAYAM')
    const reducedVisibleAt = Date.now()
    await waitForLoaderToFinish(reducedPage, reducedScope)
    const reducedVisibleDuration = Date.now() - reducedVisibleAt
    if (reducedVisibleDuration > 1800) {
      fail(reducedScope, `fallback remained visible for ${reducedVisibleDuration}ms instead of resolving briefly`)
    }

    await reducedPage.reload({ waitUntil: 'domcontentloaded', timeout: 15000 })
    await expectLoaderAbsent(reducedPage, 'loader/reduced-motion-reload')
  } catch (error) {
    fail(reducedScope, `unexpected QA exception: ${error.stack || error.message}`)
  } finally {
    await reducedPage.waitForTimeout(80).catch(() => {})
    reducedMonitor.report()
    reducedMonitor.dispose()
    await reducedContext.close()
  }
}

function internalTargetProblem(rawUrl) {
  const url = new URL(rawUrl)
  const configuredBase = new URL(`${baseUrl}/`)
  const configuredBasePath = configuredBase.pathname.replace(/\/$/, '')
  let pathname = url.pathname

  if (configuredBasePath) {
    if (pathname === configuredBasePath) pathname = '/'
    else if (pathname.startsWith(`${configuredBasePath}/`)) {
      pathname = pathname.slice(configuredBasePath.length)
    } else {
      return `target escapes configured app base ${configuredBasePath}`
    }
  }

  if (pathname.includes('identity-options')) {
    return 'private identity-options study is linked from the public React site'
  }

  const simplePublicPaths = new Set([
    '/',
    '/index.html',
    '/work.html',
    '/writing.html',
    '/about.html',
    '/college.html',
    '/resume.pdf',
  ])
  if (simplePublicPaths.has(pathname)) return null

  if (pathname === '/project.html') {
    const slug = url.searchParams.get('project')
    if (!slug) return 'project link is missing its project query parameter'
    if (!projectSlugs.has(slug)) return `project link uses unknown slug ${slug}`
    return null
  }

  const articleMatch = pathname.match(/^\/articles\/([^/]+)\/?$/)
  if (articleMatch) {
    const slug = decodeURIComponent(articleMatch[1])
    if (!articleSlugs.has(slug)) return `article link uses unknown slug ${slug}`
    return null
  }

  return `target is not one of the public legacy routes (${pathname})`
}

async function verifyInternalLinks(browser) {
  const requestContext = await browser.newContext()

  try {
    for (const [url, sources] of checkedLinks) {
      const sourceSummary = [...sources].slice(0, 3).join(', ')
      const targetProblem = internalTargetProblem(url)
      if (targetProblem) {
        fail('internal-links', `${url}: ${targetProblem} (linked from ${sourceSummary})`)
      }

      try {
        const response = await requestContext.request.get(url, { timeout: 15000 })
        if (!response.ok()) {
          fail(
            'internal-links',
            `${response.status()} ${url} (linked from ${sourceSummary})`,
          )
        } else {
          const contentType = response.headers()['content-type'] || ''
          const isResume = new URL(url).pathname.endsWith('/resume.pdf')
          if (isResume && !contentType.includes('application/pdf')) {
            fail('internal-links', `${url} returned ${contentType || 'no content type'}, expected PDF`)
          }
          if (!isResume && !contentType.includes('text/html')) {
            fail('internal-links', `${url} returned ${contentType || 'no content type'}, expected HTML`)
          }
        }
      } catch (error) {
        fail(
          'internal-links',
          `${url} could not be fetched (linked from ${sourceSummary}): ${error.message}`,
        )
      }
    }
  } finally {
    await requestContext.close()
  }
}

const browser = await chromium.launch({ headless: true })

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' })
    await context.addInitScript((storageKey) => {
      try {
        if (!window.localStorage.getItem(storageKey)) {
          window.localStorage.setItem(storageKey, 'dark')
        }
      } catch {
        // Individual theme assertions report inaccessible storage separately.
      }
    }, themeStorageKey)

    try {
      for (const route of routes) {
        await verifyDirectRoute(context, viewport.name, route)
      }
    } finally {
      await context.close()
    }
  }

  await verifyThemeContract(browser)
  await verifyLoaderContract(browser)
  await verifyInternalLinks(browser)
} finally {
  await browser.close()
}

if (failures.length) {
  console.error(`\nReact resolution QA failed with ${failures.length} issue${failures.length === 1 ? '' : 's'}:`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(
    `\nReact resolution QA passed: ${routes.length} public states at ${viewports.length} viewports, ${checkedLinks.size} internal links, theme persistence, and loader session contract.`,
  )
}
