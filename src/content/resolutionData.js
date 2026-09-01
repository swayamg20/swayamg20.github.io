export const RESOLUTION_PROJECTS = [
  {
    slug: 'reel2trip',
    order: '05',
    title: 'Reel2Trip',
    category: 'shipped',
    categoryLabel: 'Shipped',
    year: '2025',
    state: 'In production',
    recognition: 'Hackweek 2025 runner-up',
    signal: 'lime',
    role: 'Lead / backend',
    question: 'Can a travel reel become a plan you can keep refining?',
    cardLine: 'Travel reel in, editable itinerary and conversation out.',
    summary:
      'A production flow that turns a shared travel video into a structured itinerary, then carries that context into conversation.',
    flow: [
      ['input', 'shared travel reel'],
      ['interpret', 'multimodal extraction'],
      ['compose', 'structured itinerary'],
      ['continue', 'contextual follow-up'],
    ],
    story: [
      {
        label: 'Problem',
        title: 'Inspiration arrives unstructured.',
        copy:
          'A reel can make a place feel irresistible, but it rarely says what belongs in a day-by-day plan. The useful signal is mixed with pacing, narration, captions, and visual context.',
      },
      {
        label: 'Build',
        title: 'One path from clip to conversation.',
        copy:
          'I led the Hackweek build and owned the backend path: reel ingestion, structured extraction, itinerary generation, chat context, caching, and deployment.',
      },
      {
        label: 'Decision',
        title: 'Do not watch the same reel twice.',
        copy:
          'Reel analysis is expensive and shared links repeat. Caching extracted context by reel ID made follow-ups faster and avoided asking the model to redo identical work.',
      },
      {
        label: 'Boundary',
        title: 'What stays private.',
        copy:
          'The production repository, interface, and telemetry belong to ixigo. This page is a sanitized account of the system boundary and the decisions I owned.',
      },
    ],
    stack: ['Python FastAPI', 'Gemini', 'OpenAI', 'MySQL', 'Redis', 'Apify', 'Zep'],
    github: '',
  },
  {
    slug: 'agentrelay',
    order: '01',
    title: 'AgentRelay',
    category: 'open-source',
    categoryLabel: 'Open source',
    year: '2026',
    state: 'Mailbox 0.2.1 released',
    signal: 'cyan',
    role: 'Creator',
    question: 'How should coding agents ask each other for help across repository boundaries?',
    cardLine: 'Authenticated agent handoffs across repositories and machines.',
    summary:
      'An authenticated mailbox and MCP toolkit for agents owned by different people, working in different repositories.',
    flow: [
      ['request', 'agent / repository A'],
      ['route', 'authenticated mailbox'],
      ['record', 'explicit message state'],
      ['deliver', 'agent / repository B'],
    ],
    story: [
      {
        label: 'Problem',
        title: 'The handoff is still manual.',
        copy:
          'Coding agents work well inside one repository. When the next piece belongs to someone else, people fall back to copying questions and answers between windows.',
      },
      {
        label: 'Build',
        title: 'A narrow coordination layer.',
        copy:
          'The public slice includes a Hono relay, Postgres-backed identities and messages, a CLI, and seven stdio MCP tools for Claude Code and Codex.',
      },
      {
        label: 'Decision',
        title: 'Messages are state, not chat bubbles.',
        copy:
          'A handoff moves through explicit states so both sides can tell whether it was proposed, accepted, or completed without pretending the agents share ownership.',
      },
      {
        label: 'Boundary',
        title: 'Mailbox shipped, autonomy still gated.',
        copy:
          'The authenticated mailbox and durable Mission control plane are shipped. Real autonomous coding-agent Missions remain experimental and are not an available end-user path yet.',
      },
    ],
    stack: ['TypeScript', 'Hono', 'Postgres', 'Drizzle ORM', 'MCP SDK'],
    github: 'https://github.com/swayamg20/AgentRelay',
  },
  {
    slug: 'conversational-ai-visual-layer',
    order: '02',
    title: 'Visual layer for conversational AI',
    category: 'prototype',
    categoryLabel: 'Prototype',
    year: '2026',
    state: 'Working prototype',
    signal: 'violet',
    role: 'Creator',
    question: 'Can an explanation draw while it speaks?',
    cardLine: 'Voice in, synchronized diagrams and canvas actions out.',
    summary:
      'A voice-first tutor that talks through an idea while the browser builds a synchronized visual explanation.',
    flow: [
      ['listen', 'spoken question'],
      ['describe', 'semantic scene'],
      ['render', 'deterministic SVG'],
      ['align', 'voice + visual'],
    ],
    story: [
      {
        label: 'Problem',
        title: 'Some explanations need two channels.',
        copy:
          'Voice is natural for questions and follow-ups. It is a poor place to inspect a diagram, equation, or spatial relationship after the sentence has passed.',
      },
      {
        label: 'Build',
        title: 'Speech and scene, side by side.',
        copy:
          'Audio runs over WebRTC. The model returns spoken content plus a small semantic description of what should appear. The browser turns that description into SVG.',
      },
      {
        label: 'Decision',
        title: 'Meaning from the model, geometry from code.',
        copy:
          'The model chooses what to show, not where every pixel goes. Keeping layout and timing in the client makes the visual output predictable and debuggable.',
      },
      {
        label: 'Boundary',
        title: 'Where it is now.',
        copy:
          'The voice and rendering paths work. Persistence, provider-failure handling, and integration reliability still need work.',
      },
    ],
    stack: ['Python FastAPI', 'Next.js 14', 'WebRTC', 'Deepgram', 'Kokoro / ElevenLabs', 'Silero VAD', 'pipecat Smart Turn', 'Rough.js + GSAP'],
    github: 'https://github.com/swayamg20/conv-ai-visual',
  },
  {
    slug: 'macos-intelligence-mcp',
    order: '04',
    title: 'macOS Intelligence MCP',
    category: 'open-source',
    categoryLabel: 'Open source',
    year: '2025',
    state: 'Experimental',
    signal: 'coral',
    role: 'Creator',
    question: 'What if a desktop agent had small, inspectable capabilities instead of one giant permission?',
    cardLine: 'Five narrow MCP servers for inspectable macOS capabilities.',
    summary:
      'Five focused MCP servers for screen understanding, system controls, usage state, and supported Apple Shortcuts.',
    flow: [
      ['request', 'explicit capability'],
      ['select', 'narrow MCP server'],
      ['execute', 'native action'],
      ['return', 'inspectable result'],
    ],
    story: [
      {
        label: 'Problem',
        title: 'Broad automation hides too much.',
        copy:
          'A single do-anything desktop tool is difficult to inspect and harder to trust. I wanted to see how useful a client could be with narrow native capabilities.',
      },
      {
        label: 'Build',
        title: 'Five explicit surfaces.',
        copy:
          'Separate servers cover screen capture and OCR, input control, power information, usage tracking, and shortcut generation with local state.',
      },
      {
        label: 'Decision',
        title: 'Supported actions stay rule-based.',
        copy:
          'Shortcut generation uses phrase matching over an explicit action set. It is deliberately more constrained than a general automation agent.',
      },
      {
        label: 'Boundary',
        title: 'Still an experiment.',
        copy:
          'Context memory and advanced file operations are unfinished. The project is a capability study, not a production desktop platform.',
      },
    ],
    stack: ['Node 18+', 'MCP SDK', 'AppleScript', 'PyObjC + Apple Vision OCR', 'RobotJS', 'SQLite'],
    github: 'https://github.com/swayamg20/mac-os-automation-mcp',
  },
  {
    slug: 'cmux-agent-orchestrator',
    order: '03',
    title: 'cmux Agent Orchestrator',
    category: 'open-source',
    categoryLabel: 'Open source',
    year: '2026',
    state: 'Community plugin · v0.1.1',
    signal: 'cyan',
    role: 'Creator / maintainer',
    question:
      'How can one developer supervise many coding-agent sessions without taking ownership away from their terminals and runtimes?',
    cardLine: 'An Obsidian cockpit for Claude Code and Codex sessions running in cmux.',
    summary:
      'A desktop Obsidian cockpit that connects durable Markdown tasks to Claude Code and Codex runs already owned by cmux.',
    flow: [
      ['observe', 'cmux topology'],
      ['classify', 'bounded evidence'],
      ['link', 'durable Markdown task'],
      ['focus', 'exact cmux surface'],
    ],
    story: [
      {
        label: 'Problem',
        title: 'Agent work disappears into terminal windows.',
        copy:
          'Claude Code and Codex sessions can span repositories and terminals, while the goal, decisions, review state, and human follow-up live somewhere else.',
      },
      {
        label: 'Build',
        title: 'An Obsidian cockpit over cmux.',
        copy:
          'The plugin observes cmux surfaces, conservatively classifies Claude Code and Codex sessions, links them to durable Markdown tasks, shows bounded previews, and focuses the exact surface on request.',
      },
      {
        label: 'Decision',
        title: 'Observation is not process ownership.',
        copy:
          'cmux owns terminals and process lifetime. Obsidian owns durable work context. The plugin never sends terminal input or marks a task complete from weak runtime evidence.',
      },
      {
        label: 'Boundary',
        title: 'Available in Obsidian Community Plugins.',
        copy:
          'Version 0.1.1 is available directly through Obsidian Community Plugins. It remains desktop-only because it coordinates sessions already running in cmux on macOS.',
      },
    ],
    stack: ['TypeScript', 'Obsidian API', 'cmux', 'Markdown', 'Vitest', 'esbuild'],
    github: 'https://github.com/swayamg20/cmux-agent-orchestrator',
    communityUrl: 'https://community.obsidian.md/plugins/cmux-agent-orchestrator',
  },
  {
    slug: 'isro-xray-burst',
    order: '06',
    title: 'ISRO X-ray burst automation',
    category: 'research',
    categoryLabel: 'Inter IIT Tech Meet',
    year: '2022',
    state: 'Competition archive',
    recognition: 'Silver medal · ISRO problem statement',
    signal: 'lime',
    role: 'Frontend and product documentation',
    question: 'Can solar X-ray burst review become a clear, repeatable web workflow?',
    cardLine: 'A review workflow for identifying solar X-ray bursts.',
    summary:
      'A web system for identifying and reviewing solar X-ray bursts, built for an ISRO problem statement at Inter IIT Tech Meet 10.0.',
    flow: [
      ['ingest', 'solar observation data'],
      ['identify', 'candidate X-ray bursts'],
      ['organize', 'curve state + metadata'],
      ['review', 'web-based evidence'],
    ],
    story: [
      {
        label: 'Problem',
        title: 'Scientific signals needed a usable review surface.',
        copy:
          'The team needed to move from raw solar-observation data to candidate X-ray bursts that could be inspected and discussed through a web interface.',
      },
      {
        label: 'Build',
        title: 'A React interface around the analysis.',
        copy:
          'I worked on the web product, organizing curve data in React state, preparing JSON payloads, and connecting the interface to the server workflow.',
      },
      {
        label: 'Decision',
        title: 'Keep every curve tied to structured data.',
        copy:
          'Saving plot details as structured state made the UI easier to update and kept the handoff between the interface and analysis path explicit.',
      },
      {
        label: 'Credibility',
        title: 'An ISRO problem statement at Inter IIT.',
        copy:
          'The work was built for Inter IIT Tech Meet 10.0. It earned a silver medal in the mid-prep event, and IIT Kanpur finished second overall.',
      },
    ],
    stack: ['React', 'JavaScript', 'React Hooks', 'JSON APIs'],
    github: '',
    repositoryLabel: 'Competition archive',
  },
  {
    slug: 'journal-scraper',
    order: '07',
    title: 'Journal scraper for data mining',
    category: 'research',
    categoryLabel: 'Supervised project',
    year: '2022',
    state: 'Academic archive',
    recognition: 'Supervised by Prof. Shikhar Krishan Jha',
    signal: 'cyan',
    role: 'Full-stack engineer',
    question: 'Can bibliography files become a clean author and citation dataset?',
    cardLine: 'Research exports into structured author, DOI, and citation data.',
    summary:
      'A supervised data-mining project that parsed research exports, extracted author and DOI metadata, and enriched records with citation counts.',
    flow: [
      ['collect', '.ris + .bib exports'],
      ['extract', 'authors + DOI'],
      ['enrich', 'Scopus citation data'],
      ['serve', 'searchable web output'],
    ],
    story: [
      {
        label: 'Problem',
        title: 'Research exports are files, not a usable dataset.',
        copy:
          'Bibliography exports contain useful author, publication, and DOI information, but the data has to be normalized before it can support analysis.',
      },
      {
        label: 'Build',
        title: 'Parsing, entity extraction, and enrichment.',
        copy:
          'I automated ingestion of RIS and BibTeX files, used named-entity recognition to extract author entities and DOI URLs, and fetched citation counts through the Scopus Cited By API.',
      },
      {
        label: 'Decision',
        title: 'Separate extraction from external enrichment.',
        copy:
          'The Flask path kept locally parsed metadata distinct from citation data returned by external APIs, then exposed both through a simple web interface.',
      },
      {
        label: 'Credibility',
        title: 'Built under faculty supervision.',
        copy:
          'The project was supervised by Prof. Shikhar Krishan Jha at IIT Kanpur from July to December 2022.',
      },
    ],
    stack: ['Python', 'Flask', 'NER', 'RIS and BibTeX parsing', 'Scopus Cited By API'],
    github: '',
    repositoryLabel: 'Academic archive',
  },
].sort((left, right) => left.order.localeCompare(right.order))

export const RESOLUTION_FEATURED_PROJECTS = [
  'agentrelay',
  'conversational-ai-visual-layer',
  'cmux-agent-orchestrator',
  'macos-intelligence-mcp',
]

export const RESOLUTION_RECENTLY_SHIPPED = [
  {
    date: 'Aug 2026',
    title: 'cmux Agent Orchestrator 0.1.1',
    note: 'Released in Obsidian Community Plugins',
    href: 'https://community.obsidian.md/plugins/cmux-agent-orchestrator',
  },
  {
    date: 'Aug 2026',
    title: 'AgentRelay MCP mailbox 0.2.1',
    note: 'Published agent-handoff release',
    href: 'https://github.com/swayamg20/AgentRelay/releases/tag/agentrelay-mcp-v0.2.1',
  },
  {
    date: 'May 2026',
    title: 'TARA at ixigo',
    note: 'Multimodal AI travel assistant launch',
    href: 'https://www.linkedin.com/posts/swayamgupta20_ixigonext-tara-traveltech-activity-7460399846320005120-nOs9',
  },
]

export const RESOLUTION_WRITING = [
  {
    order: '01',
    topic: 'Agent systems',
    date: 'Mar 2026',
    readTime: '10 min',
    title: 'What I learned building a voice travel agent in four hours',
    summary: 'Composing skills, tools, travel APIs, and voice without writing a custom backend.',
    href: 'articles/voice-travel-agent-openclaw/',
  },
  {
    order: '02',
    topic: 'Build systems',
    date: 'Aug 2025',
    readTime: '8 min',
    title: 'Shipping one JavaScript SDK to web, React Native, and Node',
    summary: 'Package boundaries and target adapters without duplicating the core.',
    href: 'articles/multi-target-javascript-sdk-build-tooling/',
  },
  {
    order: '03',
    topic: 'Performance',
    date: 'Apr 2025',
    readTime: '6 min',
    title: 'Caching Lottie assets in IndexedDB',
    summary: 'A small persistence change that removed repeat animation downloads.',
    href: 'articles/indexeddb-lottie-persistence/',
  },
]

export const RESOLUTION_DRAFTS = [
  {
    order: '01',
    topic: 'Product vision',
    date: 'Feb 2026',
    readTime: '12 min',
    title: 'Intelligence at the Speed of Speech',
    summary: 'A vision for conversational AI that thinks alongside you, remembers, and shows what it means.',
    href: 'articles/intelligence-at-the-speed-of-speech/',
  },
]

export const RESOLUTION_READING = [
  {
    title: 'The Bitter Lesson',
    author: 'Rich Sutton',
    format: 'Essay',
    year: '2019',
    note: 'A sharp argument for scalable learning over handcrafted cleverness.',
    href: 'http://www.incompleteideas.net/IncIdeas/BitterLesson.html',
  },
  {
    title: 'Building effective agents',
    author: 'Anthropic',
    format: 'Field guide',
    year: '2024',
    note: 'A clear map of when a workflow should become an agent.',
    href: 'https://www.anthropic.com/engineering/building-effective-agents',
  },
  {
    title: 'What We’ve Learned From A Year of Building with LLMs',
    author: 'Eugene Yan et al.',
    format: 'Practitioner guide',
    year: '2024',
    note: 'Evals, guardrails, teams, and the engineering beyond the demo.',
    href: 'https://applied-llms.org/',
  },
  {
    title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
    author: 'Shunyu Yao et al.',
    format: 'Paper',
    year: '2023',
    note: 'The paper behind the reason, act, and observe loop.',
    href: 'https://arxiv.org/abs/2210.03629',
  },
  {
    title: 'The Tail at Scale',
    author: 'Jeff Dean & Luiz André Barroso',
    format: 'Paper',
    year: '2013',
    note: 'Why large systems fail at the slowest edge, not the average.',
    href: 'https://research.google/pubs/the-tail-at-scale/',
  },
]
