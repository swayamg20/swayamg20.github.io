export const siteMeta = {
  name: 'Swayam Gupta',
  role: 'Software Engineer',
}

export const hero = {
  label: 'Software engineer · Voice and conversational systems',
  headline: 'I build voice systems that hold up in production.',
  description:
    'At ixigo, I built the voice pipeline behind an agent that now handles about 60,000 calls a day. As it grew, I built the things I wished I had from day one: a test harness, observability, and evaluations. Together, they make failed conversations easier to reproduce and fix.',
  highlights: [
    'about 60,000 calls a day',
    'voice pipeline + custom test harness',
    'production traces → evaluations → fixes',
  ],
  primaryLink: {
    label: 'Read how the system grew',
    href: '/entry/projects/ixigo-conversational-ai',
  },
}

export const experience = [
  {
    role: 'Software Engineer 2 — AI Products',
    company: 'ixigo',
    companyUrl: 'https://www.ixigo.com',
    period: "Aug'24 — present",
    description:
      "At ixigo, I build conversational AI systems. I engineered the in-house voice pipeline, built a custom test harness, and built the observability product we use to trace and evaluate conversations. The goal was not another dashboard; it was a feedback loop that could turn failures into fixes. I now bring the same thinking to ixigo's in-app multimodal agent.",
  },
  {
    role: 'Founding Engineer',
    company: 'Overlayy AI',
    companyUrl: 'https://overlayy.com',
    period: "Apr'24 — Aug'24",
    description:
      'I joined Overlayy as its first engineer. There was no stack to inherit, so I built the first version end to end: Phoenix services, FastAPI retrieval, AWS deployment, the embeddable client, real-time messaging, and analytics. We brought on the first paying customers before I left.',
  },
]

export const sections = [
  {
    id: 'projects',
    title: 'Selected Work',
    intro: 'A few things I have built, from production voice systems to small public experiments.',
    items: [
      {
        slug: 'ixigo-conversational-ai',
        title: 'Conversational AI at ixigo',
        meta: 'Production · About 60K calls/day · Built in-house',
        summary:
          'It started as a voice pipeline. As call volume grew, I built the missing pieces around it: a test harness, observability, evaluations, and a path from a failed call back to a fix.',
        stack: ['Real-time voice', 'Custom test harness', 'Production tracing', 'Automated evaluations', 'Targeted remediation'],
        status: 'In production at ixigo · Private system',
        links: [],
        content: {
          howItGrew:
            "It began with the voice pipeline for ixigo's conversational agent. The agent now handles about 60,000 calls a day on an in-house stack. At that scale, making a call work was only half the problem; we also needed to understand why a conversation failed.",
          whatIBuilt:
            'I engineered the pipeline, built a custom test harness, and built the observability and evaluation product around it.',
          theFeedbackLoop:
            'A production conversation is traced and evaluated with its surrounding context. That gives us a path from “this call went wrong” to a reproducible case and, for selected failure modes, an automated remediation workflow.',
          whatICanShare:
            'The system and its data are private, so I keep the public description to the problems I owned and the way the pieces fit together.',
        },
      },
      {
        slug: 'reel2trip',
        title: 'Reel2Trip',
        meta: 'Production at ixigo · Hackweek 2025 runner-up',
        summary:
          'Reel2Trip began as our Hackweek project and finished second. We later took it into production. I led the build and owned the backend: getting a Reel in, extracting an itinerary, carrying context into chat, and avoiding repeat model work.',
        stack: ['Python FastAPI', 'Gemini', 'OpenAI', 'MySQL', 'Redis', 'Apify', 'Zep'],
        status: 'Shipped to production at ixigo · Private repository',
        links: [],
        content: {
          howItStarted:
            'The idea was simple: send a travel Reel, get back a usable itinerary, then keep planning in the same conversation. We built it during ixigo Hackweek 2025 and later took it into production.',
          whatIBuilt:
            'I led the Hackweek build and owned the backend path from Reel ingestion to structured extraction, chat memory, caching, and deployment.',
          oneDecisionThatMattered:
            'Reel analysis is expensive, and people often send the same link. Caching the extracted context by Reel ID meant we did not ask the model to watch the same video twice.',
          whatICanShare:
            'The repository and product telemetry are private.',
        },
      },
      {
        slug: 'agentrelay',
        title: 'AgentRelay',
        meta: 'Open Source · Agent Coordination · Early Prototype',
        summary:
          'I wanted two coding agents, owned by different people, to ask each other questions without sharing a repository. AgentRelay is the first working slice: an authenticated mailbox over Postgres, exposed through seven MCP tools. It works as a mailbox today; the durable runtime I have in mind is still ahead.',
        stack: ['TypeScript', 'Hono', 'Postgres', 'Drizzle ORM', '@modelcontextprotocol/sdk'],
        status: 'Early public prototype · An asynchronous mailbox, not an autonomous runtime',
        links: [
          { label: 'GitHub', href: 'https://github.com/swayamg20/AgentRelay' },
        ],
        content: {
          whyIBuiltIt:
            'Coding agents are useful inside one repository. The handoff becomes awkward when another person owns the next repository. I wanted a narrow way for the agents to exchange a question or decision without collapsing that boundary.',
          whatWorksToday:
            'The public repository ships a Hono relay, Postgres-backed identities and messages, a CLI, and seven stdio MCP tools for Claude Code and Codex. The JSON-RPC surface borrows from A2A, but it does not claim full conformance.',
          theBoundary:
            'This is still an early mailbox, not an autonomous agent runtime. Persistent per-machine processes, durable replay, and enforced local policy remain future work.',
        },
      },
      {
        slug: 'murmur',
        title: 'Murmur',
        meta: 'Public Prototype · Voice + Visual Explanation',
        summary:
          'I kept running into explanations that were easy to say but hard to picture. Murmur lets a tutor talk through an idea while the browser draws it. The model describes the scene; the client owns the layout.',
        stack: ['Python FastAPI', 'Next.js 14', 'WebRTC', 'Deepgram', 'Kokoro / ElevenLabs', 'Silero VAD', 'pipecat Smart Turn', 'Rough.js + GSAP'],
        status: 'Working prototype · Integration and reliability work underway',
        links: [
          { label: 'GitHub', href: 'https://github.com/swayamg20/conv-ai-visual' },
          { label: 'Deep dive', href: '/entry/projects/murmur' },
        ],
        content: {
          whyIBuiltIt:
            'Voice is a natural way to ask a follow-up, but it is a poor way to inspect a diagram or equation. Murmur is an experiment in letting those two parts of an explanation happen together.',
          howItWorks:
            'Audio runs over WebRTC. The model returns the spoken explanation and a small description of what should appear on the canvas. The browser turns that description into SVG and keeps it in step with the voice.',
          oneUsefulConstraint:
            'The model decides what to show, not where every pixel goes. Keeping layout in the client makes the result easier to predict and debug.',
          whereItIsNow:
            'The voice and rendering paths work. Persistence, provider-failure handling, and integration testing are still unfinished.',
        },
      },
      {
        slug: 'macos-intelligence-mcp',
        title: 'macOS Intelligence MCP',
        meta: 'Open Source Prototype · macOS Automation',
        summary:
          'An early experiment in giving an MCP client a few explicit controls over my Mac: capture the screen, read text, inspect system state, and assemble supported shortcuts. The shortcut builder is rule-based; it is not a general automation agent.',
        stack: ['Node 18+', '@modelcontextprotocol/sdk', 'AppleScript', 'PyObjC + Apple Vision OCR', 'RobotJS', 'SQLite'],
        status: 'Experimental prototype · Context and file modules remain unfinished',
        links: [
          { label: 'GitHub', href: 'https://github.com/swayamg20/mac-os-automation-mcp' },
        ],
        content: {
          whyIBuiltIt:
            'I wanted to see how useful an MCP client could be with small, inspectable macOS capabilities instead of one broad automation surface.',
          whatWorks:
            'Five small servers cover screen capture and OCR, input control, power information, usage tracking, and shortcut generation. They use AppleScript, RobotJS, Apple Vision through PyObjC, and local SQLite state.',
          theBoundary:
            'Shortcut generation uses phrase matching over supported actions. Context memory and advanced file operations are unfinished, and I do not present the project as a production automation platform.',
        },
      },
    ],
  },
]

export const contactInfo = [
  {
    label: 'Email',
    value: 'gupta.swayam123@gmail.com',
    href: 'mailto:gupta.swayam123@gmail.com',
  },
  {
    label: 'GitHub',
    value: 'github.com/swayamg20',
    href: 'https://github.com/swayamg20',
  },
  {
    label: 'X',
    value: 'x.com/swayamg20',
    href: 'https://x.com/swayamg20',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/swayamgupta20',
    href: 'https://linkedin.com/in/swayamgupta20',
  },
]

const sectionMap = Object.fromEntries(sections.map((section) => [section.id, section]))

export function getSectionById(sectionId) {
  return sectionMap[sectionId] ?? null
}

export function findSectionItemBySlug(sectionId, slug) {
  const section = getSectionById(sectionId)
  return section?.items.find((item) => item.slug === slug) ?? null
}
