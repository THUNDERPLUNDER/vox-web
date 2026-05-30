/* CONTRACT: Canonical MVP design system source-of-truth v0.1 — patterns, primitives refs, applied surfaces.
   HITL reference for Cursor/UI work. Not production tokens or implementation.
*/

export type PatternStatus = "Candidate" | "Accepted" | "Applied" | "Needs QA" | "Deprecated";

export type PatternRecord = {
  id: string;
  name: string;
  status: PatternStatus;
  purpose: string;
  usedOn: string[];
  sourceFiles: string[];
  do: string[];
  dont: string[];
  qaQuestions: string[];
  issueRef?: string;
  commitRef?: string;
};

export const designSystemMeta = {
  version: "v0.1",
  title: "Design System Source of Truth",
  canonicalPath: "/designsystem/",
  updated: "2026-05-29",
  issue: "#157",
  relatedDecisions: [
    "docs/project/decisions/DECISION_125M_C_STANDALONE_AI_CUSTOM_R1.md",
    "docs/project/decisions/DECISION_125M_CES_HEADLESS_INTEGRATION_CBA.md",
  ],
};

export const workingRule =
  "Før UI-endringer skal relevante /designsystem/-kilder leses. Hvis et mønster finnes, skal det gjenbrukes. Hvis et nytt mønster innføres, skal /designsystem/ oppdateres eller Return Ticket forklare hvorfor det ikke trengs.";

export const returnTicketRule =
  "Alle UI Return Tickets skal inneholde: hvilke mønstre ble brukt, om nye mønstre ble introdusert, om /designsystem/ ble oppdatert, og hvilke applied surfaces som påvirkes.";

export const canonicalNote =
  "/designsystem/ = gjeldende sannhet. /vis/sprints/... = historikk og beslutningsgrunnlag.";

export const primitiveCategories = [
  {
    name: "Surfaces",
    status: "Accepted" as PatternStatus,
    summary: "Light editorial base, elevated editorial, deep identity/action, ink contrast. Glass = chrome only.",
    labHref: "/vis/sprints/2026-w21/primitives/surfaces/",
    source: "src/pages/vis/sprints/2026-w21/primitives/_data.ts",
  },
  {
    name: "Buttons",
    status: "Candidate" as PatternStatus,
    summary: "Ink primary, quiet secondary/ghost, AI primary on deep Nordic when transitioning to help.",
    labHref: "/vis/sprints/2026-w21/primitives/buttons/",
    source: "src/pages/vis/sprints/2026-w21/primitives/_data.ts",
  },
  {
    name: "Inputs",
    status: "Candidate" as PatternStatus,
    summary: "Clean light inputs; AI prompt sits in guided action surface, not detached widget.",
    labHref: "/vis/sprints/2026-w21/primitives/inputs/",
    source: "src/pages/vis/sprints/2026-w21/primitives/_data.ts",
  },
  {
    name: "Pills / chips",
    status: "Candidate" as PatternStatus,
    summary: "Neutral default; seed questions use row treatment, not chip soup.",
    labHref: "/vis/sprints/2026-w21/primitives/pills/",
    source: "src/pages/vis/sprints/2026-w21/primitives/_data.ts",
  },
  {
    name: "Focus",
    status: "Accepted" as PatternStatus,
    summary: "Cyan functional focus (#0EA5E9). Magenta only as micro-signal, not default focus.",
    labHref: "/vis/sprints/2026-w21/primitives/focus/",
    source: "src/pages/vis/sprints/2026-w21/primitives/_data.ts",
  },
  {
    name: "Elevation",
    status: "Candidate" as PatternStatus,
    summary: "Subtle lift for cards/action; avoid shadow as structure substitute.",
    labHref: "/vis/sprints/2026-w21/primitives/elevation/",
    source: "src/pages/vis/sprints/2026-w21/primitives/_data.ts",
  },
  {
    name: "Radius",
    status: "Candidate" as PatternStatus,
    summary: "Shared rounding family; AI compose uses ~1.15rem (--r1-ai-input-radius).",
    labHref: "/vis/sprints/2026-w21/primitives/radius/",
    source: "src/styles/r1-dialog-article.css",
  },
  {
    name: "Strokes",
    status: "Candidate" as PatternStatus,
    summary: "Restrained borders on editorial/action surfaces; magenta as line/marker only.",
    labHref: "/vis/sprints/2026-w21/primitives/strokes/",
    source: "src/pages/vis/sprints/2026-w21/primitives/_data.ts",
  },
] as const;

export const patterns: PatternRecord[] = [
  {
    id: "ai-composer",
    name: "AI Composer",
    status: "Applied",
    purpose: "Rolig editorial/action input for å fortsette samtale etter lesing eller i standalone chat.",
    usedOn: ["/no/artikkel/[slug] (Article AI)", "/no/chat/ (standalone)"],
    sourceFiles: [
      "src/components/article/ArticleInlineChatShell.astro",
      "src/styles/r1-dialog-article.css",
      "src/styles/viddel-standalone-chat.css",
      "src/pages/no/chat.astro",
    ],
    do: [
      "Bruk inline-chat-shell__compose grid (input + rund ink send-knapp)",
      "Focus-within border via reading-accent-iris",
      "Standalone: fixed bottom på mobil (idle + active)",
    ],
    dont: [
      "Ikke CES-widget composer",
      "Ikke glass som default chat-surface",
      "Ikke ny composer-styling uten pattern-oppdatering",
    ],
    qaQuestions: [
      "Matcher compose artikkel-AI visuelt i idle?",
      "Er compose tilgjengelig nederst på mobil før første spørsmål?",
      "Forblir compose fixed etter første melding?",
    ],
    issueRef: "#157 · #125M-C",
    commitRef: "e896d377",
  },
  {
    id: "seed-questions",
    name: "Seed Questions",
    status: "Applied",
    purpose: "Konkrete startspørsmål som action-rader — gjør neste steg tydelig uten chip-støy.",
    usedOn: ["/no/artikkel/[slug] (Spør om dette:)", "/no/chat/ (Spør om dette:)"],
    sourceFiles: [
      "src/components/article/ArticleInlineChatShell.astro",
      "src/styles/r1-dialog-article.css",
      "src/pages/no/chat.astro",
    ],
    do: [
      "Bruk inline-chat-shell__seed-row (høyrejustert, transparent border, hover surface)",
      "Label «Spør om dette:» i artikkel/standalone bridge",
      "Skjul seeds etter første spørsmål i standalone",
    ],
    dont: [
      "Ikke pill-sopp / chip soup",
      "Ikke magenta store flater",
      "Ikke kundeservice-widget-stil",
    ],
    qaQuestions: [
      "Er seed-rader lesbare og klikkbare på mobil?",
      "Forsvinner seeds etter første spørsmål der det er spesifisert?",
    ],
    issueRef: "#157 · #125M-C",
    commitRef: "dd20d80a",
  },
  {
    id: "transcript",
    name: "Transcript",
    status: "Needs QA",
    purpose: "Samtalelogg med editorial rytme — user surface + Viddel eyebrow, ikke chat-bobler.",
    usedOn: ["/no/chat/ (standalone)", "Article AI (progressive, via ArticleInlineChatShell)"],
    sourceFiles: [
      "src/styles/r1-dialog-article.css",
      "src/pages/no/chat.astro",
      "src/components/article/ArticleInlineChatShell.astro",
    ],
    do: [
      "User: --r1-ai-user-surface, høyrejustert measure",
      "Assistant: transparent, eyebrow «Viddel» (ikke Hørehjelpen)",
      "Intern scroll over fixed composer (standalone active)",
    ],
    dont: [
      "Ikke mørke kundeservice-bobler",
      "Ikke løs tekst uten rytme",
      "Ikke diagnosticInfo/teknisk copy i UI",
    ],
    qaQuestions: [
      "Er siste melding synlig over composer på mobil?",
      "Er assistant/user visuelt konsistent med artikkel-AI?",
    ],
    issueRef: "#157",
    commitRef: "e896d377",
  },
  {
    id: "standalone-chat-shell",
    name: "Standalone Chat Shell",
    status: "Applied",
    purpose: "Full `/no/chat/` — Article AI visuelt startpunkt + native chat-konvensjon (ChatGPT-scroll).",
    usedOn: ["/no/chat/"],
    sourceFiles: [
      "src/pages/no/chat.astro",
      "src/styles/viddel-standalone-chat.css",
      "src/styles/r1-dialog-article.css",
      "src/layouts/BaseLayout.astro (standalone-chat, no CES boot)",
      "src/pages/api/chat.ts",
    ],
    do: [
      "Headless via POST /api/chat → CES runSession server-side",
      "data-r1-editorial + r1-ai-bridge + inline-chat-shell progressive markup",
      "Mobil idle + active: composer fixed nederst",
      "Intro/seed skjules etter første spørsmål",
    ],
    dont: [
      "Ikke chat-messenger / sendQuery / CES widget",
      "Ikke synlig Hørehjelpen",
      "Ikke merge til bred public prod uten rate limit + prod env-vars",
    ],
    qaQuestions: [
      "Laster /no/chat/ med CSS på prod?",
      "Ingen flytende CES-launcher?",
      "Fungerer /api/chat når prod env-vars er satt?",
    ],
    issueRef: "#157 · #125M-C",
    commitRef: "e896d377",
  },
  {
    id: "article-to-ai-transition",
    name: "Article-to-AI Transition",
    status: "Applied",
    purpose: "Rolig overgang fra artikkelinnhold til AI-handling — divider + bridge, editorial slekt.",
    usedOn: ["/no/artikkel/[slug]"],
    sourceFiles: [
      "src/pages/no/artikkel/[slug].astro",
      "src/components/article/ArticleInlineChatShell.astro",
      "src/styles/r1-dialog-article.css",
    ],
    do: [
      "r1-ai-bridge etter artikkelinnhold",
      "r1-article-to-klarlyd-divider før bridge",
      "AI slekter på editorial layer, ikke chrome",
    ],
    dont: [
      "Ikke detached floating widget",
      "Ikke glass default for AI block",
    ],
    qaQuestions: [
      "Føles bridge som naturlig artikkelavslutning?",
      "Er seed + compose aligned med artikkel measure?",
    ],
    issueRef: "#126 · artikkel-AI",
    commitRef: "—",
  },
  {
    id: "loading-error-states",
    name: "Loading / Error States",
    status: "Candidate",
    purpose: "Trygg, kort feedback under AI-forespørsler — uten teknisk jargon.",
    usedOn: ["/no/chat/", "Article AI (ArticleInlineChatShell progressive)"],
    sourceFiles: [
      "src/pages/no/chat.astro",
      "src/pages/api/chat.ts",
      "src/components/article/ArticleInlineChatShell.astro",
    ],
    do: [
      "Loading: kort status («Viddel svarer …») i compose-stack",
      "Error: norsk, ikke-teknisk (configuration_missing, nettverk, tom respons)",
      "Ingen diagnosticInfo til klient",
    ],
    dont: [
      "Ikke CES/runSession/Debug i synlig copy",
      "Ikke rå HTTP-feil til bruker",
    ],
    qaQuestions: [
      "Er feilmeldinger forståelige uten teknisk bakgrunn?",
      "Vises loading uten å flytte compose uforutsigbart?",
    ],
    issueRef: "#157",
    commitRef: "0b9751a9",
  },
  {
    id: "helper-note-box",
    name: "Helper / Note Box",
    status: "Candidate",
    purpose: "Trygghetsnote og hjelpetekst i editorial tone — ikke klinisk, ikke widget.",
    usedOn: ["/no/chat/ (safety note)", "artikkel callouts / publishing notes (inspect)"],
    sourceFiles: ["src/pages/no/chat.astro", "src/pages/no/artikkel/[slug].astro"],
    do: ["Kort, muted typografi", "Plasseres uten å konkurrere med action patterns"],
    dont: ["Ikke tung card-stacking", "Ikke skjul viktig safety bak fold uten grunn"],
    qaQuestions: ["Er safety-note lesbar på mobil uten å skjules bak composer?"],
    issueRef: "—",
    commitRef: "e896d377",
  },
];

export const appliedSurfaces = [
  {
    route: "/no/chat/",
    status: "Applied" as PatternStatus,
    patterns: ["Standalone Chat Shell", "AI Composer", "Seed Questions", "Transcript", "Loading / Error States"],
    note: "Headless #125M-C merged main e896d377. Prod env-vars + rate limit før bred public bruk.",
  },
  {
    route: "/no/artikkel/[slug]",
    status: "Applied" as PatternStatus,
    patterns: ["Article-to-AI Transition", "AI Composer", "Seed Questions", "Loading / Error States"],
    note: "Article AI progressive; live ref: /no/artikkel/lyden-blir-slitsom-utpa-dagen",
  },
  {
    route: "/no/hjelp/",
    status: "Applied" as PatternStatus,
    patterns: ["Editorial hub surfaces (primitives: surfaces, cards)"],
    note: "#125I-D hub polish — ikke AI-block i v0.1 scope.",
  },
  {
    route: "/no/bedre-lyd/",
    status: "Applied" as PatternStatus,
    patterns: ["Editorial hub / magazine layout"],
    note: "#125F editorial hub — patterns ikke fullt kartlagt i v0.1.",
  },
  {
    route: "/no/",
    status: "Applied" as PatternStatus,
    patterns: ["Chrome / editorial frontpage"],
    note: "#125G forside — handoff til /no/chat/ via ?seed= der relevant.",
  },
];

export const historicalVisLinks = [
  { label: "Sprint preview 2026-W21", href: "/vis/sprints/2026-w21/", role: "Historikk · guardrails · produktanatomi" },
  { label: "Primitives Lab #124", href: "/vis/sprints/2026-w21/primitives/", role: "Kandidat-primitives · ikke canonical" },
  { label: "VIS Design System map (legacy)", href: "/vis/system/design-system-v01/", role: "Eldre oversikt — peker hit nå" },
  { label: "Color / Typography labs", href: "/vis/sprints/2026-w21/color/", role: "Beslutningsgrunnlag #122/#123" },
];
