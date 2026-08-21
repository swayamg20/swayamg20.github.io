const resolutionDiagramGrid = `
  <path class="diagram-grid-line" d="M32 58H608M32 150H608M32 242H608M128 28V272M320 28V272M512 28V272" />
`

function wrapResolutionDiagram(content) {
  return `
    <svg class="project-diagram" viewBox="0 0 640 300" aria-hidden="true" focusable="false">
      ${resolutionDiagramGrid}
      ${content}
    </svg>
  `
}

const resolutionDiagrams = {
  reel2trip: wrapResolutionDiagram(`
    <g class="diagram-shape">
      <rect x="58" y="70" width="132" height="160" rx="8" />
      <rect x="76" y="91" width="96" height="91" rx="4" />
      <path class="diagram-fill" d="M113 120v34l29-17z" />
      <path d="M82 204h84" />
      <path class="diagram-signal" d="M210 150h112" />
      <path class="diagram-signal diagram-fill" d="m313 143 16 7-16 7z" />
      <rect class="diagram-emphasis" x="348" y="70" width="234" height="160" rx="8" />
      <path d="M375 105h117M375 128h170M375 151h139M375 174h154" />
      <circle class="diagram-signal diagram-fill" cx="378" cy="203" r="5" />
      <path class="diagram-signal" d="M383 203c35-39 73 36 111-7 24-27 43-14 63-2" />
    </g>
  `),
  agentrelay: wrapResolutionDiagram(`
    <g class="diagram-shape">
      <rect x="48" y="92" width="144" height="116" rx="8" />
      <path d="M75 123h90M75 150h61M75 177h77" />
      <rect class="diagram-emphasis" x="253" y="82" width="134" height="136" rx="8" />
      <path d="m277 118 43 34 43-34M277 118v66h86v-66" />
      <circle class="diagram-signal diagram-fill" cx="320" cy="99" r="6" />
      <rect x="448" y="92" width="144" height="116" rx="8" />
      <path d="M475 123h90M475 150h61M475 177h77" />
      <path class="diagram-signal" d="M192 136h61M387 136h61M448 172h-61M253 172h-61" />
      <path class="diagram-signal diagram-fill" d="m244 129 16 7-16 7zM439 129l16 7-16 7zM396 165l-16 7 16 7zM201 165l-16 7 16 7z" />
    </g>
  `),
  murmur: wrapResolutionDiagram(`
    <g class="diagram-shape">
      <path d="M49 151h18l13-42 20 84 18-63 17 39 17-26 18 8h31" />
      <path class="diagram-signal" d="M222 150h92" />
      <path class="diagram-signal diagram-fill" d="m305 143 16 7-16 7z" />
      <rect class="diagram-emphasis" x="352" y="70" width="224" height="160" rx="8" />
      <path d="M379 198V101M379 198h165" />
      <path class="diagram-signal" d="M394 188Q454 68 529 188" />
      <circle class="diagram-signal diagram-fill" cx="394" cy="188" r="5" />
      <circle class="diagram-signal diagram-fill" cx="459" cy="111" r="5" />
      <circle class="diagram-signal diagram-fill" cx="529" cy="188" r="5" />
    </g>
  `),
  'macos-intelligence-mcp': wrapResolutionDiagram(`
    <g class="diagram-shape">
      <rect class="diagram-emphasis" x="252" y="92" width="136" height="116" rx="12" />
      <path d="M278 126h84M278 151h62M278 176h74" />
      <rect x="48" y="62" width="116" height="62" rx="6" />
      <rect x="48" y="176" width="116" height="62" rx="6" />
      <rect x="476" y="62" width="116" height="62" rx="6" />
      <rect x="476" y="176" width="116" height="62" rx="6" />
      <path class="diagram-signal" d="M164 93h88M164 207h88M388 122l88-29M388 178l88 29" />
      <circle class="diagram-signal diagram-fill" cx="320" cy="73" r="6" />
    </g>
  `),
  synthio: wrapResolutionDiagram(`
    <g class="diagram-shape">
      <rect class="diagram-emphasis" x="70" y="63" width="330" height="178" rx="8" />
      <path d="M98 95h113M98 121h186M98 176h75M190 176h74M281 176h88" />
      <rect x="98" y="143" width="271" height="65" rx="4" />
      <path class="diagram-signal" d="M438 103c17-31 40-31 57 0s40 31 57 0M438 151c17-31 40-31 57 0s40 31 57 0M438 199c17-31 40-31 57 0s40 31 57 0" />
      <circle class="diagram-signal diagram-fill" cx="412" cy="103" r="5" />
      <circle class="diagram-signal diagram-fill" cx="412" cy="151" r="5" />
      <circle class="diagram-signal diagram-fill" cx="412" cy="199" r="5" />
    </g>
  `),
  fieldpulse: wrapResolutionDiagram(`
    <g class="diagram-shape">
      <rect x="48" y="88" width="140" height="124" rx="8" />
      <path d="M75 118h86M75 145h58M75 172h72" />
      <circle class="diagram-emphasis" cx="320" cy="150" r="66" />
      <path d="M297 119c5-7 13-8 18-3l13 13c5 5 4 13-3 18l-8 6c9 17 19 27 36 36l6-8c5-7 13-8 18-3l13 13" />
      <rect x="452" y="74" width="140" height="152" rx="8" />
      <path d="M479 111h86M479 139h62M479 167h76" />
      <path class="diagram-signal" d="M188 150h66M386 150h66" />
      <path class="diagram-signal diagram-fill" d="m245 143 16 7-16 7zM443 143l16 7-16 7z" />
      <circle class="diagram-signal diagram-fill" cx="558" cy="199" r="6" />
    </g>
  `),
  'feather-analysis': wrapResolutionDiagram(`
    <g class="diagram-shape">
      <path d="M48 94h164M48 126h126M48 158h154M48 190h108" />
      <circle class="diagram-signal diagram-fill" cx="48" cy="94" r="5" />
      <circle class="diagram-signal diagram-fill" cx="48" cy="126" r="5" />
      <circle class="diagram-signal diagram-fill" cx="48" cy="158" r="5" />
      <circle class="diagram-signal diagram-fill" cx="48" cy="190" r="5" />
      <path class="diagram-signal" d="M234 150h84" />
      <path class="diagram-signal diagram-fill" d="m309 143 16 7-16 7z" />
      <rect class="diagram-emphasis" x="354" y="65" width="238" height="170" rx="8" />
      <path d="M382 201V101M382 201h180" />
      <path class="diagram-signal" d="m399 181 34-32 35 14 39-55 38 28" />
      <path d="M399 91h88" />
    </g>
  `),
  'webrtc-voice-ai': wrapResolutionDiagram(`
    <g class="diagram-shape">
      <rect class="diagram-emphasis" x="70" y="72" width="132" height="156" rx="66" />
      <rect x="116" y="98" width="40" height="76" rx="20" />
      <path d="M100 157c0 32 16 48 36 48s36-16 36-48M136 205v23M108 228h56" />
      <path class="diagram-signal" d="M232 110c25 0 25 80 50 80s25-80 50-80 25 80 50 80 25-80 50-80" />
      <rect x="466" y="82" width="126" height="136" rx="8" />
      <path d="M491 116h75M491 145h55M491 174h82" />
      <circle class="diagram-signal diagram-fill" cx="490" cy="197" r="5" />
    </g>
  `),
  'isro-xray-burst': wrapResolutionDiagram(`
    <g class="diagram-shape">
      <path d="M48 205V92M48 205h236" />
      <path class="diagram-signal" d="M62 184c26-4 36-18 49-21 19-5 20 19 39 13 17-6 25-71 43-70 18 1 23 69 42 70 16 1 21-23 35-18" />
      <circle class="diagram-signal diagram-fill" cx="193" cy="106" r="6" />
      <path class="diagram-signal" d="M304 150h74" />
      <path class="diagram-signal diagram-fill" d="m369 143 16 7-16 7z" />
      <rect class="diagram-emphasis" x="414" y="70" width="178" height="160" rx="8" />
      <path d="M442 104h80M442 130h122M442 156h98M442 182h112" />
      <circle class="diagram-signal diagram-fill" cx="548" cy="104" r="5" />
      <circle class="diagram-signal diagram-fill" cx="548" cy="182" r="5" />
    </g>
  `),
  'journal-scraper': wrapResolutionDiagram(`
    <g class="diagram-shape">
      <rect x="48" y="82" width="132" height="136" rx="8" />
      <path d="M76 113h75M76 141h62M76 169h82M76 197h49" />
      <path class="diagram-signal" d="M180 150h72" />
      <path class="diagram-signal diagram-fill" d="m243 143 16 7-16 7z" />
      <circle class="diagram-emphasis" cx="320" cy="150" r="58" />
      <path d="M296 128h48M296 150h48M296 172h48" />
      <path class="diagram-signal" d="M378 150h72" />
      <path class="diagram-signal diagram-fill" d="m441 143 16 7-16 7z" />
      <rect class="diagram-emphasis" x="480" y="76" width="112" height="148" rx="8" />
      <path d="M504 111h64M504 139h46M504 167h58M504 195h38" />
    </g>
  `),
}

function resolutionGithubIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.23c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.39.96.1-.75.4-1.26.74-1.55-2.58-.29-5.29-1.29-5.29-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.16 1.18A10.9 10.9 0 0 1 12 6.16c.98 0 1.95.13 2.87.38 2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.4-2.72 5.38-5.3 5.67.42.36.79 1.06.79 2.14v3.26c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  `
}

function renderResolutionModel(project) {
  const steps = project.flow
    .map(
      ([label, value], index) => `
        <li>
          <span>${String(index + 1).padStart(2, '0')} / ${label}</span>
          <strong>${value}</strong>
        </li>
      `,
    )
    .join('')

  return `
    <figure class="product-model" data-project-visual="${project.slug}">
      <div class="product-model-canvas">${resolutionDiagrams[project.slug] || resolutionDiagrams['feather-analysis']}</div>
      <ol class="product-model-steps">${steps}</ol>
      <figcaption>${project.summary}</figcaption>
    </figure>
  `
}

export const RESOLUTION_VISUALS = {
  card(slug) {
    return resolutionDiagrams[slug] || resolutionDiagrams['feather-analysis']
  },
  githubIcon: resolutionGithubIcon,
  model: renderResolutionModel,
}
