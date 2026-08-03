import { lazy, Suspense, useEffect, useRef } from 'react'
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useParams,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import './App.css'
import {
  contactInfo,
  experience,
  findSectionItemBySlug,
  getSectionById,
  hero,
  sections,
  siteMeta,
} from './content/data'
import { articles, findArticleBySlug } from './content/articles'
import { pageview, trackEvent } from './analytics.js'
import { ProjectVisualBySlug } from './components/ProjectVisuals'
import ContactForm from './components/ContactForm'

// Split a string on backticks; render odd-indexed segments as <code>.
// Handles the common "I built a `BaseMCPServer` for `@scope/pkg`" pattern.
function renderInlineCode(text) {
  if (!text || typeof text !== 'string' || !text.includes('`')) return text
  const parts = text.split('`')
  return parts.map((part, i) =>
    i % 2 === 1 ? <code key={i}>{part}</code> : <span key={i}>{part}</span>
  )
}

function humanizeKey(key) {
  // whatItIs -> "What it is"; sceneDescriptionLanguage -> "Scene description language"; etc.
  const KEY_OVERRIDES = {
    whatItIs: 'What it is',
    sceneDescriptionLanguage: 'Scene Description Language',
    aiPipeline: 'AI pipeline',
    authSurface: 'Auth surface',
    trustModel: 'Trust model',
    shortcutsServer: 'Shortcuts server',
  }
  if (KEY_OVERRIDES[key]) return KEY_OVERRIDES[key]
  const spaced = key.replace(/([A-Z])/g, ' $1').trim()
  const sentenceCase = spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase()
  return sentenceCase.replace(/\bi\b/g, 'I')
}

function GoogleAnalytics() {
  const { pathname } = useLocation()
  useEffect(() => {
    pageview(pathname)
  }, [pathname])
  return null
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function DocumentTitle() {
  const { pathname } = useLocation()
  const articleSlug = pathname.startsWith('/articles/') && pathname !== '/articles'
    ? pathname.replace(/^\/articles\/?/, '')
    : null
  const article = articleSlug ? findArticleBySlug(articleSlug) : null

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | ${siteMeta.name}`
    } else if (pathname === '/articles') {
      document.title = `Articles | ${siteMeta.name}`
    } else if (pathname === '/') {
      document.title = siteMeta.name
    } else if (pathname === '/404') {
      document.title = `Not found | ${siteMeta.name}`
    } else {
      document.title = siteMeta.name
    }
  }, [pathname, article])
  return null
}

function BackButton({ fallback, label }) {
  const navigate = useNavigate()
  const hasHistory = useRef(false)
  const location = useLocation()

  useEffect(() => {
    if (location.key !== 'default') hasHistory.current = true
  }, [location.key])

  function handleClick(e) {
    e.preventDefault()
    if (hasHistory.current) {
      navigate(-1)
    } else {
      navigate(fallback)
    }
  }

  return (
    <a className="mono page-back-link" href={fallback} onClick={handleClick}>
      ← {label}
    </a>
  )
}

function TopBackLink({ to, label }) {
  return (
    <Link className="mono page-back-link" to={to}>
      ← {label}
    </Link>
  )
}

function NavBar() {
  return (
    <div className="top-nav-wrap">
      <header className="top-nav">
        <Link className="brand mono" to="/">
          {siteMeta.name.toUpperCase()} / {siteMeta.role.toUpperCase()}
        </Link>
        <nav className="mono nav-links" aria-label="Primary">
          <a href="/#experience" onClick={() => trackEvent('click_nav', { link: 'experience' })}>EXPERIENCE</a>
          <a href="/#projects" onClick={() => trackEvent('click_nav', { link: 'work' })}>WORK</a>
          <Link to="/articles" onClick={() => trackEvent('click_nav', { link: 'articles' })}>ARTICLES</Link>
          <a href="/#contact" onClick={() => trackEvent('click_nav', { link: 'contact' })}>CONTACT</a>
          <span className="nav-divider" />
          <a href="https://github.com/swayamg20" target="_blank" rel="noreferrer" aria-label="GitHub" className="nav-icon" onClick={() => trackEvent('click_social', { platform: 'github' })}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          <a href="https://linkedin.com/in/swayamgupta20" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="nav-icon" onClick={() => trackEvent('click_social', { platform: 'linkedin' })}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
          </a>
          <a href="https://x.com/swayamg20" target="_blank" rel="noreferrer" aria-label="X" className="nav-icon" onClick={() => trackEvent('click_social', { platform: 'x' })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.24 2.25h3.55l-7.76 8.87L23.52 21.75h-7.15l-5.6-7.33-6.41 7.33H.81l8.3-9.49L.48 2.25h7.33l5.07 6.7 5.36-6.7zm-1.25 17.52h1.97L7.08 4.26H4.98l11.01 15.51z"/></svg>
          </a>
        </nav>
      </header>
    </div>
  )
}

function useScrollReveal() {
  const { pathname } = useLocation()
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])
}

function Layout({ children }) {
  useScrollReveal()
  return (
    <main className="studio">
      <NavBar />
      {children}
    </main>
  )
}

function ArticleRow({ article }) {
  const inner = (
    <>
      <p className="mono article-meta">
        {article.date} / {article.readTime}
      </p>
      <h3>{article.title}</h3>
      <p className="article-summary">{article.summary}</p>
      <span className="mono article-cta">
        {article.externalUrl ? 'READ ON MEDIUM ↗' : 'READ ARTICLE →'}
      </span>
    </>
  )

  if (article.externalUrl) {
    return (
      <a className="article-row" href={article.externalUrl} target="_blank" rel="noreferrer" key={article.slug} onClick={() => trackEvent('click_article', { slug: article.slug, type: 'external' })}>
        {inner}
      </a>
    )
  }

  return (
    <Link className="article-row" to={`/articles/${article.slug}`} key={article.slug} onClick={() => trackEvent('click_article', { slug: article.slug, type: 'internal' })}>
      {inner}
    </Link>
  )
}

function ProjectLinks({ links, sectionId, slug }) {
  if (!links || links.length === 0) return null
  return (
    <div className="project-links mono">
      {links.map((link) => {
        const isExternal = /^https?:\/\//.test(link.href)
        if (isExternal) {
          return (
            <a
              key={link.label}
              className="project-link"
              href={link.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('click_project_link', { section_id: sectionId, slug, label: link.label })}
            >
              {link.label} ↗
            </a>
          )
        }
        if (link.href.startsWith('/')) {
          return (
            <Link
              key={link.label}
              className="project-link"
              to={link.href}
              onClick={() => trackEvent('click_project_link', { section_id: sectionId, slug, label: link.label })}
            >
              {link.label} →
            </Link>
          )
        }
        return (
          <a
            key={link.label}
            className="project-link"
            href={link.href}
            onClick={(e) => {
              if (link.href === '#') e.preventDefault()
              trackEvent('click_project_link', { section_id: sectionId, slug, label: link.label })
            }}
          >
            {link.label}
          </a>
        )
      })}
    </div>
  )
}

function renderSectionItems(section) {
  if (section.id === 'projects') {
    return (
      <div className="project-list">
        {section.items.map((item, index) => (
          <article className="project-row-card" key={item.slug}>
            <Link
              className="project-card-stretched"
              to={`/entry/${section.id}/${item.slug}`}
              onClick={() => trackEvent('click_open_entry', { section_id: section.id, slug: item.slug })}
              aria-label={`Open ${item.title}`}
            />
            <p className="mono project-index">{String(index + 1).padStart(2, '0')}</p>
            <div className="project-main">
              <h3>{item.title}</h3>
              <p className="mono project-meta-line">{item.meta}</p>
              <p>{renderInlineCode(item.summary)}</p>
              <ProjectLinks links={item.links} sectionId={section.id} slug={item.slug} />
            </div>
            <div className="project-aside">
              <span className="mono project-arrow" aria-hidden="true">→</span>
            </div>
          </article>
        ))}
      </div>
    )
  }

  return (
    <div className="item-grid">
      {section.items.map((item) => (
        <article className="item-card" key={item.slug}>
          <p className="mono item-meta">{item.meta}</p>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
          <Link className="mono item-link" to={`/entry/${section.id}/${item.slug}`} onClick={() => trackEvent('click_open_entry', { section_id: section.id, slug: item.slug })}>
            OPEN ENTRY
          </Link>
        </article>
      ))}
    </div>
  )
}

function HomePage() {
  return (
    <>
      <section className="hero" aria-label="Landing hero">
        <div className="hero-content">
          <p className="mono section-label">{hero.label.toUpperCase()}</p>
          <h1 className="hero-heading">
            <span className="hero-heading-intro">{hero.headline}</span>
            <span className="hero-heading-name">{siteMeta.name}</span>
          </h1>
          <div className="rule" />
          <p className="description">{renderInlineCode(hero.description)}</p>
          <ul className="hero-bracket mono" aria-label="Highlights">
            {hero.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <p className="hero-inline-link mono">
            {hero.primaryLink.href.startsWith('/') ? (
              <Link to={hero.primaryLink.href}>→ {hero.primaryLink.label}</Link>
            ) : (
              <a href={hero.primaryLink.href} target="_blank" rel="noreferrer">→ {hero.primaryLink.label}</a>
            )}
          </p>
        </div>
      </section>

      <section className="content-wrap">
        <article className="section-block reveal" id="experience">
          <div className="section-header">
            <p className="mono section-title">EXPERIENCE</p>
          </div>
          <ul className="experience-list">
            {experience.map((exp) => (
              <li className="experience-row" key={exp.company}>
                <div className="experience-row-head">
                  <span className="experience-role">{exp.role}</span>
                  <span className="experience-sep mono">·</span>
                  {exp.companyUrl ? (
                    <a className="experience-company" href={exp.companyUrl} target="_blank" rel="noreferrer">{exp.company}</a>
                  ) : (
                    <span className="experience-company">{exp.company}</span>
                  )}
                  <span className="mono experience-period">{exp.period}</span>
                </div>
                <p className="experience-desc">{renderInlineCode(exp.description)}</p>
              </li>
            ))}
          </ul>
        </article>

        {sections.map((section) => (
          <article className={`section-block section-${section.id} reveal`} id={section.id} key={section.id}>
            <div className="section-header">
              <p className="mono section-title">{section.title.toUpperCase()}</p>
              <p className="mono section-intro">{section.intro}</p>
            </div>
            {renderSectionItems(section)}
          </article>
        ))}

        <article className="section-block reveal" id="articles">
          <div className="section-header">
            <p className="mono section-title">ARTICLES</p>
            <Link className="mono item-link section-cta" to="/articles">
              SEE ALL
            </Link>
          </div>

          <div className="article-list">
            {articles.map((article) => (
              <ArticleRow article={article} key={article.slug} />
            ))}
          </div>
        </article>

        <article className="section-block contact-block reveal" id="contact">
          <div className="section-header">
            <p className="mono section-title">CONTACT</p>
          </div>
          <div className="contact-links-col">
            {contactInfo.map((entry) => (
              <a className="contact-link-row" href={entry.href} key={entry.label} target="_blank" rel="noreferrer" onClick={() => trackEvent('click_contact_link', { label: entry.label })}>
                <span className="mono contact-link-label">{entry.label}</span>
                <span className="contact-link-value">{entry.value}</span>
              </a>
            ))}
          </div>
        </article>
      </section>
    </>
  )
}

function ArticlesPage() {
  return (
    <section className="content-wrap standalone-page">
      <TopBackLink to="/" label="BACK TO HOME" />
      <div className="section-header">
        <p className="mono section-title">ALL ARTICLES</p>
      </div>
      <div className="article-list">
        {articles.map((article) => (
          <ArticleRow article={article} key={article.slug} />
        ))}
      </div>
    </section>
  )
}

function SectionEntryPage() {
  const { sectionId, slug } = useParams()
  const section = getSectionById(sectionId)
  const entry = findSectionItemBySlug(sectionId, slug)

  if (!section || !entry) {
    return <Navigate to="/404" replace />
  }

  return (
    <section className="detail-page">
      <div className="detail-wrap">
        <TopBackLink to="/" label="BACK TO HOME" />
        <p className="mono detail-kicker">
          {section.title.toUpperCase()} / {entry.meta}
        </p>
        <h2>{entry.title}</h2>
        <p className="detail-summary">{entry.summary}</p>
        {sectionId === 'projects' ? <ProjectVisualBySlug slug={slug} /> : null}
        {entry.videoUrl ? (
          <video
            className="detail-video"
            controls
            muted
            playsInline
            poster={entry.videoPoster || undefined}
            src={entry.videoUrl}
          >
            Your browser doesn't support HTML5 video.
          </video>
        ) : null}
        {entry.links && entry.links.length > 0 ? (
          <div className="project-links mono detail-links">
            {entry.links.map((link) => {
              const isExternal = /^https?:\/\//.test(link.href)
              if (isExternal) {
                return (
                  <a key={link.label} className="project-link" href={link.href} target="_blank" rel="noreferrer">
                    {link.label} ↗
                  </a>
                )
              }
              if (link.href.startsWith('/')) {
                return (
                  <Link key={link.label} className="project-link" to={link.href}>
                    {link.label} →
                  </Link>
                )
              }
              return (
                <a
                  key={link.label}
                  className="project-link"
                  href={link.href}
                  onClick={(e) => {
                    if (link.href === '#') e.preventDefault()
                  }}
                >
                  {link.label}
                </a>
              )
            })}
          </div>
        ) : null}
        {entry.stack && entry.stack.length > 0 ? (
          <ul className="detail-stack-chips" aria-label="Stack">
            {entry.stack.map((chip) => (
              <li className="detail-stack-chip mono" key={chip}>{chip}</li>
            ))}
          </ul>
        ) : null}
        <div className="detail-body">
          {Array.isArray(entry.content)
            ? entry.content.map((paragraph) => <p key={paragraph}>{renderInlineCode(paragraph)}</p>)
            : Object.entries(entry.content).map(([key, value]) => (
                <section className="detail-section" key={key}>
                  <h3 className="detail-section-title">{humanizeKey(key)}</h3>
                  <p>{renderInlineCode(value)}</p>
                </section>
              ))}
          {sectionId === 'projects' ? (
            <ContactForm
              subject={`/${slug}: question or comment`}
              heading={`Want to talk about ${entry.title}?`}
              subtext="Send me a note."
              className="contact-form-compact"
            />
          ) : null}
        </div>
        <Link className="mono item-link" to="/">
          BACK TO HOME
        </Link>
      </div>
    </section>
  )
}

const ArticleEntryPage = lazy(() => import('./pages/ArticleEntryPage'))

function ArticleEntryPageWrapper() {
  const { slug } = useParams()
  const article = findArticleBySlug(slug)
  if (!article) return <Navigate to="/404" replace />
  return (
    <Suspense fallback={null}>
      <ArticleEntryPage article={article} />
    </Suspense>
  )
}

function NotFoundPage() {
  return (
    <section className="detail-page">
      <div className="detail-wrap">
        <TopBackLink to="/" label="BACK TO HOME" />
        <p className="mono detail-kicker">404</p>
        <h2>Page not found.</h2>
        <Link className="mono item-link" to="/">
          BACK TO HOME
        </Link>
      </div>
    </section>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <DocumentTitle />
      <GoogleAnalytics />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleEntryPageWrapper />} />
          <Route path="/entry/:sectionId/:slug" element={<SectionEntryPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
