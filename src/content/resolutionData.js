export const RESOLUTION_PROJECTS = [
  {
    slug: 'reel2trip',
    order: '01',
    title: 'Reel2Trip',
    category: 'shipped',
    categoryLabel: 'Shipped',
    year: '2025',
    state: 'In production',
    recognition: 'Hackweek 2025 runner-up',
    signal: 'lime',
    role: 'Lead / backend',
    question: 'Can a travel reel become a plan you can keep refining?',
    cardLine: 'Reel → itinerary → conversation',
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
    order: '02',
    title: 'AgentRelay',
    category: 'open-source',
    categoryLabel: 'Open source',
    year: '2026',
    state: 'Early prototype',
    signal: 'cyan',
    role: 'Creator',
    question: 'How should coding agents ask each other for help across repository boundaries?',
    cardLine: 'Agent handoffs across repository boundaries',
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
        title: 'Mailbox today, runtime later.',
        copy:
          'It is an asynchronous mailbox, not an autonomous agent runtime. Durable replay, persistent machine processes, and enforced local policy remain future work.',
      },
    ],
    stack: ['TypeScript', 'Hono', 'Postgres', 'Drizzle ORM', 'MCP SDK'],
    github: 'https://github.com/swayamg20/AgentRelay',
  },
  {
    slug: 'murmur',
    order: '03',
    title: 'Murmur',
    category: 'prototype',
    categoryLabel: 'Prototype',
    year: '2026',
    state: 'Working prototype',
    signal: 'violet',
    role: 'Creator',
    question: 'Can an explanation draw while it speaks?',
    cardLine: 'Voice explanations that draw themselves',
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
    cardLine: 'Small, inspectable desktop capabilities',
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
    slug: 'synthio',
    order: '05',
    title: 'Synthio',
    category: 'prototype',
    categoryLabel: 'Prototype',
    year: '2026',
    state: 'Working demo',
    signal: 'violet',
    role: 'Designer / engineer',
    question: 'Can a presentation feel like a dialogue instead of a broadcast?',
    cardLine: 'A presentation that can hear',
    summary:
      'An AI voice presenter that narrates slides, accepts interruptions, answers questions, and navigates the deck through conversation.',
    flow: [
      ['hear', 'live question'],
      ['structure', 'response schema'],
      ['stream', 'speech + tool calls'],
      ['change', 'slide state'],
    ],
    story: [
      {
        label: 'Problem',
        title: 'A deck cannot hear the room.',
        copy:
          'Traditional presentations move in one direction. Questions break the flow, and static diagrams cannot respond when someone wants a deeper explanation.',
      },
      {
        label: 'Build',
        title: 'A presenter with interruptible voice.',
        copy:
          'Synthio combines streaming transcription, structured tool calls, per-sentence TTS, slide navigation, diagram highlighting, and contextual follow-ups.',
      },
      {
        label: 'Decision',
        title: 'Stream useful structure early.',
        copy:
          'Every answer follows a strict response schema. Sentences are extracted while the response streams so speech can begin before the full payload is complete.',
      },
      {
        label: 'Boundary',
        title: 'A prepared-deck exploration.',
        copy:
          'It uses a prepared deck. Importing arbitrary presentations, long-term memory, and production reliability are future work.',
      },
    ],
    stack: ['Next.js', 'TypeScript', 'Deepgram', 'OpenAI', 'ElevenLabs', 'Web Audio API'],
    github: 'https://github.com/swayamg20/synthio-voice-presenter',
  },
  {
    slug: 'fieldpulse',
    order: '06',
    title: 'FieldPulse',
    category: 'prototype',
    categoryLabel: 'Prototype',
    year: '2026',
    state: 'Prototype',
    signal: 'coral',
    role: 'Full-stack engineer',
    question: 'Can routine field check-ins become structured operational signal?',
    cardLine: 'Field calls into operational signal',
    summary:
      'A field-sales prototype that prioritizes rep calls, assembles context, and turns post-call data into store-level alerts.',
    flow: [
      ['score', 'rep + store risk'],
      ['prepare', 'context queue'],
      ['call', 'voice agent'],
      ['act', 'structured alert'],
    ],
    story: [
      {
        label: 'Problem',
        title: 'Important context lives inside repetitive calls.',
        copy:
          'Managers spend hours checking in with field reps, while store risk, competitor activity, and pending follow-ups remain difficult to compare systematically.',
      },
      {
        label: 'Build',
        title: 'Prioritize, call, then act.',
        copy:
          'The prototype scores a call queue, builds a context-aware prompt, triggers a Bolna voice agent, and processes webhooks into store updates and alerts.',
      },
      {
        label: 'Decision',
        title: 'Context is assembled before the call.',
        copy:
          'Each conversation receives the stores, risks, and unresolved work that matter for that rep instead of one generic script for everyone.',
      },
      {
        label: 'Boundary',
        title: 'Prototype scope.',
        copy:
          'The repository demonstrates the workflow with SQLite and seeded data. It is not presented as a deployed field-sales product.',
      },
    ],
    stack: ['Next.js', 'TypeScript', 'SQLite', 'Bolna', 'Deepgram', 'ElevenLabs', 'Plivo'],
    github: 'https://github.com/swayamg20/bolna-field-rep-agent',
  },
  {
    slug: 'feather-analysis',
    order: '07',
    title: 'Feather call analysis',
    category: 'prototype',
    categoryLabel: 'Systems exercise',
    year: '2026',
    state: 'Small service',
    signal: 'cyan',
    role: 'Backend engineer',
    question: 'What is the smallest useful post-call analysis pipeline?',
    cardLine: 'Voice events into test evidence',
    summary:
      'A Node service that ingests voice-agent events over WebSocket, computes analysis when a call ends, and persists the result.',
    flow: [
      ['ingest', 'WebSocket events'],
      ['trigger', 'end_call'],
      ['compute', 'metrics + analysis'],
      ['persist', 'versioned run'],
    ],
    story: [
      {
        label: 'Problem',
        title: 'A transcript alone is not a diagnosis.',
        copy:
          'Voice-agent testing needs a compact view of turns, latency, required tools, executed tools, and missed actions after the call finishes.',
      },
      {
        label: 'Build',
        title: 'One event path, one persisted result.',
        copy:
          'The service buffers per-call events, builds metrics and a structured analysis on end_call, then stores the result and test summary in SQLite.',
      },
      {
        label: 'Decision',
        title: 'Keep versioning at the run level.',
        copy:
          'A test run carries its version so the same scenario can be evaluated across iterations without complicating each individual event.',
      },
      {
        label: 'Boundary',
        title: 'Deliberately narrow.',
        copy:
          'This is a focused systems exercise using in-memory active-call state and SQLite, not a distributed observability platform.',
      },
    ],
    stack: ['Node.js', 'Express', 'WebSocket', 'Sequelize', 'SQLite'],
    github: 'https://github.com/swayamg20/feather-post-call-analytics',
  },
  {
    slug: 'webrtc-voice-ai',
    order: '08',
    title: 'WebRTC voice AI',
    category: 'prototype',
    categoryLabel: 'Early prototype',
    year: '2025',
    state: 'Technical sketch',
    signal: 'lime',
    role: 'Engineer',
    question: 'What does the smallest live transcription loop look like?',
    cardLine: 'The smallest live transcription loop',
    summary:
      'An early WebRTC experiment that sends microphone audio through a Node service for live Deepgram transcription.',
    flow: [
      ['capture', 'microphone audio'],
      ['transport', 'WebRTC stream'],
      ['transcribe', 'Deepgram live'],
      ['surface', 'partial text'],
    ],
    story: [
      {
        label: 'Problem',
        title: 'Realtime starts with transport.',
        copy:
          'Before orchestration and polished voice UX, a system has to move microphone audio reliably and surface partial text quickly enough to feel live.',
      },
      {
        label: 'Build',
        title: 'A deliberately small loop.',
        copy:
          'The repository connects browser audio, a Node and Express service, and Deepgram live transcription as a focused transport experiment.',
      },
      {
        label: 'Decision',
        title: 'Learn the primitive first.',
        copy:
          'The project isolates streaming and transcription rather than hiding them inside a larger assistant architecture.',
      },
      {
        label: 'Boundary',
        title: 'An early technical sketch.',
        copy:
          'It is not a full conversational agent. Turn-taking, synthesis, memory, reliability, and product behavior sit outside this repository.',
      },
    ],
    stack: ['JavaScript', 'Node.js', 'Express', 'WebRTC', 'Deepgram'],
    github: 'https://github.com/swayamg20/webrtc-voice-ai',
  },
  {
    slug: 'isro-xray-burst',
    order: '09',
    title: 'ISRO X-ray burst automation',
    category: 'research',
    categoryLabel: 'Inter IIT Tech Meet',
    year: '2022',
    state: 'Competition archive',
    recognition: 'Silver medal · ISRO problem statement',
    signal: 'lime',
    role: 'Frontend and product documentation',
    question: 'Can solar X-ray burst review become a clear, repeatable web workflow?',
    cardLine: 'Solar-burst data into reviewable curves',
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
    order: '10',
    title: 'Journal scraper for data mining',
    category: 'research',
    categoryLabel: 'Supervised project',
    year: '2022',
    state: 'Academic archive',
    recognition: 'Supervised by Prof. Shikhar Krishan Jha',
    signal: 'cyan',
    role: 'Full-stack engineer',
    question: 'Can bibliography files become a clean author and citation dataset?',
    cardLine: 'Bibliography files into citation data',
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
]

export const RESOLUTION_FEATURED_PROJECTS = [
  'reel2trip',
  'agentrelay',
  'murmur',
  'macos-intelligence-mcp',
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
