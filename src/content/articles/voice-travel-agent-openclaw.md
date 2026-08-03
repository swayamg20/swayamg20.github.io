---
title: What I learned building a voice travel agent in four hours
date: Mar 1, 2026
readTime: 10 min read
subtitle: A buildathon note on composing skills, tools, and voice without writing a custom backend.
summary: A buildathon note on composing skills, tools, and voice without writing a custom backend.
heroLabel: Buildathon notes · March 2026
authorName: Swayam Gupta
authorMeta: Mar 2026 · Software Engineer at ixigo
tags: OpenClaw, Voice AI, AI Agents, Buildathon, Travel Tech, ElevenLabs, Whisper
---

At India's first OpenClaw Buildathon, I gave myself one constraint: four hours, one person, and a travel flow that had to work from end to end.

By the deadline, TripClaw could take voice or text in Telegram, suggest a destination, build an itinerary, search live flight prices, add the plan to Google Calendar, and reply in voice. The judge called it his favorite build.

The interesting part was not the feature count. I had written almost no custom backend. Most of the behavior lived in Markdown skills and a few CLI tools. These are my notes on what that architecture made easy, and where it pushed the complexity instead.

---

## What TripClaw Does

One Telegram chat. Voice or text. Seven skills.

<div class="oc-skill-grid">
  <div class="oc-skill-card">
    <h4>Save</h4>
    <p>Forward a YouTube link or say "I want to visit Hampi" — auto-tagged and stored in memory.</p>
  </div>
  <div class="oc-skill-card">
    <h4>Discover</h4>
    <p>"Weekend mountains 8K budget" gets 2-3 opinionated picks. Not 10 generic ones.</p>
  </div>
  <div class="oc-skill-card">
    <h4>Plan</h4>
    <p>Day-wise itinerary with real times, real restaurants, budget breakdown.</p>
  </div>
  <div class="oc-skill-card">
    <h4>Search</h4>
    <p>Actual flight prices and booking links from the live web. Not hallucinated.</p>
  </div>
  <div class="oc-skill-card">
    <h4>Calendar</h4>
    <p>"Add to calendar" creates Google Calendar events. This got the biggest reaction.</p>
  </div>
  <div class="oc-skill-card">
    <h4>Briefing</h4>
    <p>Weather + calendar + one news headline. Daily-use hook, not just travel.</p>
  </div>
  <div class="oc-skill-card">
    <h4>Voice</h4>
    <p>Voice note in, voice reply out. Whisper + ElevenLabs. With filler messages for latency.</p>
  </div>
</div>

The personality layer (SOUL.md) makes it behave like that well-traveled Indian friend who thinks in rupees and Volvo sleeper buses. It never gives you 10 options. It never sounds like a travel blog. It says things like *"skip Manali, it's overcrowded in March — Tirthan Valley instead."*

---

## The Architecture

<div class="oc-diagram">
<svg width="680" height="520" viewBox="0 0 680 520" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="sketchy">
      <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="2"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="sketchy2">
      <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="2" result="noise" seed="5"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <rect x="20" y="30" width="140" height="70" rx="8" fill="#dbeafe" stroke="#2d2a24" stroke-width="2.5" filter="url(#sketchy)"/>
  <text x="90" y="58" text-anchor="middle" font-family="Caveat, cursive" font-size="20" font-weight="700" fill="#2d2a24">User</text>
  <text x="90" y="82" text-anchor="middle" font-family="Caveat, cursive" font-size="16" fill="#6b6560">Telegram</text>
  <path d="M90 100 L90 145" stroke="#2d2a24" stroke-width="2.5" fill="none" stroke-dasharray="6,4" filter="url(#sketchy2)"/>
  <polygon points="82,140 90,155 98,140" fill="#2d2a24"/>
  <text x="110" y="130" font-family="Caveat, cursive" font-size="15" fill="#e85d3a" transform="rotate(-5, 110, 130)">voice / text</text>
  <rect x="10" y="155" width="660" height="340" rx="12" fill="none" stroke="#2d2a24" stroke-width="2.5" stroke-dasharray="8,5" filter="url(#sketchy)"/>
  <text x="340" y="185" text-anchor="middle" font-family="Caveat, cursive" font-size="22" font-weight="700" fill="#2d2a24">OpenClaw Gateway (Docker, Hostinger VPS)</text>
  <rect x="40" y="205" width="160" height="55" rx="6" fill="#fee2e2" stroke="#2d2a24" stroke-width="2" filter="url(#sketchy)"/>
  <text x="120" y="228" text-anchor="middle" font-family="Caveat, cursive" font-size="18" font-weight="700" fill="#2d2a24">SOUL.md</text>
  <text x="120" y="248" text-anchor="middle" font-family="Caveat, cursive" font-size="14" fill="#6b6560">personality + rules</text>
  <rect x="260" y="205" width="160" height="55" rx="6" fill="#fef9c3" stroke="#2d2a24" stroke-width="2" filter="url(#sketchy)"/>
  <text x="340" y="228" text-anchor="middle" font-family="Caveat, cursive" font-size="18" font-weight="700" fill="#2d2a24">GPT-5.2</text>
  <text x="340" y="248" text-anchor="middle" font-family="Caveat, cursive" font-size="14" fill="#6b6560">the brain</text>
  <rect x="480" y="205" width="160" height="55" rx="6" fill="#f3e8ff" stroke="#2d2a24" stroke-width="2" filter="url(#sketchy)"/>
  <text x="560" y="228" text-anchor="middle" font-family="Caveat, cursive" font-size="18" font-weight="700" fill="#2d2a24">Memory</text>
  <text x="560" y="248" text-anchor="middle" font-family="Caveat, cursive" font-size="14" fill="#6b6560">learns over time</text>
  <text x="56" y="295" font-family="Caveat, cursive" font-size="17" font-weight="700" fill="#e85d3a" transform="rotate(-2, 56, 295)">Skills →</text>
  <rect x="130" y="280" width="105" height="42" rx="5" fill="#dcfce7" stroke="#2d2a24" stroke-width="1.8" filter="url(#sketchy2)"/>
  <text x="182" y="306" text-anchor="middle" font-family="Caveat, cursive" font-size="15" fill="#2d2a24">trip-discover</text>
  <rect x="250" y="280" width="85" height="42" rx="5" fill="#dcfce7" stroke="#2d2a24" stroke-width="1.8" filter="url(#sketchy2)"/>
  <text x="292" y="306" text-anchor="middle" font-family="Caveat, cursive" font-size="15" fill="#2d2a24">trip-plan</text>
  <rect x="350" y="280" width="100" height="42" rx="5" fill="#dcfce7" stroke="#2d2a24" stroke-width="1.8" filter="url(#sketchy2)"/>
  <text x="400" y="306" text-anchor="middle" font-family="Caveat, cursive" font-size="15" fill="#2d2a24">trip-search</text>
  <rect x="465" y="280" width="85" height="42" rx="5" fill="#dcfce7" stroke="#2d2a24" stroke-width="1.8" filter="url(#sketchy2)"/>
  <text x="507" y="306" text-anchor="middle" font-family="Caveat, cursive" font-size="15" fill="#2d2a24">trip-save</text>
  <rect x="565" y="280" width="85" height="42" rx="5" fill="#dcfce7" stroke="#2d2a24" stroke-width="1.8" filter="url(#sketchy2)"/>
  <text x="607" y="306" text-anchor="middle" font-family="Caveat, cursive" font-size="15" fill="#2d2a24">+3 more</text>
  <text x="56" y="370" font-family="Caveat, cursive" font-size="17" font-weight="700" fill="#e85d3a" transform="rotate(-2, 56, 370)">Tools →</text>
  <rect x="130" y="350" width="100" height="50" rx="5" fill="#ffedd5" stroke="#2d2a24" stroke-width="1.8" filter="url(#sketchy2)"/>
  <text x="180" y="372" text-anchor="middle" font-family="Caveat, cursive" font-size="16" font-weight="600" fill="#2d2a24">Tavily</text>
  <text x="180" y="390" text-anchor="middle" font-family="Caveat, cursive" font-size="13" fill="#6b6560">web search</text>
  <rect x="248" y="350" width="100" height="50" rx="5" fill="#ffedd5" stroke="#2d2a24" stroke-width="1.8" filter="url(#sketchy2)"/>
  <text x="298" y="372" text-anchor="middle" font-family="Caveat, cursive" font-size="16" font-weight="600" fill="#2d2a24">gog CLI</text>
  <text x="298" y="390" text-anchor="middle" font-family="Caveat, cursive" font-size="13" fill="#6b6560">google cal</text>
  <rect x="366" y="350" width="100" height="50" rx="5" fill="#ffedd5" stroke="#2d2a24" stroke-width="1.8" filter="url(#sketchy2)"/>
  <text x="416" y="372" text-anchor="middle" font-family="Caveat, cursive" font-size="16" font-weight="600" fill="#2d2a24">Whisper</text>
  <text x="416" y="390" text-anchor="middle" font-family="Caveat, cursive" font-size="13" fill="#6b6560">voice → text</text>
  <rect x="484" y="350" width="110" height="50" rx="5" fill="#ffedd5" stroke="#2d2a24" stroke-width="1.8" filter="url(#sketchy2)"/>
  <text x="539" y="372" text-anchor="middle" font-family="Caveat, cursive" font-size="16" font-weight="600" fill="#2d2a24">ElevenLabs</text>
  <text x="539" y="390" text-anchor="middle" font-family="Caveat, cursive" font-size="13" fill="#6b6560">text → voice</text>
  <path d="M560 430 C580 445, 600 440, 610 460" stroke="#e85d3a" stroke-width="2" fill="none" filter="url(#sketchy2)"/>
  <text x="520" y="475" font-family="Caveat, cursive" font-size="17" fill="#e85d3a" transform="rotate(-3, 520, 475)">no custom backend!</text>
  <text x="530" y="495" font-family="Caveat, cursive" font-size="15" fill="#e85d3a" transform="rotate(-2, 530, 495)">just markdown files + CLI tools</text>
</svg>
</div>

No custom backend. No Express server. No database. The entire thing is SKILL.md files telling an LLM what to do, and a handful of CLI tools it can invoke.

### The Skill System

This is the core architectural insight of OpenClaw and the thing that made the 4-hour timeline possible.

A skill is just a markdown file. It has YAML frontmatter (name, description, requirements) and a body that's essentially a playbook: when to activate, what tools to use, what format to output. The LLM reads the relevant skill at runtime and follows the instructions.

The pattern is closer to writing good documentation than writing code. If you can write a clear playbook for a task, you can build a skill.

<div class="oc-diagram">
<svg width="560" height="380" viewBox="0 0 560 380" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="sk3">
      <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="7"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <path d="M80 20 L400 20 L440 60 L440 350 L80 350 Z" fill="#fffdf7" stroke="#2d2a24" stroke-width="2.5" filter="url(#sk3)"/>
  <path d="M400 20 L400 60 L440 60" fill="none" stroke="#2d2a24" stroke-width="2" filter="url(#sk3)"/>
  <text x="120" y="55" font-family="JetBrains Mono, monospace" font-size="14" fill="#6b6560">SKILL.md</text>
  <rect x="100" y="70" width="320" height="65" rx="4" fill="#fef9c3" stroke="#2d2a24" stroke-width="1.5" filter="url(#sk3)"/>
  <text x="115" y="92" font-family="JetBrains Mono, monospace" font-size="12" fill="#2d2a24">name: trip-discover</text>
  <text x="115" y="110" font-family="JetBrains Mono, monospace" font-size="12" fill="#2d2a24">description: Recommend destinations</text>
  <text x="115" y="128" font-family="JetBrains Mono, monospace" font-size="12" fill="#2d2a24">  based on vibe, budget, duration</text>
  <path d="M440 85 C460 85, 470 80, 500 75" stroke="#e85d3a" stroke-width="2" fill="none"/>
  <text x="460" y="70" font-family="Caveat, cursive" font-size="17" fill="#e85d3a">when to trigger</text>
  <text x="460" y="90" font-family="Caveat, cursive" font-size="15" fill="#e85d3a">(LLM matches intent)</text>
  <rect x="100" y="150" width="320" height="55" rx="4" fill="#dcfce7" stroke="#2d2a24" stroke-width="1.5" filter="url(#sk3)"/>
  <text x="115" y="172" font-family="Caveat, cursive" font-size="16" font-weight="700" fill="#2d2a24">When to activate</text>
  <text x="115" y="194" font-family="JetBrains Mono, monospace" font-size="11" fill="#6b6560">- "mountains" / "weekend trip"</text>
  <rect x="100" y="220" width="320" height="65" rx="4" fill="#dbeafe" stroke="#2d2a24" stroke-width="1.5" filter="url(#sk3)"/>
  <text x="115" y="242" font-family="Caveat, cursive" font-size="16" font-weight="700" fill="#2d2a24">How to respond</text>
  <text x="115" y="260" font-family="JetBrains Mono, monospace" font-size="11" fill="#6b6560">1. Search web for destinations</text>
  <text x="115" y="276" font-family="JetBrains Mono, monospace" font-size="11" fill="#6b6560">2. Pick 2-3, lead with top pick</text>
  <rect x="100" y="300" width="320" height="40" rx="4" fill="#fee2e2" stroke="#2d2a24" stroke-width="1.5" filter="url(#sk3)"/>
  <text x="115" y="322" font-family="Caveat, cursive" font-size="16" font-weight="700" fill="#2d2a24">Rules</text>
  <text x="210" y="322" font-family="JetBrains Mono, monospace" font-size="11" fill="#6b6560">Max 3 options. Never more.</text>
  <path d="M430 320 C450 330, 460 340, 480 345" stroke="#e85d3a" stroke-width="2" fill="none"/>
  <text x="460" y="360" font-family="Caveat, cursive" font-size="17" fill="#e85d3a">guardrails!</text>
  <text x="130" y="375" font-family="Caveat, cursive" font-size="18" fill="#e85d3a" transform="rotate(-1, 130, 375)">~50 lines of markdown = one complete feature</text>
</svg>
</div>

### SOUL.md — The Personality Layer

SOUL.md sits above skills. It's always loaded. Skills are loaded when relevant. The distinction matters.

SOUL.md defines *who* the agent is. Skills define *what* it can do. Memory defines *what it remembers* about you.

<div class="oc-diagram">
<svg width="580" height="340" viewBox="0 0 580 340" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="sk4">
      <feTurbulence type="turbulence" baseFrequency="0.025" numOctaves="2" result="noise" seed="11"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <text x="250" y="25" text-anchor="middle" font-family="Caveat, cursive" font-size="18" fill="#2d2a24">"weekend trip, mountains, 8K"</text>
  <path d="M250 32 L250 55" stroke="#2d2a24" stroke-width="2" fill="none"/>
  <polygon points="244,50 250,62 256,50" fill="#2d2a24"/>
  <rect x="60" y="65" width="380" height="55" rx="8" fill="#fee2e2" stroke="#2d2a24" stroke-width="2.5" filter="url(#sk4)"/>
  <text x="250" y="88" text-anchor="middle" font-family="Caveat, cursive" font-size="20" font-weight="700" fill="#2d2a24">SOUL.md</text>
  <text x="250" y="110" text-anchor="middle" font-family="Caveat, cursive" font-size="15" fill="#6b6560">always loaded — personality, tone, rules</text>
  <path d="M450 80 C470 75, 490 72, 510 70" stroke="#e85d3a" stroke-width="2" fill="none"/>
  <text x="470" y="62" font-family="Caveat, cursive" font-size="16" fill="#e85d3a">always on!</text>
  <path d="M250 120 L250 145" stroke="#2d2a24" stroke-width="2" fill="none"/>
  <polygon points="244,140 250,152 256,140" fill="#2d2a24"/>
  <rect x="60" y="155" width="380" height="55" rx="8" fill="#dcfce7" stroke="#2d2a24" stroke-width="2.5" filter="url(#sk4)"/>
  <text x="250" y="178" text-anchor="middle" font-family="Caveat, cursive" font-size="20" font-weight="700" fill="#2d2a24">Skill: trip-discover</text>
  <text x="250" y="200" text-anchor="middle" font-family="Caveat, cursive" font-size="15" fill="#6b6560">loaded when relevant — the playbook</text>
  <path d="M450 170 C470 165, 490 160, 515 158" stroke="#3b82f6" stroke-width="2" fill="none"/>
  <text x="470" y="150" font-family="Caveat, cursive" font-size="16" fill="#3b82f6">matched by</text>
  <text x="470" y="168" font-family="Caveat, cursive" font-size="16" fill="#3b82f6">intent!</text>
  <path d="M250 210 L250 235" stroke="#2d2a24" stroke-width="2" fill="none"/>
  <polygon points="244,230 250,242 256,230" fill="#2d2a24"/>
  <rect x="60" y="245" width="380" height="55" rx="8" fill="#f3e8ff" stroke="#2d2a24" stroke-width="2.5" filter="url(#sk4)"/>
  <text x="250" y="268" text-anchor="middle" font-family="Caveat, cursive" font-size="20" font-weight="700" fill="#2d2a24">Memory</text>
  <text x="250" y="290" text-anchor="middle" font-family="Caveat, cursive" font-size="15" fill="#6b6560">"user went to Rishikesh last month, skip it"</text>
  <path d="M250 300 L250 325" stroke="#2d2a24" stroke-width="2" fill="none"/>
  <polygon points="244,320 250,332 256,320" fill="#2d2a24"/>
  <text x="250" y="340" text-anchor="middle" font-family="Caveat, cursive" font-size="18" fill="#22c55e" font-weight="700">→ opinionated, personalized response</text>
</svg>
</div>

For TripClaw, the SOUL.md establishes the opinionated travel friend persona. Without it, the same skills would produce generic, soulless travel advice. With it, you get "skip Manali" energy.

---

## The Integrations

### Tavily (Web Search)

This is what makes the agent not hallucinate. Every destination recommendation, every flight price, every weather check goes through a real web search. OpenClaw has Tavily as a first-class plugin. One API key in the env file, one plugin install, done. The free tier gives you 1,000 searches/month.

### gog (Google Calendar)

This was the hardest integration. gog is a Go binary CLI for Google Workspace. It needs OAuth credentials, a headless auth flow with SSH tunneling, and a keyring password.

<div class="oc-callout">
  <p><strong>The gog installation saga:</strong> Brew failed on C compilation errors for a dependency (cyrus-sasl). Building from source needed Go installed which also needed brew. Finally found pre-built binaries on the GitHub releases page — one <code>curl</code> + <code>tar</code> and it worked. The auth flow requires tunneling a random port from your VPS to localhost so Google's OAuth redirect works.</p>
</div>

Once it's set up, creating calendar events is one shell command. The agent runs `gog calendar create primary --summary "..." --from <iso> --to <iso>` and the event appears on your phone. This was the demo moment that got the biggest reaction.

### ElevenLabs (TTS)

Installed via ClawHub (`clawhub install elevenlabs-voice`), which gave me Python scripts for text-to-speech. The trick for latency:

<div class="oc-diagram">
<svg width="540" height="260" viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="sk5">
      <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" result="noise" seed="13"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <line x1="30" y1="60" x2="510" y2="60" stroke="#e5e0d8" stroke-width="3" filter="url(#sk5)"/>
  <circle cx="60" cy="60" r="8" fill="#e85d3a" stroke="#2d2a24" stroke-width="2"/>
  <text x="60" y="45" text-anchor="middle" font-family="Caveat, cursive" font-size="14" fill="#6b6560">t=0</text>
  <text x="60" y="90" text-anchor="middle" font-family="Caveat, cursive" font-size="15" fill="#2d2a24">voice note</text>
  <text x="60" y="108" text-anchor="middle" font-family="Caveat, cursive" font-size="15" fill="#2d2a24">received</text>
  <circle cx="160" cy="60" r="8" fill="#22c55e" stroke="#2d2a24" stroke-width="2"/>
  <text x="160" y="45" text-anchor="middle" font-family="Caveat, cursive" font-size="14" fill="#6b6560">~0.5s</text>
  <rect x="105" y="120" width="110" height="40" rx="6" fill="#dcfce7" stroke="#2d2a24" stroke-width="1.5" filter="url(#sk5)"/>
  <text x="160" y="145" text-anchor="middle" font-family="Caveat, cursive" font-size="14" fill="#2d2a24">"Got it, thinking..."</text>
  <line x1="160" y1="68" x2="160" y2="120" stroke="#2d2a24" stroke-width="1.5" stroke-dasharray="4,3"/>
  <path d="M220 135 C240 125, 250 115, 260 110" stroke="#22c55e" stroke-width="2" fill="none"/>
  <text x="265" y="108" font-family="Caveat, cursive" font-size="16" fill="#22c55e">instant!</text>
  <circle cx="310" cy="60" r="8" fill="#3b82f6" stroke="#2d2a24" stroke-width="2"/>
  <text x="310" y="45" text-anchor="middle" font-family="Caveat, cursive" font-size="14" fill="#6b6560">~2-3s</text>
  <rect x="255" y="120" width="110" height="40" rx="6" fill="#dbeafe" stroke="#2d2a24" stroke-width="1.5" filter="url(#sk5)"/>
  <text x="310" y="145" text-anchor="middle" font-family="Caveat, cursive" font-size="14" fill="#2d2a24">full text reply</text>
  <line x1="310" y1="68" x2="310" y2="120" stroke="#2d2a24" stroke-width="1.5" stroke-dasharray="4,3"/>
  <circle cx="460" cy="60" r="8" fill="#e85d3a" stroke="#2d2a24" stroke-width="2"/>
  <text x="460" y="45" text-anchor="middle" font-family="Caveat, cursive" font-size="14" fill="#6b6560">~4-5s</text>
  <rect x="400" y="120" width="120" height="40" rx="6" fill="#ffedd5" stroke="#2d2a24" stroke-width="1.5" filter="url(#sk5)"/>
  <text x="460" y="145" text-anchor="middle" font-family="Caveat, cursive" font-size="14" fill="#2d2a24">voice message</text>
  <line x1="460" y1="68" x2="460" y2="120" stroke="#2d2a24" stroke-width="1.5" stroke-dasharray="4,3"/>
  <rect x="60" y="190" width="420" height="45" rx="8" fill="#fef9c3" stroke="#2d2a24" stroke-width="2" filter="url(#sk5)"/>
  <text x="270" y="215" text-anchor="middle" font-family="Caveat, cursive" font-size="18" fill="#2d2a24">user reads text while voice generates → perceived latency = ~0.5s</text>
  <text x="270" y="252" text-anchor="middle" font-family="Caveat, cursive" font-size="16" fill="#e85d3a">without this trick: 5 seconds of silence. magic dies.</text>
</svg>
</div>

### Whisper (STT)

Already bundled with OpenClaw as the `openai-whisper-api` skill. Zero setup. Telegram voice notes (.ogg) go in, transcribed text comes out. Handles Hindi-English mixed speech.

---

## The 4-Hour Timeline

<div class="oc-timeline">
  <div class="oc-timeline-item">
    <h4>Hour 1 — Setup & Integrations</h4>
    <p>OpenClaw pre-installed on Hostinger VPS. Tavily plugin took 2 minutes. Google Calendar took most of the hour — the gog installation saga ate significant time, but finding the pre-built binary was the breakthrough.</p>
  </div>
  <div class="oc-timeline-item">
    <h4>Hour 2 — Core Skills</h4>
    <p>Wrote SOUL.md (the personality), then trip-save, trip-discover, and trip-plan. Each skill is ~50 lines of markdown. The writing is fast once you understand the pattern.</p>
  </div>
  <div class="oc-timeline-item">
    <h4>Hour 3 — Remaining Skills + Voice</h4>
    <p>trip-search, trip-calendar, morning-briefing. Installed ElevenLabs from ClawHub. Added voice-in-voice-out behavior. Solved latency with filler messages.</p>
  </div>
  <div class="oc-timeline-item">
    <h4>Hour 4 — Testing & Demo</h4>
    <p>End-to-end testing. Fixed edge cases (skills not loading after restart, env vars disappearing, voice ID issues). Practiced the demo script. Shipped.</p>
  </div>
</div>

---

## What I Learned

### Skills are the right abstraction

When I first saw the skill system, I was skeptical. Markdown files as architecture? But after building seven skills in a few hours, I get it. The LLM is doing the heavy lifting of understanding intent, routing to the right skill, and orchestrating tool calls. The skill file just needs to be clear about *when* to activate and *how* to respond.

<div class="oc-hand-note">writing a skill feels more like writing good documentation than writing code</div>

### The Docker environment adds friction

OpenClaw on Docker means every system dependency is a puzzle. `apt` didn't work (brew-based container), `brew install` failed on compilation errors, `systemctl` doesn't exist. You're constantly adapting. For the hackathon this was manageable — for production, I'd want a more predictable base image.

### Memory > Database for prototyping

I originally planned to use Convex for structured storage. Cutting that and using OpenClaw's built-in memory instead saved 30+ minutes. Memory is fuzzy (no exact queries), but for a hackathon demo, "show my saved places" working 90% of the time beats a perfect database you didn't have time to integrate.

### The voice loop is a product differentiator

Voice in + voice out transforms the interaction from "chatbot" to "conversation." The judge's reaction to the calendar demo was strong, but the voice demo is what made people pull out their phones. There's something about hearing the agent respond that makes it feel *real* in a way text doesn't.

### Plan your skills before you code

My biggest regret is not reading more about the skill system before I started building. The first hour had unnecessary debugging because I was guessing at file paths and registration mechanisms. The skill system has conventions: workspace skills go in a specific path, the gateway needs a restart to pick them up, and the SKILL.md frontmatter matters for eligibility. Knowing this upfront would have made the build smoother.

---

## The Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Platform | OpenClaw on Docker | Pre-installed at buildathon |
| Channel | Telegram | Native voice notes, rich formatting |
| LLM | GPT-5.2 | Best tool-calling reliability |
| Web Search | Tavily | 1000 free/mo, first-class plugin |
| Calendar | gog CLI | Only option for headless Google Cal |
| STT | Whisper (bundled) | Zero setup, Hindi-English mixed |
| TTS | ElevenLabs | Quality voices, turbo model |
| Memory | Built-in | Good enough, no DB needed |
| Personality | SOUL.md | Useful → delightful |

---

## What I'd Build Next

If I had another weekend: Instagram reel scraping with Gemini vision for destination extraction. Budget tracker with running cost totals. Compare destinations side-by-side ("Kasol vs Bir"). Boarding pass parsing from photos. Morning briefing as an actual 7 AM cron, not just on-demand.

The platform is capable of all of this. It's just a matter of writing the SKILL.md files and wiring the right tools.

---

## Should You Build on OpenClaw?

If you're the kind of engineer who thinks in systems and wants an AI agent that actually *does things* — reads your email, manages your calendar, searches the web, sends messages — OpenClaw is the most interesting platform to build on right now. It's messy, it's young, the docs have gaps, and the Docker experience needs work. But the skill abstraction is genuinely powerful, and the community is shipping fast.

The fact that I built a seven-skill voice-enabled travel agent with Google Calendar integration in 4 hours — as someone who'd never touched OpenClaw before — says something about the platform's design.

<div class="oc-hand-note">just read the docs before you start building. trust me on that one.</div>

<div class="closing-note">

I'm Swayam — AI/Voice Engineer at ixigo, building production voice AI systems that handle 30K+ daily calls. If you're working on voice AI, conversational agents, or just want to talk about building things that talk back, find me on [Twitter/X](https://twitter.com/swayamg20).

</div>
