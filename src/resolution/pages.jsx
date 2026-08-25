import { Link, useParams, useSearchParams } from 'react-router-dom'
import portraitUrl from '../assets/portrait.jpg'
import {
  articleSlugFromHref,
  drafts,
  featuredProjectSlugs,
  findProject,
  projects,
  reading,
  writing,
} from './content.js'
import {
  GithubIcon,
  ProductModel,
  useDocumentMeta,
} from './components.jsx'

const projectHref = (slug) => `/project.html?project=${slug}`
const articleHref = (entry) => `/articles/${articleSlugFromHref(entry.href)}/`

function ExternalLink({ children, href, className, ...props }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  )
}

export function HomePage() {
  useDocumentMeta({
    title: 'Swayam Gupta | Software engineer',
    description:
      'Swayam Gupta is a software engineer building agent systems and the infrastructure around them.',
  })

  const selectedProjects = featuredProjectSlugs
    .map((slug) => findProject(slug))
    .filter(Boolean)

  return (
    <main id="main-content" className="home-main">
      <div className="home-shell">
        <section className="home-intro" aria-labelledby="home-title">
          <div className="home-intro-lead">
            <div className="home-identity">
              <h1 id="home-title">
                <span className="home-heading-copy">Hi, I’m Swayam Gupta.</span>
                <span className="home-avatar" aria-hidden="true">
                  <img
                    src={portraitUrl}
                    alt=""
                    width="72"
                    height="72"
                    fetchPriority="high"
                  />
                </span>
              </h1>
              <p className="home-kicker">
                Software engineer · agent systems · multimodal products · New Delhi
              </p>
              <div className="home-links" aria-label="Contact and social links">
                <a href="mailto:gupta.swayam123@gmail.com">Email</a>
                <ExternalLink href="https://github.com/swayamg20">GitHub</ExternalLink>
                <ExternalLink href="https://linkedin.com/in/swayamgupta20">LinkedIn</ExternalLink>
                <ExternalLink href="https://x.com/swayamg20">X</ExternalLink>
                <a href="/resume.pdf">Résumé</a>
              </div>
            </div>
          </div>

          <div className="home-prose">
            <p>
              I’m a software engineer at{' '}
              <ExternalLink href="https://www.ixigo.com">ixigo</ExternalLink>, building agent
              systems for travel: voice runtimes, evaluations, observability, and multimodal
              product experiences.
            </p>
            <p>
              I’m most interested in the layer after a demo works: persistence, coordination,
              failure recovery, and the infrastructure that makes an agent dependable.
            </p>
            <p>
              Outside work, I build public experiments such as{' '}
              <Link to={projectHref('agentrelay')}>AgentRelay</Link> and{' '}
              <Link to={projectHref('murmur')}>Murmur</Link>, then write about what broke, what
              held up, and what I still do not understand.
            </p>
          </div>
        </section>

        <section className="home-section" id="work" aria-labelledby="selected-title">
          <header className="home-section-heading">
            <h2 id="selected-title">Selected work</h2>
            <Link to="/work.html">All projects</Link>
          </header>
          <div className="home-records" data-home-work>
            {selectedProjects.map((project) => (
              <Link className="home-record" to={projectHref(project.slug)} key={project.slug}>
                <div className="home-record-top">
                  <strong>{project.title}</strong>
                  <small>
                    {project.year} · {project.categoryLabel}
                  </small>
                </div>
                <p>{project.cardLine}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section" id="experience" aria-labelledby="experience-title">
          <header className="home-section-heading">
            <h2 id="experience-title">Experience</h2>
            <Link to="/about.html">Details</Link>
          </header>
          <div className="home-records home-history">
            <Link className="home-record" to="/about.html">
              <div className="home-record-top">
                <strong>ixigo</strong>
                <small>2024 → now</small>
              </div>
              <p className="home-role">Software Engineer 2, AI Products</p>
              <p className="home-experience-note">
                Agent harness, multi-agent orchestration, voice infrastructure, evaluations,
                observability, and multimodal product work.
              </p>
            </Link>
            <Link className="home-record" to="/about.html">
              <div className="home-record-top">
                <strong>Overlayy AI</strong>
                <small>2024</small>
              </div>
              <p className="home-role">Founding Engineer</p>
              <p className="home-experience-note">
                Built the first product stack end to end, from Phoenix and FastAPI services to
                AWS, the embeddable client, and analytics.
              </p>
            </Link>
          </div>
        </section>

        <section className="home-section" id="upstream" aria-labelledby="upstream-title">
          <header className="home-section-heading">
            <h2 id="upstream-title">Open source</h2>
          </header>
          <div className="home-source">
            <p>
              I contribute to <ExternalLink href="https://github.com/livekit">LiveKit</ExternalLink>,{' '}
              <ExternalLink href="https://github.com/pipecat-ai/pipecat">Pipecat</ExternalLink>,{' '}
              <ExternalLink href="https://github.com/Priivacy-ai/spec-kitty">
                Spec Kitty
              </ExternalLink>
              , and{' '}
              <ExternalLink href="https://github.com/SWE-agent/mini-swe-agent">
                mini-swe-agent
              </ExternalLink>
              .
            </p>
            <ExternalLink
              className="home-inline-action"
              href="https://github.com/pulls?q=is%3Apr+author%3Aswayamg20+-user%3Aswayamg20"
            >
              See contribution activity ↗
            </ExternalLink>
          </div>
        </section>

        <section className="home-section" aria-labelledby="writing-title">
          <header className="home-section-heading">
            <h2 id="writing-title">Recent writing</h2>
            <Link to="/writing.html">All notes</Link>
          </header>
          <div className="home-records" data-home-writing>
            {writing.slice(0, 3).map((note) => (
              <Link className="home-record home-writing-record" to={articleHref(note)} key={note.title}>
                <div className="home-record-top">
                  <strong>{note.title}</strong>
                  <small>
                    {note.date} · {note.readTime}
                  </small>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section" aria-labelledby="college-title">
          <header className="home-section-heading">
            <h2 id="college-title">
              <Link className="home-heading-title" to="/college.html">
                College &amp; early work
              </Link>
            </h2>
            <Link to="/college.html">Open chapter</Link>
          </header>
          <Link className="home-chapter-link" to="/college.html">
            <p>
              Four internships, campus leadership, a silver-medal Inter IIT project, and the
              early technical work that shaped how I build.
            </p>
            <i aria-hidden="true">→</i>
          </Link>
        </section>
      </div>
    </main>
  )
}

function WorkRepository({ project }) {
  if (!project.github) {
    return (
      <span className="work-private">{project.repositoryLabel ? 'Archive' : 'Private'}</span>
    )
  }

  return (
    <ExternalLink
      className="work-repository"
      href={project.github}
      aria-label={`Open ${project.title} on GitHub`}
    >
      <GithubIcon />
    </ExternalLink>
  )
}

export function WorkPage() {
  useDocumentMeta({
    title: 'Work | Swayam Gupta',
    description: 'Production work, open-source systems, and experiments by Swayam Gupta.',
  })

  return (
    <main id="main-content" className="page-main">
      <div className="page-shell">
        <section className="page-intro" aria-labelledby="work-title">
          <p className="page-eyebrow">Work</p>
          <h1 id="work-title">Things I’ve built.</h1>
          <p>
            Production systems, open-source tools, and experiments. Each record opens into the
            product model and the decisions behind it.
          </p>
        </section>

        <section className="page-section work-directory" aria-labelledby="work-index-title">
          <header className="page-section-heading">
            <h2 id="work-index-title">Projects</h2>
            <span>10 records</span>
          </header>
          <div className="work-list" data-work-list>
            {projects.map((project) => (
              <article className="work-entry" data-reveal key={project.slug}>
                <Link
                  className="work-entry-main"
                  to={projectHref(project.slug)}
                  aria-label={`Read the ${project.title} project record`}
                >
                  <span className="work-entry-number">{project.order}</span>
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.cardLine}</p>
                    <ul aria-label="Project metadata">
                      <li>{project.year}</li>
                      <li>{project.categoryLabel}</li>
                      <li>{project.state}</li>
                    </ul>
                  </div>
                  <i aria-hidden="true">→</i>
                </Link>
                <WorkRepository project={project} />
              </article>
            ))}
          </div>
        </section>

        <section className="page-afterword" aria-label="More projects">
          <p>
            Smaller experiments and earlier repositories live on{' '}
            <ExternalLink href="https://github.com/swayamg20?tab=repositories">
              GitHub ↗
            </ExternalLink>
            .
          </p>
        </section>
      </div>
    </main>
  )
}

function WritingRows({ entries, status = '' }) {
  return entries.map((note) => (
    <Link className="article-row" to={articleHref(note)} data-reveal key={note.title}>
      <div>
        <strong>{note.title}</strong>
        <small>
          {status ? `${status} · ` : ''}
          {note.topic} · {note.date} · {note.readTime}
        </small>
      </div>
      <i aria-hidden="true">→</i>
    </Link>
  ))
}

export function WritingPage() {
  useDocumentMeta({
    title: 'Writing | Swayam Gupta',
    description: 'Technical notes and build diaries by Swayam Gupta.',
  })

  return (
    <main id="main-content" className="page-main">
      <div className="page-shell">
        <section className="page-intro" aria-labelledby="writing-title">
          <p className="page-eyebrow">Writing</p>
          <h1 id="writing-title">Notes from the build.</h1>
          <p>
            Agent systems, architecture, and the small decisions that usually appear after the
            demo works.
          </p>
        </section>

        <section className="page-section writing-directory" aria-labelledby="published-title">
          <header className="page-section-heading">
            <h2 id="published-title">Published</h2>
            <span>03 notes</span>
          </header>
          <div className="article-ledger" data-writing-ledger>
            <WritingRows entries={writing} />
          </div>
        </section>

        <section
          className="page-section writing-directory draft-directory"
          aria-labelledby="draft-title"
        >
          <header className="page-section-heading">
            <h2 id="draft-title">In progress</h2>
            <span>01 draft</span>
          </header>
          <div className="article-ledger" data-draft-ledger>
            <WritingRows entries={drafts} status="Draft" />
          </div>
        </section>

        <section className="page-section reading-list" aria-labelledby="reading-title">
          <header className="page-section-heading">
            <h2 id="reading-title">Worth reading</h2>
            <span>05 links</span>
          </header>
          <div className="reading-ledger" data-reading-ledger>
            {reading.map((item) => (
              <ExternalLink className="reading-row" href={item.href} data-reveal key={item.href}>
                <div>
                  <strong>{item.title}</strong>
                  <small>
                    {item.format} · {item.author} · {item.year}
                  </small>
                </div>
                <p>{item.note}</p>
                <i aria-hidden="true">↗</i>
              </ExternalLink>
            ))}
          </div>
        </section>

        <section className="page-section thinking-list" aria-labelledby="questions-title">
          <header className="page-section-heading">
            <h2 id="questions-title">Still thinking about</h2>
          </header>
          <ol>
            <li>
              <span>01</span>
              <p>How should agents ask each other for help without erasing human ownership?</p>
            </li>
            <li>
              <span>02</span>
              <p>When should a model describe a visual, and when should code own the scene?</p>
            </li>
            <li>
              <span>03</span>
              <p>What makes an agent action trustworthy after the tool returns?</p>
            </li>
          </ol>
        </section>
      </div>
    </main>
  )
}

export function AboutPage() {
  useDocumentMeta({
    title: 'About | Swayam Gupta',
    description:
      'About Swayam Gupta, a software engineer working on production agent systems and conversational AI.',
  })

  return (
    <main id="main-content" className="page-main">
      <div className="page-shell">
        <section className="page-intro about-intro" aria-labelledby="about-title">
          <p className="page-eyebrow">About</p>
          <h1 id="about-title">
            70% restless engineer.
            <br />
            30% thoughtful human.
          </h1>
          <div className="about-copy">
            <p>
              I’m Swayam, a software engineer in New Delhi. At ixigo, I work across agent systems
              and conversational AI: orchestration, tools, memory, observability, evaluations, and
              multimodal product experiences.
            </p>
            <p>
              I built the agent harness, multi-agent orchestration, and in-house voice pipeline
              behind a system handling tens of thousands of calls a day. I now apply those building
              blocks to ixigo’s in-app multimodal agent.
            </p>
            <p>
              I care most about the layer after a demo works—where coordination, failure recovery,
              and clear boundaries make software dependable.
            </p>
          </div>
        </section>

        <section className="page-section experience-section" aria-labelledby="experience-title">
          <header className="page-section-heading">
            <h2 id="experience-title">Experience</h2>
            <span>2024 → now</span>
          </header>
          <div className="experience-list">
            <article data-reveal>
              <header>
                <div>
                  <h3>
                    <ExternalLink href="https://www.ixigo.com">ixigo ↗</ExternalLink>
                  </h3>
                  <p>Software Engineer 2 · AI Products</p>
                </div>
                <time>Aug 2024 → now</time>
              </header>
              <p>
                My work spans the agent harness, multi-agent orchestration, tools, memory,
                observability, and evaluations. I built the in-house voice pipeline behind a
                system handling tens of thousands of calls a day and now apply the same building
                blocks to ixigo’s in-app multimodal agent.
              </p>
            </article>
            <article data-reveal>
              <header>
                <div>
                  <h3>
                    <ExternalLink href="https://overlayy.com">Overlayy AI ↗</ExternalLink>
                  </h3>
                  <p>Founding Engineer</p>
                </div>
                <time>Apr → Aug 2024</time>
              </header>
              <p>
                I joined as the first engineer. There was no stack to inherit, so I built the first
                version end to end: Phoenix services, FastAPI retrieval, AWS deployment, the
                embeddable client, real-time messaging, and analytics. We brought on the first
                paying customers before I left.
              </p>
            </article>
          </div>
        </section>

        <section className="page-section practice-section" aria-labelledby="practice-title">
          <header className="page-section-heading">
            <h2 id="practice-title">How I work</h2>
          </header>
          <ol>
            <li>
              <span>01</span>
              <p>Make the boundary explicit.</p>
            </li>
            <li>
              <span>02</span>
              <p>Trace the user-visible truth.</p>
            </li>
            <li>
              <span>03</span>
              <p>Keep the loop inspectable.</p>
            </li>
          </ol>
        </section>

        <section className="page-section contact-directory" aria-labelledby="find-title">
          <header className="page-section-heading">
            <h2 id="find-title">Find me</h2>
            <span>Links</span>
          </header>
          <div className="contact-ledger">
            <a href="mailto:gupta.swayam123@gmail.com">
              <span>Email</span>
              <strong>gupta.swayam123@gmail.com</strong>
              <i aria-hidden="true">↗</i>
            </a>
            <ExternalLink href="https://github.com/swayamg20">
              <span>GitHub</span>
              <strong>@swayamg20</strong>
              <i aria-hidden="true">↗</i>
            </ExternalLink>
            <ExternalLink href="https://linkedin.com/in/swayamgupta20">
              <span>LinkedIn</span>
              <strong>/in/swayamgupta20</strong>
              <i aria-hidden="true">↗</i>
            </ExternalLink>
            <ExternalLink href="https://x.com/swayamg20">
              <span>X</span>
              <strong>@swayamg20</strong>
              <i aria-hidden="true">↗</i>
            </ExternalLink>
            <a href="/resume.pdf">
              <span>Résumé</span>
              <strong>PDF</strong>
              <i aria-hidden="true">↓</i>
            </a>
          </div>
        </section>

        <section className="page-contact" aria-labelledby="contact-title">
          <h2 id="contact-title">Have a difficult system?</h2>
          <p>
            <a href="mailto:gupta.swayam123@gmail.com">Tell me about it ↗</a>
          </p>
        </section>
      </div>
    </main>
  )
}

export function CollegePage() {
  useDocumentMeta({
    title: 'College & early work | Swayam Gupta',
    description:
      "Swayam Gupta's college years, early projects, internships, recognition, and campus work.",
  })

  return (
    <main id="main-content" className="page-main">
      <div className="page-shell">
        <section className="page-intro college-intro" aria-labelledby="college-page-title">
          <p className="page-eyebrow">College &amp; early work</p>
          <h1 id="college-page-title">Before the current chapter.</h1>
          <p>
            Material Science &amp; Engineering, IIT Kanpur. Graduated in 2024. These are the
            projects, internships, teams, and recognitions that shaped how I learned to build.
          </p>
        </section>

        <section className="page-section college-section" aria-labelledby="recognition-title">
          <header className="page-section-heading">
            <h2 id="recognition-title">Recognition</h2>
            <span>2022 → 2025</span>
          </header>
          <div className="college-ledger" data-college-recognition>
            <article data-reveal>
              <div>
                <h3>2nd place, ixigo Hackweek</h3>
                <p>
                  Built Reel2Trip, a GenAI travel product that turns a shared reel into an
                  itinerary and an ongoing conversation.
                </p>
              </div>
              <time>2025</time>
            </article>
            <article data-reveal>
              <div>
                <h3>ixigo Premio Award</h3>
                <p>Recognized among ixigo’s top contributor engineers.</p>
              </div>
              <time>2025</time>
            </article>
            <article data-reveal>
              <div>
                <h3>Silver medal, Inter IIT Tech Meet</h3>
                <p>
                  Worked on an ISRO problem statement at Inter IIT Tech Meet 10.0; IIT Kanpur
                  finished second overall.
                </p>
              </div>
              <time>2022</time>
            </article>
          </div>
        </section>

        <section className="page-section college-section" aria-labelledby="early-projects-title">
          <header className="page-section-heading">
            <h2 id="early-projects-title">Credited projects</h2>
            <span>External provenance</span>
          </header>
          <div className="college-projects" data-college-projects>
            <Link to={projectHref('isro-xray-burst')} data-reveal>
              <span>01</span>
              <div>
                <h3>ISRO X-ray burst automation</h3>
                <p>Inter IIT Tech Meet 10.0 · ISRO problem statement · Silver medal</p>
              </div>
              <i aria-hidden="true">→</i>
            </Link>
            <Link to={projectHref('journal-scraper')} data-reveal>
              <span>02</span>
              <div>
                <h3>Journal scraper for data mining</h3>
                <p>Supervised by Prof. Shikhar Krishan Jha · IIT Kanpur</p>
              </div>
              <i aria-hidden="true">→</i>
            </Link>
          </div>
        </section>

        <section
          className="page-section experience-section college-section"
          aria-labelledby="internships-title"
        >
          <header className="page-section-heading">
            <h2 id="internships-title">Internships</h2>
            <span>Four teams</span>
          </header>
          <div className="experience-list" data-college-internships>
            <article data-reveal>
              <header>
                <div>
                  <h3>Fischer Jordan</h3>
                  <p>Product engineering · Offered PPO</p>
                </div>
                <time>Jun 2023 → Feb 2024</time>
              </header>
              <p>
                Built a React and Redux client-management portal with REST APIs and real-time
                WebSocket features.
              </p>
            </article>
            <article data-reveal>
              <header>
                <div>
                  <h3>Vaticinari Solutions</h3>
                  <p>Cybersecurity engineering</p>
                </div>
                <time>Jul → Sep 2023</time>
              </header>
              <p>
                Worked on threat analysis using Neo4j graph data, BloodHound Active Directory
                mapping, and CVE processing.
              </p>
            </article>
            <article data-reveal>
              <header>
                <div>
                  <h3>Llama Mindfulness</h3>
                  <p>Backend engineering</p>
                </div>
                <time>Apr → Jun 2023</time>
              </header>
              <p>
                Built a Node.js backend with Slack Bolt integrations, Moodle LMS plugins, and a
                JavaScript admin portal.
              </p>
            </article>
            <article data-reveal>
              <header>
                <div>
                  <h3>C3i Hub, IIT Kanpur</h3>
                  <p>Web engineering</p>
                </div>
                <time>Jul 2021 → Jul 2022</time>
              </header>
              <p>
                Integrated Drupal and PHP Composer, then built a React threat-map frontend backed
                by Express APIs.
              </p>
            </article>
          </div>
        </section>

        <section className="page-section college-section" aria-labelledby="campus-title">
          <header className="page-section-heading">
            <h2 id="campus-title">Campus work</h2>
            <span>Leadership</span>
          </header>
          <div className="college-ledger" data-college-campus>
            <article data-reveal>
              <div>
                <h3>Head of Web &amp; App, Techkriti ’23</h3>
                <p>
                  Led a 400+ member cross-functional team and re-architected web infrastructure
                  serving 350K+ monthly traffic and 30K+ daily users.
                </p>
              </div>
              <time>2022 → 2023</time>
            </article>
            <article data-reveal>
              <div>
                <h3>Hall Executive Member, Hall 3</h3>
                <p>Served on Hall 3’s student executive body at IIT Kanpur.</p>
              </div>
              <time>2022 → 2023</time>
            </article>
          </div>
        </section>

        <section className="page-afterword" aria-label="Return to about">
          <p>
            Continue with <Link to="/about.html">what I’m doing now →</Link>
          </p>
        </section>
      </div>
    </main>
  )
}

function ProjectSource({ project }) {
  if (!project.github) {
    return (
      <p className="project-source-private">
        <span>{project.repositoryLabel || 'Private repository'}</span>
      </p>
    )
  }

  return (
    <ExternalLink
      className="project-source-link"
      href={project.github}
      aria-label={`Open ${project.title} on GitHub`}
    >
      <GithubIcon />
      <span>GitHub</span>
      <i aria-hidden="true">↗</i>
    </ExternalLink>
  )
}

function RepositoryInvite({ project }) {
  if (!project.github) {
    return (
      <p className="private-note">
        <i /> {project.repositoryLabel || 'Private production repository'}
      </p>
    )
  }

  const isOpenSource = project.category === 'open-source'
  return (
    <ExternalLink className="repository-invite" href={project.github}>
      <GithubIcon />
      <span>
        <small>{isOpenSource ? 'Open source' : 'Public repository'}</small>
        <strong>
          {isOpenSource
            ? `If this is useful, star ${project.title} on GitHub.`
            : `Browse the ${project.title} repository.`}
        </strong>
      </span>
      <i aria-hidden="true">↗</i>
    </ExternalLink>
  )
}

export function ProjectPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const requestedSlug = slug || searchParams.get('project') || 'reel2trip'
  const project = findProject(requestedSlug)
  const projectIndex = project ? projects.findIndex((entry) => entry.slug === project.slug) : -1
  const nextProject = project ? projects[(projectIndex + 1) % projects.length] : null

  useDocumentMeta({
    title: project ? `${project.title} | Swayam Gupta` : 'Project not found | Swayam Gupta',
    description: project?.summary || "A project record from Swayam Gupta's portfolio.",
  })

  if (!project) {
    return (
      <main id="main-content" data-project-root>
        <section className="not-found site-shell">
          <p className="system-label">
            <i /> Error / missing record
          </p>
          <h1>That project is not in this portfolio.</h1>
          <Link className="signal-link" to="/work.html">
            Return to all work <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main id="main-content" data-project-root>
      <section className="project-hero site-shell" aria-labelledby="project-title">
        <Link className="back-link" to="/work.html">
          <span aria-hidden="true">←</span> All work
        </Link>
        <div className="project-heading">
          <p className="project-kicker">
            {project.categoryLabel} · {project.year}
          </p>
          <div className="project-title-line">
            <h1 id="project-title">{project.title}</h1>
            <ProjectSource project={project} />
          </div>
          <p className="project-question">{project.question}</p>
        </div>
        <dl className="project-facts">
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>State</dt>
            <dd>
              <i />
              {project.state}
            </dd>
          </div>
          {project.recognition ? (
            <div>
              <dt>Recognition</dt>
              <dd>{project.recognition}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="trace-section site-shell" aria-labelledby="trace-title">
        <header className="page-section-heading">
          <h2 id="trace-title">Product model</h2>
          <span>How it behaves</span>
        </header>
        <p className="trace-summary">{project.summary}</p>
        <ProductModel project={project} />
      </section>

      <section className="story-section site-shell" aria-labelledby="story-title">
        <header className="page-section-heading">
          <h2 id="story-title">What mattered</h2>
          <span>Build notes</span>
        </header>
        <div className="story-ledger">
          {project.story.map((entry, index) => (
            <article data-reveal key={entry.label}>
              <span>
                {String(index + 1).padStart(2, '0')} · {entry.label}
              </span>
              <h3>{entry.title}</h3>
              <p>{entry.copy}</p>
            </article>
          ))}
        </div>
        <div className="stack-line">
          <span>Built with</span>
          <ul>
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <RepositoryInvite project={project} />
      </section>

      <nav className="next-record" aria-label="Next project">
        <Link className="site-shell" to={projectHref(nextProject.slug)}>
          <span>Next project</span>
          <strong>{nextProject.title}</strong>
          <i aria-hidden="true">→</i>
        </Link>
      </nav>
    </main>
  )
}

export function NotFoundPage() {
  useDocumentMeta({
    title: 'Page not found | Swayam Gupta',
    description: 'The requested page could not be found.',
    noindex: true,
  })

  return (
    <main id="main-content">
      <section className="not-found site-shell">
        <p className="system-label">
          <i /> Error / missing record
        </p>
        <h1>That page is not in this portfolio.</h1>
        <Link className="signal-link" to="/">
          Return home <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  )
}
