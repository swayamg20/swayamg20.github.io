import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { findArticleBySlug } from '../content/articles.js'
import { ReadingProgress, useDocumentMeta } from './components.jsx'

function ExternalLink({ children, href, className }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

export default function ArticlePage() {
  const { slug } = useParams()
  const article = findArticleBySlug(slug)
  const title = article?.title || 'Article not found'
  const summary = article?.summary || article?.subtitle || 'Writing by Swayam Gupta.'

  useDocumentMeta({
    title: `${title} | Swayam Gupta`,
    description: summary,
    noindex: article?.draft === true || !article,
  })

  if (!article) {
    return (
      <main id="main-content">
        <section className="not-found site-shell">
          <p className="system-label">
            <i /> Error / missing record
          </p>
          <h1>That article is not in this portfolio.</h1>
          <Link className="signal-link" to="/writing.html">
            Return to writing <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>
    )
  }

  const articleLabel = article.draft ? 'Draft / Product vision' : article.heroLabel || 'Article'
  const authorName = article.authorName || 'Swayam Gupta'
  const authorMeta =
    article.authorMeta || `${article.date || ''}${article.readTime ? ` · ${article.readTime}` : ''}`
  const tags = String(article.tags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

  return (
    <>
      <ReadingProgress />
      <main id="article-content" className="article-main">
        <article className="article-shell">
          <Link className="article-back" to="/writing.html">
            <span aria-hidden="true">←</span> All writing
          </Link>
          <header className="article-hero">
            <p className="page-eyebrow">{articleLabel}</p>
            <h1>{article.title}</h1>
            {article.subtitle ? <p className="article-subtitle">{article.subtitle}</p> : null}
            {summary && summary !== article.subtitle ? (
              <p className="article-summary">{summary}</p>
            ) : null}
            <div className="article-byline">
              <span>{authorName}</span>
              <span>{authorMeta}</span>
              {article.externalUrl ? (
                <ExternalLink className="article-original" href={article.externalUrl}>
                  Also on Medium <span aria-hidden="true">↗</span>
                </ExternalLink>
              ) : null}
            </div>
          </header>

          <div className="article-prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
            >
              {article.body}
            </ReactMarkdown>
          </div>

          <footer className="article-end">
            {tags.length ? (
              <ul className="article-tags" aria-label="Topics">
                {tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
            <p>Written by Swayam Gupta.</p>
            <Link to="/writing.html">
              More writing <span aria-hidden="true">→</span>
            </Link>
          </footer>
        </article>
      </main>
    </>
  )
}
