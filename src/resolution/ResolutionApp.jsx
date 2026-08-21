import { lazy, Suspense, useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { pageview } from '../analytics.js'
import {
  IntroLoader,
  RouteEffects,
  SiteFooter,
  SiteHeader,
  useResolutionTheme,
} from './components.jsx'
import {
  AboutPage,
  CollegePage,
  HomePage,
  NotFoundPage,
  ProjectPage,
  WorkPage,
  WritingPage,
} from './pages.jsx'

const ArticlePage = lazy(() => import('./article-page.jsx'))

function GoogleAnalytics() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    pageview(`${pathname}${search}`)
  }, [pathname, search])

  return null
}

function SkipLink() {
  const { pathname } = useLocation()
  const isArticle = pathname.startsWith('/articles/')

  return (
    <a className="skip-link" href={isArticle ? '#article-content' : '#main-content'}>
      {isArticle ? 'Skip to article' : 'Skip to content'}
    </a>
  )
}

function ResolutionLayout() {
  const { theme, toggleTheme } = useResolutionTheme()

  return (
    <>
      <RouteEffects />
      <GoogleAnalytics />
      <IntroLoader />
      <SkipLink />
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/index.html" element={<HomePage />} />

        <Route path="/work" element={<WorkPage />} />
        <Route path="/work.html" element={<WorkPage />} />

        <Route path="/writing" element={<WritingPage />} />
        <Route path="/writing.html" element={<WritingPage />} />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/about.html" element={<AboutPage />} />

        <Route path="/college" element={<CollegePage />} />
        <Route path="/college.html" element={<CollegePage />} />

        <Route path="/project/:slug" element={<ProjectPage />} />
        <Route path="/project.html" element={<ProjectPage />} />

        <Route path="/articles" element={<Navigate to="/writing.html" replace />} />
        <Route
          path="/articles/:slug"
          element={
            <Suspense
              fallback={
                <main id="article-content" className="article-main" aria-busy="true">
                  <article className="article-shell">
                    <p className="page-eyebrow">Loading article</p>
                  </article>
                </main>
              }
            >
              <ArticlePage />
            </Suspense>
          }
        />

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
    </>
  )
}

export default function ResolutionApp() {
  return (
    <BrowserRouter>
      <ResolutionLayout />
    </BrowserRouter>
  )
}
