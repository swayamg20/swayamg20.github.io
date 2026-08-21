import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { findProject, visuals } from './content.js'

const THEME_KEY = 'swayam-resolution-theme'
const INTRO_KEY = 'swayam-resolution-intro-seen'
const INTRO_SEQUENCE = [
  ['listening', 80],
  ['routing', 90],
  ['planning', 110],
  ['building', 130],
  ['testing', 170],
  ['learning', 210],
  ['SWAYAM', 430],
]

function readStoredTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

function readInitialTheme() {
  return (
    document.documentElement.dataset.theme ||
    readStoredTheme() ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useResolutionTheme() {
  const [theme, setTheme] = useState(readInitialTheme)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const syncSystemTheme = (event) => {
      if (!readStoredTheme()) setTheme(event.matches ? 'light' : 'dark')
    }

    media.addEventListener('change', syncSystemTheme)
    return () => media.removeEventListener('change', syncSystemTheme)
  }, [])

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(THEME_KEY, next)
      } catch {
        // The theme still changes when browser storage is unavailable.
      }
      return next
    })
  }

  return { theme, toggleTheme }
}

function ThemeIcon({ targetTheme }) {
  if (targetTheme === 'light') {
    return (
      <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.75" />
        <path d="M12 2.25v2.1M12 19.65v2.1M2.25 12h2.1M19.65 12h2.1M5.1 5.1l1.5 1.5M17.4 17.4l1.5 1.5M18.9 5.1l-1.5 1.5M6.6 17.4l-1.5 1.5" />
      </svg>
    )
  }

  return (
    <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.2 15.4A8.15 8.15 0 0 1 8.6 4.8a8.16 8.16 0 1 0 10.6 10.6Z" />
    </svg>
  )
}

export function ThemeControl({ theme, onToggle }) {
  const targetTheme = theme === 'dark' ? 'light' : 'dark'
  const actionLabel = `Switch to ${targetTheme} mode`

  return (
    <button
      className="theme-control"
      type="button"
      data-theme-toggle
      onClick={onToggle}
      title={actionLabel}
      aria-label={actionLabel}
      aria-pressed={theme === 'light'}
    >
      <ThemeIcon targetTheme={targetTheme} />
      <span className="theme-control-label">
        {targetTheme === 'light' ? 'Light' : 'Dark'}
      </span>
    </button>
  )
}

function routeSection(pathname) {
  if (pathname.startsWith('/project') || pathname.startsWith('/work')) return 'work'
  if (pathname.startsWith('/article') || pathname.startsWith('/writing')) return 'writing'
  if (pathname.startsWith('/about') || pathname.startsWith('/college')) return 'about'
  return 'home'
}

export function SiteHeader({ theme, onToggleTheme }) {
  const { pathname } = useLocation()
  const activeSection = routeSection(pathname)

  return (
    <header className="site-header page-header">
      <div className="page-shell page-header-inner">
        <Link className="page-brand" to="/" aria-label="Swayam Gupta, home">
          Swayam Gupta
        </Link>
        <nav className="page-nav" aria-label="Primary navigation">
          <Link to="/work.html" aria-current={activeSection === 'work' ? 'page' : undefined}>
            Work
          </Link>
          <Link
            to="/writing.html"
            aria-current={activeSection === 'writing' ? 'page' : undefined}
          >
            Writing
          </Link>
          <Link to="/about.html" aria-current={activeSection === 'about' ? 'page' : undefined}>
            About
          </Link>
          <ThemeControl theme={theme} onToggle={onToggleTheme} />
        </nav>
      </div>
    </header>
  )
}

const socialLinks = [
  ['Email', 'mailto:gupta.swayam123@gmail.com'],
  ['GitHub', 'https://github.com/swayamg20'],
  ['LinkedIn', 'https://linkedin.com/in/swayamgupta20'],
  ['X', 'https://x.com/swayamg20'],
]

export function SiteFooter() {
  const { pathname } = useLocation()
  const isHome = pathname === '/' || pathname === '/index.html'

  if (isHome) {
    return (
      <footer className="site-footer home-footer">
        <div className="home-shell home-footer-inner">
          <span>Swayam Gupta · New Delhi</span>
        </div>
      </footer>
    )
  }

  return (
    <footer className="site-footer page-footer">
      <div className="page-shell page-footer-inner">
        <span>Swayam Gupta · New Delhi</span>
        <div>
          {socialLinks.map(([label, href]) => (
            <a
              href={href}
              key={label}
              {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {label}
            </a>
          ))}
          <a href="/resume.pdf">Résumé</a>
        </div>
      </div>
    </footer>
  )
}

function shouldRunInitialIntro() {
  const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html'
  try {
    const seen = window.sessionStorage.getItem(INTRO_KEY) === 'true'
    if (!seen) window.sessionStorage.setItem(INTRO_KEY, 'true')
    return isHome && !seen
  } catch {
    return isHome
  }
}

const RUN_INITIAL_INTRO = shouldRunInitialIntro()

export function IntroLoader() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [visible, setVisible] = useState(RUN_INITIAL_INTRO)
  const [leaving, setLeaving] = useState(false)
  const [resolved, setResolved] = useState(prefersReducedMotion && RUN_INITIAL_INTRO)
  const [changing, setChanging] = useState(false)
  const [position, setPosition] = useState(
    prefersReducedMotion && RUN_INITIAL_INTRO ? INTRO_SEQUENCE.length - 1 : 0,
  )

  useEffect(() => {
    if (!visible) return undefined

    const root = document.documentElement
    const timers = new Set()
    let cancelled = false

    const later = (callback, delay) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer)
        if (!cancelled) callback()
      }, delay)
      timers.add(timer)
      return timer
    }

    const close = () => {
      setLeaving(true)
      root.classList.remove('is-booting')
      later(() => setVisible(false), 360)
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') close()
    }

    root.classList.add('is-booting')
    document.addEventListener('keydown', onKeyDown)

    if (prefersReducedMotion) {
      later(close, 650)
    } else {
      let nextPosition = 0
      const showNext = () => {
        setChanging(true)
        later(() => {
          setPosition(nextPosition)
          setChanging(false)
          if (nextPosition === INTRO_SEQUENCE.length - 1) {
            setResolved(true)
            later(close, INTRO_SEQUENCE[nextPosition][1])
            return
          }
          const hold = INTRO_SEQUENCE[nextPosition][1]
          nextPosition += 1
          later(showNext, hold)
        }, 28)
      }
      showNext()
    }

    return () => {
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
      document.removeEventListener('keydown', onKeyDown)
      root.classList.remove('is-booting')
    }
  }, [prefersReducedMotion, visible])

  if (!visible) return null

  return (
    <div
      className={`boot-sequence${leaving ? ' is-leaving' : ''}${resolved ? ' is-resolved' : ''}`}
      data-boot
      aria-hidden="true"
    >
      <div className="boot-inner">
        <p>
          <i />
          <span data-boot-state>{resolved ? 'identity resolved' : 'resolving identity'}</span>
        </p>
        <strong className={changing ? 'is-changing' : ''} data-boot-word>
          {INTRO_SEQUENCE[position][0]}
        </strong>
        <small>
          <span data-boot-index>{String(position + 1).padStart(2, '0')}</span> / 07
        </small>
      </div>
    </div>
  )
}

function routeBodyState(location) {
  const { pathname, search } = location
  const section = routeSection(pathname)
  let bodyClass = ''
  let signal = ''

  if (pathname.startsWith('/project')) {
    bodyClass = 'project-page'
    const querySlug = new URLSearchParams(search).get('project')
    const pathSlug = pathname.startsWith('/project/') ? pathname.split('/').filter(Boolean).at(-1) : ''
    signal = findProject(pathSlug || querySlug || 'reel2trip')?.signal ?? ''
  } else if (pathname.startsWith('/articles/')) {
    bodyClass = 'article-page'
  } else if (pathname.startsWith('/college')) {
    bodyClass = 'college-page'
  }

  return { section, bodyClass, signal }
}

export function RouteEffects() {
  const location = useLocation()
  const state = useMemo(() => routeBodyState(location), [location])

  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.add('has-js')
    document.body.dataset.page = state.section
    document.body.className = state.bodyClass
    if (state.signal) document.body.dataset.signal = state.signal
    else delete document.body.dataset.signal
    window.scrollTo(0, 0)
  }, [location.pathname, location.search, state])

  useEffect(() => {
    const root = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let observer
    let frame

    frame = window.requestAnimationFrame(() => {
      const items = [...document.querySelectorAll('[data-reveal]')]
      if (items.length && !reducedMotion && 'IntersectionObserver' in window) {
        root.classList.add('can-reveal')
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return
              entry.target.classList.add('is-visible')
              observer.unobserve(entry.target)
            })
          },
          { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
        )
        items.forEach((item) => observer.observe(item))
      } else {
        root.classList.remove('can-reveal')
        items.forEach((item) => item.classList.add('is-visible'))
      }
      root.classList.add('page-ready')
    })

    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [location.pathname, location.search])

  return null
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDocumentMeta({ title, description, noindex = false }) {
  useLayoutEffect(() => {
    document.title = title

    let descriptionTag = document.querySelector('meta[name="description"]')
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta')
      descriptionTag.name = 'description'
      document.head.appendChild(descriptionTag)
    }
    descriptionTag.content = description

    let robotsTag = document.querySelector('meta[name="robots"]')
    if (noindex) {
      if (!robotsTag) {
        robotsTag = document.createElement('meta')
        robotsTag.name = 'robots'
        document.head.appendChild(robotsTag)
      }
      robotsTag.content = 'noindex'
    } else {
      robotsTag?.remove()
    }
  }, [description, noindex, title])
}

export function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.23c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.39.96.1-.75.4-1.26.74-1.55-2.58-.29-5.29-1.29-5.29-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.16 1.18A10.9 10.9 0 0 1 12 6.16c.98 0 1.95.13 2.87.38 2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.4-2.72 5.38-5.3 5.67.42.36.79 1.06.79 2.14v3.26c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .7Z"
      />
    </svg>
  )
}

export function ProjectDiagram({ slug }) {
  return <div className="react-diagram-contents" dangerouslySetInnerHTML={{ __html: visuals.card(slug) }} />
}

export function ProductModel({ project }) {
  return <div data-reveal dangerouslySetInnerHTML={{ __html: visuals.model(project) }} />
}

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0
      setProgress(ratio * 100)
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div
      className="reading-progress"
      data-reading-progress
      aria-hidden="true"
      style={{ width: `${progress}%` }}
    />
  )
}
