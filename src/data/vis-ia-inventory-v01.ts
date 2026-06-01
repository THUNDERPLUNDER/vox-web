/* CONTRACT: VIS IA Inventory v0.3 — kartlegging, mandat og konsolideringsklarhet (analyse, ikke implementasjon). */

import {
  visIaConsolidationById,
  type VisIaConsolidationReadiness,
} from "./vis-ia-consolidation-v03.ts";

export type VisIaStatus =
  | "active"
  | "canonical"
  | "planned"
  | "reference"
  | "lab"
  | "historical"
  | "legacy"
  | "unknown";

export type VisIaRecommendation =
  | "behold"
  | "slå sammen"
  | "flytt under"
  | "arkiver"
  | "vurder sletting"
  | "trenger avklaring";

/** Top tasks VIS skal støtte — grunnlag for tremodell v0.2. */
export type VisIaTopTask =
  | "status-nå"
  | "jobber-med"
  | "finn-flate"
  | "beslutninger-qa"
  | "forstå-system"
  | "historikk"
  | "unngå-forveksling";

export type VisIaAudience = "Thomas" | "Vibeke" | "Cursor" | "@rigger" | "@navigator";

export type VisIaHubPlacement =
  | "egen hub"
  | "seksjon under annen hub"
  | "ren historikk"
  | "skjult/arkivert"
  | "vurdert slettet senere";

export type VisIaSurfaceType =
  | "kontrollrom"
  | "runtime-data"
  | "hub"
  | "canonical-external"
  | "system-doc"
  | "runtime-tool"
  | "sprint-lab"
  | "review"
  | "assets"
  | "wireframe-render"
  | "wireframe-raw"
  | "placeholder";

export type VisIaMandate = {
  userNeed: string;
  primaryTask: VisIaTopTask;
  secondaryTask?: VisIaTopTask;
  audience: VisIaAudience[];
  coreContent: string;
  postUseAction: string;
  overlappingSurfaces: string[];
  hubPlacement: VisIaHubPlacement;
  mandateRecommendation: VisIaRecommendation;
  needsPageContract: boolean;
  pageContractNote?: string;
};

export type VisIaEntry = {
  id: string;
  route: string;
  sourceFile?: string;
  title: string;
  surfaceType: VisIaSurfaceType;
  status: VisIaStatus;
  currentPlacement: string;
  suggestedPlacement: string;
  recommendation: VisIaRecommendation;
  rationale: string;
  mandate: VisIaMandate;
};

export type VisIaEntryFull = VisIaEntry & {
  consolidation: VisIaConsolidationReadiness;
};

export type VisIaTreeNode = {
  id: string;
  label: string;
  href?: string;
  note?: string;
  primaryTask?: VisIaTopTask;
  children?: VisIaTreeNode[];
};

export type VisIaConsolidationNote = {
  id: string;
  title: string;
  recommendation: string;
  rationale: string;
  surfaces?: string[];
};

export type VisIaOverlapCluster = {
  id: string;
  title: string;
  surfaces: string[];
  conflict: string;
  resolution: string;
};

export type VisIaPageContractField = {
  field: string;
  required: boolean;
  description: string;
  example?: string;
};

export const visIaTopTaskLabels: Record<VisIaTopTask, string> = {
  "status-nå": "1. Se hvor prosjektet står akkurat nå",
  "jobber-med": "2. Se hva vi jobber med og hva som nettopp er ferdig",
  "finn-flate": "3. Finne riktig intern flate raskt",
  "beslutninger-qa": "4. Ta beslutninger / QA",
  "forstå-system": "5. Forstå system, design og innhold uten GitHub",
  historikk: "6. Finne historikk når vi trenger begrunnelse",
  "unngå-forveksling": "7. Unngå at gamle prototyper forveksles med sannhet",
};

export const visIaInventoryMeta = {
  version: "v0.3.1",
  updatedAt: "2026-05-31",
  purpose:
    "Konsolideringsklarhet før trebasert lokalmeny i VIS. Avklarte beslutninger innarbeidet — ingen routes endret.",
  mandatePass: "VIS IA Consolidation Readiness v0.3.1",
} as const;

/** Forslag til maskinlesbart page contract for VIS-sider. */
export const visIaPageContractProposal: VisIaPageContractField[] = [
  {
    field: "title",
    required: true,
    description: "Menneskelig sidetittel",
    example: "Sprint lab — Color",
  },
  {
    field: "type",
    required: true,
    description: "Surface-type: kontrollrom, sprint-lab, system-doc, review, assets, wireframe, …",
    example: "sprint-lab",
  },
  {
    field: "status",
    required: true,
    description: "active | canonical | lab | reference | historical | legacy",
    example: "lab",
  },
  {
    field: "purpose",
    required: true,
    description: "Én setning: hva siden er til for",
    example: "Beslutningsgrunnlag for fargepalett i MVP Design Lock",
  },
  {
    field: "primaryTask",
    required: true,
    description: "Primær top task fra visIaTopTaskLabels",
    example: "beslutninger-qa",
  },
  {
    field: "audience",
    required: true,
    description: "Kommaseparert målgruppe",
    example: "Thomas,Vibeke",
  },
  {
    field: "canonicalSource",
    required: false,
    description: "URL eller datafil som er operativ sannhet hvis siden er lab/legacy",
    example: "/designsystem/",
  },
  {
    field: "relatedArea",
    required: false,
    description: "ID-er til overlappende flater i inventaret",
    example: "designsystem,review",
  },
  {
    field: "lastReviewed",
    required: true,
    description: "ISO-dato for siste mandatvurdering",
    example: "2026-05-31",
  },
];

/** Eksempel på page contract som frontmatter eller eksportert konstant. */
export const visIaPageContractExample = {
  title: "Sprint lab — Color",
  type: "sprint-lab",
  status: "lab",
  purpose: "Beslutningsgrunnlag for fargepalett i MVP Design Lock",
  primaryTask: "beslutninger-qa",
  audience: ["Thomas", "Vibeke"],
  canonicalSource: "/designsystem/",
  relatedArea: ["designsystem", "review"],
  lastReviewed: "2026-05-31",
} as const;

/** Overlap-analyse — dobbel konfekt og konflikter. */
export const visIaOverlapClusters: VisIaOverlapCluster[] = [
  {
    id: "kontrollrom-gitbuss-feed",
    title: "VIS kontrollrom vs Gitbuss vs Runtime Feed",
    surfaces: ["VIS kontrollrom", "Runtime feed", "Gitbuss", "MVP current-state"],
    conflict:
      "Tre flater viser «prosjektstatus»: kontrollrom (MVP + feed), Gitbuss (GitHub runtime), Runtime feed (manuell agent-status). Risiko for at Thomas leser én og tror det er full bilde.",
    resolution:
      "Kontrollrom = aggregert «nå» (feed + MVP). Gitbuss = dypere GitHub-detalj under System. Runtime feed = kort manuell kommunikasjon, ikke erstatning for Gitbuss. Merk roller tydelig i page contract.",
  },
  {
    id: "backstage-control-system",
    title: "Backstage vs Control Center vs /vis/system/",
    surfaces: ["Backstage", "Viddel Control Center", "Systemreferanse (legacy hub)", "IA-prinsipper"],
    conflict:
      "Backstage er canonical systemreferanse. Control Center er agent/prosjektkontekst. /vis/system/ er flat link-liste som dupliserer begge.",
    resolution:
      "Backstage = canonical under «Forstå system». Agentdrift / runbook = agent-sekundær (ikke «Control Center»). Flat /vis/system/ → arkiver når tremeny finnes.",
  },
  {
    id: "roadmap-sprint-github",
    title: "Roadmap vs Sprint vs GitHub Projects",
    surfaces: ["Roadmap timeline", "Sprint 2026-W21", "Gitbuss", "KlarLyd Live Board (legacy)"],
    conflict:
      "Roadmap = retning/faser. Sprint = aktivt designarbeid denne uken. Gitbuss = issues/PR nå. Live Board wireframe dupliserer roadmap.",
    resolution:
      "Tre nivåer i tre: Nå (sprint + feed) → Retning (roadmap) → Operativt (Gitbuss). Live Board → vurder sletting. GitHub Projects = ekstern kilde, ikke egen VIS-side.",
  },
  {
    id: "design-trio",
    title: "Designsystem vs Review vs design-system-v01",
    surfaces: ["Designsystem", "Review", "Design System Overview (VIS legacy)"],
    conflict:
      "To designreferanser: /designsystem/ (canonical) og /vis/system/design-system-v01 (legacy). Review peker til sprint-labs og QA — overlapper med designsystem for visuell sannhet.",
    resolution:
      "Designsystem = canonical. Review = QA-inngang under Design. design-system-v01 → arkiv med tydelig «ikke canonical»-merke.",
  },
  {
    id: "dam-editorial",
    title: "DAM / bildebank vs Editorial Image Library",
    surfaces: ["DAM / Editorial Image Library", "VIS frontpage hubs registry"],
    conflict: "Hub-kort sier «DAM / bildebank», side sier «Editorial Image Library v0.2». Samme rute, ulike navn.",
    resolution: "Én flate: hovedlabel «Redaksjonelle bilder», sekundær «DAM / bildebank». Hub-registry konsolideres i VIS Tree Navigation v0.1.",
  },
  {
    id: "sprint-active-history",
    title: "Sprint 2026-W21 vs sprint-historikk",
    surfaces: ["Sprint 2026-W21", "Sprint 01 Foundation (arkiv)", "Lukkede sprintvisninger (plan)"],
    conflict:
      "Aktiv sprint er primær hub i dag. Eldre sprint-HTML i raw/ kan forveksles med aktiv sprint-lab.",
    resolution:
      "Aktiv sprint under «Nå og sprint». Ved sprintskifte → flytt til Historikk. Raw sprint-arkiv merkes «lukket» og «ikke aktiv beslutningsflate».",
  },
  {
    id: "wireframes-vs-labs",
    title: "Raw wireframes vs aktive beslutningsflater",
    surfaces: ["Raw HTML wireframes", "Sprint labs", "/vis/artikkel", "/vis/hub"],
    conflict:
      "10+ eldre HTML-wireframes og tomme placeholders kan oppleves som gjeldende produkt. Sprint-labs er derimot aktive beslutningsflater.",
    resolution:
      "Wireframes + placeholders kun i Historikk/arkiv. Sprint-labs merkes «lab» og «aktiv beslutning». Page contract status=historical|legacy for alt arkivert.",
  },
  {
    id: "placeholders",
    title: "/vis/artikkel og /vis/hub placeholders",
    surfaces: ["VIS wireframe — Artikkel", "VIS wireframe — NAV-Hub"],
    conflict: "Tomme Astro-placeholders på rot-nivå — ingen innhold, kan forveksles med production /no/.",
    resolution: "Vurder sletting eller omdiriger til arkiv. Fjern fra hub-kort og primær nav.",
  },
];

/** Foreslått tremeny v0.2 — organisert etter top tasks, ikke bare routes. */
export const visIaTreeProposalV02: VisIaTreeNode[] = [
  {
    id: "task-now",
    label: "Nå — status og sprint",
    primaryTask: "status-nå",
    note: "Top task 1+2: hvor står vi, hva jobber vi med",
    children: [
      {
        id: "kontrollrom",
        label: "VIS kontrollrom",
        href: "/vis/",
        note: "Aggregert inngang — MVP-status + runtime feed",
      },
      {
        id: "runtime-feed",
        label: "Runtime feed (innebygd)",
        note: "Manuell «Akkurat nå» — ikke egen route",
      },
      {
        id: "sprint-active",
        label: "Sprint 2026-W21",
        href: "/vis/sprints/2026-w21/",
        note: "Aktiv sprint + labs — beslutningsflater",
        children: [
          { id: "sprint-color", label: "Color", href: "/vis/sprints/2026-w21/color/" },
          { id: "sprint-typography", label: "Typography", href: "/vis/sprints/2026-w21/typography/" },
          { id: "sprint-hub-types", label: "Hub types", href: "/vis/sprints/2026-w21/hub-types/" },
          { id: "sprint-editorial-hub", label: "Editorial hub", href: "/vis/sprints/2026-w21/editorial-hub/" },
          { id: "sprint-frontpage-mandate", label: "Frontpage mandate", href: "/vis/sprints/2026-w21/frontpage-mandate/" },
          { id: "sprint-primitives", label: "Primitives", href: "/vis/sprints/2026-w21/primitives/" },
        ],
      },
    ],
  },
  {
    id: "task-navigate",
    label: "Arbeidsflater",
    primaryTask: "finn-flate",
    note: "Top task 3 — navigasjonskategori (ikke «Finn flate»)",
    children: [
      {
        id: "design",
        label: "Design og QA",
        children: [
          { id: "designsystem", label: "Designsystem (canonical)", href: "/designsystem/" },
          { id: "review", label: "Review / QA", href: "/vis/review/", note: "Under Design — ikke egen hub" },
        ],
      },
      {
        id: "content",
        label: "Innhold og assets",
        children: [
          { id: "dam", label: "Redaksjonelle bilder", href: "/vis/assets/editorial", note: "Sekundær: DAM / bildebank" },
        ],
      },
      {
        id: "operativt",
        label: "Operativt og GitHub",
        children: [
          { id: "gitbuss", label: "Gitbuss", href: "/vis/system/github-runtime-status", note: "Issues/PR — ikke kontrollrom" },
          { id: "roadmap", label: "Roadmap", href: "/vis/system/roadmap-timeline-v01", note: "Retning/faser — ikke sprint-backlog" },
        ],
      },
    ],
  },
  {
    id: "task-understand",
    label: "Forstå system",
    primaryTask: "forstå-system",
    note: "Top task 5: system, design og innhold uten GitHub-graving",
    children: [
      { id: "backstage", label: "Backstage (canonical)", href: "/backstage/", note: "AI/API/guard — primær systemreferanse" },
      { id: "ia-principles", label: "IA-prinsipper", href: "/vis/system/ia-principles-v01" },
      { id: "hub-mandate", label: "Hub Mandate", href: "/vis/system/hub-mandate-v01" },
      {
        id: "article-docs",
        label: "Artikkel-system",
        href: "/vis/system/article/",
        note: "Foundations, components, templates, changelog",
      },
      { id: "control-center", label: "Agentdrift / runbook", href: "/vis/system/control-center", note: "Under Forstå system — ikke Control Center" },
    ],
  },
  {
    id: "task-history",
    label: "Historikk og arkiv",
    primaryTask: "historikk",
    note: "Top task 6+7: begrunnelse og unngå forveksling",
    children: [
      { id: "raw-wireframes", label: "Raw wireframes (HTML)", note: "public/vis/raw — status historical" },
      { id: "legacy-design-v01", label: "Design System v01 (legacy)", href: "/vis/system/design-system-v01" },
      { id: "task-bus-live", label: "Task bus live (pensjonert)", href: "/vis/system/task-bus-live" },
      { id: "closed-sprints", label: "Lukkede sprintvisninger", note: "Ved sprintskifte" },
      { id: "strategi-notion", label: "Strategisk IA v5 (arkiv)", note: "Erstattet av ia-principles" },
    ],
  },
  {
    id: "task-meta",
    label: "Meta / IA-arbeid",
    primaryTask: "finn-flate",
    note: "Internt — kan skjules i prod-meny",
    children: [
      { id: "ia-inventory", label: "IA Inventory v0.2", href: "/vis/system/ia-inventory-v01" },
    ],
  },
];

/** v0.1 route-basert tre — beholdt for sammenligning. */
export const visIaTreeProposal: VisIaTreeNode[] = [
  {
    id: "kontrollrom",
    label: "VIS kontrollrom",
    href: "/vis/",
    children: [
      {
        id: "now-sprint",
        label: "Nå og sprint",
        children: [
          { id: "runtime-feed", label: "Runtime feed", note: "Innebygd i /vis/" },
          { id: "sprint-active", label: "Sprint 2026-W21", href: "/vis/sprints/2026-w21/" },
        ],
      },
      {
        id: "system",
        label: "System",
        children: [
          { id: "backstage", label: "Backstage", href: "/backstage/" },
          { id: "gitbuss", label: "Gitbuss", href: "/vis/system/github-runtime-status" },
          { id: "roadmap", label: "Roadmap", href: "/vis/system/roadmap-timeline-v01" },
          { id: "control-center", label: "Control Center", href: "/vis/system/control-center" },
        ],
      },
      {
        id: "design",
        label: "Design",
        children: [
          { id: "designsystem", label: "Designsystem", href: "/designsystem/" },
          { id: "review", label: "Review", href: "/vis/review/" },
        ],
      },
      {
        id: "content-assets",
        label: "Innhold og assets",
        children: [{ id: "dam", label: "DAM / bildebank", href: "/vis/assets/editorial" }],
      },
      {
        id: "archive",
        label: "Historikk / arkiv",
        children: [
          { id: "raw-wireframes", label: "Raw wireframes (HTML)" },
          { id: "legacy-system", label: "Legacy system-docs" },
          { id: "closed-sprints", label: "Lukkede sprintvisninger" },
        ],
      },
    ],
  },
];

export const visIaConsolidationNotes: VisIaConsolidationNote[] = [
  {
    id: "kontrollrom-gitbuss-feed",
    title: "Kontrollrom ≠ Gitbuss ≠ Runtime Feed",
    recommendation: "Behold alle tre — tydeliggjør roller i page contract og VIS-header",
    rationale:
      "Kontrollrom aggregerer. Feed = manuell kortstatus. Gitbuss = GitHub-detalj. Ikke slå sammen — merk mandat.",
    surfaces: ["VIS kontrollrom", "Runtime feed", "Gitbuss"],
  },
  {
    id: "designsystem-global",
    title: "/designsystem/ som global intern flate",
    recommendation: "Behold egen rute; canonical under Design i tre v0.2",
    rationale: "Canonical UI-referanse. Review peker hit for visuell sannhet.",
    surfaces: ["Designsystem", "Review"],
  },
  {
    id: "backstage-global",
    title: "/backstage/ som canonical systemreferanse",
    recommendation: "Behold egen rute; erstatt ikke med Control Center",
    rationale: "Backstage = Thomas/Vibeke + agenter. Control Center = sekundær agentkontekst.",
    surfaces: ["Backstage", "Viddel Control Center"],
  },
  {
    id: "dam-editorial",
    title: "DAM / bildebank vs Editorial Image Library",
    recommendation: "Behold én flate — hovedlabel «Redaksjonelle bilder», sekundær «DAM / bildebank»",
    rationale: "Avklart: ett område. Kun label oppdateres ved tremeny — innhold bevares.",
    surfaces: ["DAM / Editorial Image Library", "VIS frontpage hubs registry"],
  },
  {
    id: "review-under-design",
    title: "Review-plassering",
    recommendation: "Flytt under Design i tre — ikke egen primær hub",
    rationale: "QA/godkjenning, ikke eget arbeidsområde. Top task: beslutninger-qa.",
    surfaces: ["Review", "Sprint labs"],
  },
  {
    id: "system-index-archive",
    title: "Flat /vis/system/ hub",
    recommendation: "Arkiver når tremeny v0.2 implementeres",
    rationale: "Dupliserer tre. Behold som fallback til overgang.",
    surfaces: ["Systemreferanse (legacy hub)"],
  },
  {
    id: "raw-archive-only",
    title: "Raw VIS HTML + placeholders",
    recommendation: "Kun Historikk — vurder sletting av /vis/artikkel og /vis/hub",
    rationale: "Top task 7: unngå forveksling med /no/ og aktive labs.",
    surfaces: ["Raw HTML wireframes", "VIS wireframe — Artikkel", "VIS wireframe — NAV-Hub"],
  },
  {
    id: "frontpage-hubs-merge",
    title: "vis-frontpage-hubs-v01.ts",
    recommendation: "Konsolider i VIS Tree Navigation v0.1 — én datakilde med tremeny",
    rationale: "Avklart: unngå parallelle sannheter mellom frontpage, hub-kort og lokalmeny.",
    surfaces: ["VIS frontpage hubs registry"],
  },
];

const M = {
  visFrontpage: {
    userNeed: "Få et raskt overblikk over prosjektstatus uten å åpne GitHub eller grave i filer",
    primaryTask: "status-nå" as VisIaTopTask,
    secondaryTask: "jobber-med" as VisIaTopTask,
    audience: ["Thomas", "Vibeke"] as VisIaAudience[],
    coreContent: "MVP current-state, runtime feed, hub-kort til arbeidsområder",
    postUseAction: "Velg neste flate (sprint, review, system) basert på hva som trengs nå",
    overlappingSurfaces: ["Runtime feed", "Gitbuss", "MVP current-state"],
    hubPlacement: "egen hub" as VisIaHubPlacement,
    mandateRecommendation: "behold" as VisIaRecommendation,
    needsPageContract: true,
    pageContractNote: "type=kontrollrom, status=active, canonicalSource=mvp-current-state.ts",
  },
  runtimeFeed: {
    userNeed: "Se hva agent/team kommuniserer akkurat nå i menneskelig språk",
    primaryTask: "status-nå" as VisIaTopTask,
    secondaryTask: "jobber-med" as VisIaTopTask,
    audience: ["Thomas", "Vibeke"] as VisIaAudience[],
    coreContent: "Headline, why, nextDecision — manuell data i vis-runtime-feed.ts",
    postUseAction: "Forstå neste beslutning; gå dypere via sprint eller Gitbuss hvis nødvendig",
    overlappingSurfaces: ["VIS kontrollrom", "Gitbuss"],
    hubPlacement: "seksjon under annen hub" as VisIaHubPlacement,
    mandateRecommendation: "behold" as VisIaRecommendation,
    needsPageContract: false,
    pageContractNote: "Datakilde, ikke egen side — dokumenter i vis-runtime-feed.ts",
  },
  designsystem: {
    userNeed: "Finne canonical UI-mønstre, tokens og komponenter for produksjon",
    primaryTask: "forstå-system" as VisIaTopTask,
    secondaryTask: "finn-flate" as VisIaTopTask,
    audience: ["Thomas", "Vibeke", "Cursor", "@rigger"] as VisIaAudience[],
    coreContent: "Tokens, komponenter, mønstre — production-ready referanse",
    postUseAction: "Bruk mønstre i sprint-labs eller /no/ — ikke dupliser i VIS legacy",
    overlappingSurfaces: ["Review", "Design System Overview (VIS legacy)", "Sprint labs"],
    hubPlacement: "egen hub" as VisIaHubPlacement,
    mandateRecommendation: "behold" as VisIaRecommendation,
    needsPageContract: true,
    pageContractNote: "type=canonical-external, status=canonical",
  },
  backstage: {
    userNeed: "Forstå hvordan AI, API og guardrails fungerer uten å lese repo-dokumentasjon",
    primaryTask: "forstå-system" as VisIaTopTask,
    secondaryTask: "finn-flate" as VisIaTopTask,
    audience: ["Thomas", "Vibeke", "Cursor", "@rigger", "@navigator"] as VisIaAudience[],
    coreContent: "Operating rules, API-kontekst, agent-guardrails, Return Ticket-felt",
    postUseAction: "Referer agenter hit; ta beslutninger om systemendringer informert",
    overlappingSurfaces: ["Viddel Control Center", "Systemreferanse (legacy hub)"],
    hubPlacement: "egen hub" as VisIaHubPlacement,
    mandateRecommendation: "behold" as VisIaRecommendation,
    needsPageContract: true,
    pageContractNote: "type=canonical-external, status=canonical",
  },
  gitbuss: {
    userNeed: "Se operativ GitHub-status (issues, PR, merges) uten å åpne GitHub",
    primaryTask: "jobber-med" as VisIaTopTask,
    secondaryTask: "status-nå" as VisIaTopTask,
    audience: ["Thomas", "Cursor", "@navigator"] as VisIaAudience[],
    coreContent: "Generert feed fra GitHub — issues, PR, nylig aktivitet",
    postUseAction: "Prioriter arbeid; koble til roadmap eller sprint hvis strategisk",
    overlappingSurfaces: ["VIS kontrollrom", "Runtime feed", "Roadmap timeline"],
    hubPlacement: "seksjon under annen hub" as VisIaHubPlacement,
    mandateRecommendation: "behold" as VisIaRecommendation,
    needsPageContract: true,
    pageContractNote: "Ikke kontrollrom — merk «operativ GitHub-detalj»",
  },
  roadmap: {
    userNeed: "Forstå retning og faser — ikke daglig task-backlog",
    primaryTask: "forstå-system" as VisIaTopTask,
    secondaryTask: "historikk" as VisIaTopTask,
    audience: ["Thomas", "Vibeke", "@navigator"] as VisIaAudience[],
    coreContent: "Roadmap-tidslinje generert fra GitHub milestones/labels",
    postUseAction: "Plasser sprint-arbeid i større bilde; unngå å blande med aktiv sprint",
    overlappingSurfaces: ["Gitbuss", "Sprint 2026-W21", "KlarLyd Live Board (legacy)"],
    hubPlacement: "seksjon under annen hub" as VisIaHubPlacement,
    mandateRecommendation: "behold" as VisIaRecommendation,
    needsPageContract: true,
  },
  dam: {
    userNeed: "Finne og velge redaksjonelle bilder for innhold",
    primaryTask: "finn-flate" as VisIaTopTask,
    secondaryTask: "beslutninger-qa" as VisIaTopTask,
    audience: ["Thomas", "Vibeke", "Cursor"] as VisIaAudience[],
    coreContent: "Editorial Image Library v0.2 — bildebank for artikler",
    postUseAction: "Velg bilde til innhold; referer i Storyblok/redaksjon",
    overlappingSurfaces: ["VIS frontpage hubs registry"],
    hubPlacement: "seksjon under annen hub" as VisIaHubPlacement,
    mandateRecommendation: "slå sammen" as VisIaRecommendation,
    needsPageContract: true,
    pageContractNote: "Én label — fjern DAM vs Editorial splitt",
  },
  review: {
    userNeed: "QA og godkjenne design/spinter før de blir canonical",
    primaryTask: "beslutninger-qa" as VisIaTopTask,
    secondaryTask: "finn-flate" as VisIaTopTask,
    audience: ["Thomas", "Vibeke"] as VisIaAudience[],
    coreContent: "Review-registry med lenker til sprint-labs og stakeholder-safe visninger",
    postUseAction: "Godkjenn eller send tilbake; oppdater designsystem hvis canonical",
    overlappingSurfaces: ["Designsystem", "Sprint labs", "Sprint lab — Hub types"],
    hubPlacement: "seksjon under annen hub" as VisIaHubPlacement,
    mandateRecommendation: "flytt under" as VisIaRecommendation,
    needsPageContract: true,
  },
  sprint: {
    userNeed: "Se og jobbe med aktiv sprint — designbeslutninger denne uken",
    primaryTask: "jobber-med" as VisIaTopTask,
    secondaryTask: "beslutninger-qa" as VisIaTopTask,
    audience: ["Thomas", "Vibeke", "Cursor"] as VisIaAudience[],
    coreContent: "Sprint 2026-W21 oversikt + lenker til labs",
    postUseAction: "Åpne relevant lab; ta beslutning; oppdater review/designsystem",
    overlappingSurfaces: ["Roadmap timeline", "Review", "MVP current-state"],
    hubPlacement: "seksjon under annen hub" as VisIaHubPlacement,
    mandateRecommendation: "behold" as VisIaRecommendation,
    needsPageContract: true,
    pageContractNote: "Ved sprintskifte: status→historical, flytt til arkiv-tre",
  },
  sprintLab: {
    userNeed: "Vurdere konkret designbeslutning (farge, type, hub-type, …) i sprint",
    primaryTask: "beslutninger-qa" as VisIaTopTask,
    secondaryTask: "jobber-med" as VisIaTopTask,
    audience: ["Thomas", "Vibeke"] as VisIaAudience[],
    coreContent: "Lab-spesifikt beslutningsgrunnlag og visualisering",
    postUseAction: "Beslut; registrer i review; oppdater canonical kilde",
    overlappingSurfaces: ["Designsystem", "Review"],
    hubPlacement: "seksjon under annen hub" as VisIaHubPlacement,
    mandateRecommendation: "behold" as VisIaRecommendation,
    needsPageContract: true,
    pageContractNote: "status=lab, canonicalSource=/designsystem/",
  },
  controlCenter: {
    userNeed: "Agenter trenger prosjektkontekst og filpeker uten å søke i repo",
    primaryTask: "forstå-system" as VisIaTopTask,
    audience: ["Cursor", "@rigger", "@navigator"] as VisIaAudience[],
    coreContent: "Prosjektkontekst, filreferanser, agent-instruksjoner",
    postUseAction: "Start agent-oppgave informert; ikke bruk som Thomas' daglige inngang",
    overlappingSurfaces: ["Backstage", "Systemreferanse (legacy hub)"],
    hubPlacement: "seksjon under annen hub" as VisIaHubPlacement,
    mandateRecommendation: "behold" as VisIaRecommendation,
    needsPageContract: true,
    pageContractNote: "audience primært agenter — sekundær i tre",
  },
  systemDoc: {
    userNeed: "Finne canonical dokumentasjon for IA, hub-mandat eller artikkel-system",
    primaryTask: "forstå-system" as VisIaTopTask,
    secondaryTask: "historikk" as VisIaTopTask,
    audience: ["Thomas", "Vibeke", "Cursor"] as VisIaAudience[],
    coreContent: "Strukturert dokumentasjon — prinsipper, mandat, komponenter",
    postUseAction: "Referer ved beslutninger; oppdater ved endring i modell",
    overlappingSurfaces: ["Backstage", "IA-prinsipper"],
    hubPlacement: "seksjon under annen hub" as VisIaHubPlacement,
    mandateRecommendation: "behold" as VisIaRecommendation,
    needsPageContract: true,
  },
  legacyDoc: {
    userNeed: "Historisk referanse — ikke daglig bruk",
    primaryTask: "historikk" as VisIaTopTask,
    secondaryTask: "unngå-forveksling" as VisIaTopTask,
    audience: ["Thomas", "Cursor"] as VisIaAudience[],
    coreContent: "Utdatert dokumentasjon eller erstattet verktøy",
    postUseAction: "Sjekk canonical erstatning; ikke bruk som sannhet",
    overlappingSurfaces: ["Designsystem", "Gitbuss"],
    hubPlacement: "ren historikk" as VisIaHubPlacement,
    mandateRecommendation: "arkiver" as VisIaRecommendation,
    needsPageContract: true,
    pageContractNote: "status=legacy, canonicalSource peker til erstatning",
  },
  placeholder: {
    userNeed: "Ingen — tom placeholder uten innhold",
    primaryTask: "unngå-forveksling" as VisIaTopTask,
    audience: [] as VisIaAudience[],
    coreContent: "Tom Astro-side — ingen funksjon",
    postUseAction: "Ikke bruk — gå til production /no/ eller sprint-labs",
    overlappingSurfaces: ["Raw HTML wireframes"],
    hubPlacement: "vurdert slettet senere" as VisIaHubPlacement,
    mandateRecommendation: "vurder sletting" as VisIaRecommendation,
    needsPageContract: false,
  },
  wireframe: {
    userNeed: "Finne begrunnelse eller tidlig design når historikk trengs",
    primaryTask: "historikk" as VisIaTopTask,
    secondaryTask: "unngå-forveksling" as VisIaTopTask,
    audience: ["Thomas", "Vibeke"] as VisIaAudience[],
    coreContent: "Eldre HTML-wireframes og strategidokumenter",
    postUseAction: "Sammenlign med canonical; ikke implementer direkte",
    overlappingSurfaces: ["Sprint labs", "IA-prinsipper"],
    hubPlacement: "ren historikk" as VisIaHubPlacement,
    mandateRecommendation: "arkiver" as VisIaRecommendation,
    needsPageContract: true,
    pageContractNote: "status=historical, canonicalSource=/no/ eller ia-principles",
  },
  runtimeData: {
    userNeed: "Datakilde — ikke egen brukerflate",
    primaryTask: "status-nå" as VisIaTopTask,
    audience: ["Cursor", "@rigger"] as VisIaAudience[],
    coreContent: "TypeScript-registry som driver VIS UI",
    postUseAction: "Oppdater ved endring i operativ sannhet",
    overlappingSurfaces: ["VIS kontrollrom", "VIS frontpage hubs registry"],
    hubPlacement: "seksjon under annen hub" as VisIaHubPlacement,
    mandateRecommendation: "behold" as VisIaRecommendation,
    needsPageContract: false,
  },
  hubsRegistry: {
    userNeed: "Definere hub-kort på kontrollrom — midlertidig til tremeny finnes",
    primaryTask: "finn-flate" as VisIaTopTask,
    audience: ["Cursor", "@rigger"] as VisIaAudience[],
    coreContent: "Hub-definisjoner for /vis/ frontpage",
    postUseAction: "Konsolider med tremeny-data i v0.3",
    overlappingSurfaces: ["VIS kontrollrom", "IA Inventory"],
    hubPlacement: "skjult/arkivert" as VisIaHubPlacement,
    mandateRecommendation: "slå sammen" as VisIaRecommendation,
    needsPageContract: false,
  },
  iaInventory: {
    userNeed: "Kartlegge VIS-flater, mandat og overlapp før tremeny bygges",
    primaryTask: "beslutninger-qa" as VisIaTopTask,
    secondaryTask: "forstå-system" as VisIaTopTask,
    audience: ["Thomas", "Cursor"] as VisIaAudience[],
    coreContent: "Inventar, mandatpass, overlap, tre-forslag v0.2",
    postUseAction: "QA tremodell; godkjenn konsolidering; deretter implementer meny",
    overlappingSurfaces: ["Systemreferanse (legacy hub)"],
    hubPlacement: "skjult/arkivert" as VisIaHubPlacement,
    mandateRecommendation: "behold" as VisIaRecommendation,
    needsPageContract: true,
    pageContractNote: "Meta-dokument — kan skjules i prod-meny",
  },
};

export const visIaInventoryEntries: VisIaEntry[] = [
  {
    id: "vis-frontpage",
    route: "/vis/",
    sourceFile: "src/pages/vis/index.astro",
    title: "VIS kontrollrom",
    surfaceType: "kontrollrom",
    status: "active",
    currentPlacement: "VIS rot — hub-and-spoke frontpage",
    suggestedPlacement: "Nå — status og sprint → Kontrollrom",
    recommendation: "behold",
    rationale: "Primær inngang. Runtime feed + MVP-status + huber.",
    mandate: M.visFrontpage,
  },
  {
    id: "runtime-feed",
    route: "/vis/ (embedded)",
    sourceFile: "src/data/vis-runtime-feed.ts",
    title: "Runtime feed",
    surfaceType: "runtime-data",
    status: "active",
    currentPlacement: "Innebygd øverst på /vis/",
    suggestedPlacement: "Nå → Runtime feed (innebygd)",
    recommendation: "behold",
    rationale: "Manuell agent-status. Kommunikasjonsregel § B4.",
    mandate: M.runtimeFeed,
  },
  {
    id: "designsystem",
    route: "/designsystem/",
    sourceFile: "src/pages/designsystem/index.astro",
    title: "Designsystem",
    surfaceType: "canonical-external",
    status: "canonical",
    currentPlacement: "Global intern rute + primær VIS-hub",
    suggestedPlacement: "Arbeidsflater → Design → Designsystem",
    recommendation: "behold",
    rationale: "Canonical UI/mønstre.",
    mandate: M.designsystem,
  },
  {
    id: "backstage",
    route: "/backstage/",
    sourceFile: "src/pages/backstage/index.astro",
    title: "Backstage",
    surfaceType: "canonical-external",
    status: "canonical",
    currentPlacement: "Global intern rute + primær VIS-hub",
    suggestedPlacement: "Forstå system → Backstage",
    recommendation: "behold",
    rationale: "Canonical systemreferanse AI/API/guard.",
    mandate: M.backstage,
  },
  {
    id: "gitbuss",
    route: "/vis/system/github-runtime-status",
    sourceFile: "src/pages/vis/system/github-runtime-status.astro",
    title: "Gitbuss / GitHub runtime status",
    surfaceType: "runtime-tool",
    status: "active",
    currentPlacement: "VIS system — primær hub «Gitbuss»",
    suggestedPlacement: "Arbeidsflater → Operativt → Gitbuss",
    recommendation: "behold",
    rationale: "GitHub-feed — ikke kontrollrom.",
    mandate: M.gitbuss,
  },
  {
    id: "roadmap",
    route: "/vis/system/roadmap-timeline-v01",
    sourceFile: "src/pages/vis/system/roadmap-timeline-v01.astro",
    title: "Roadmap timeline",
    surfaceType: "runtime-tool",
    status: "active",
    currentPlacement: "VIS system — primær hub",
    suggestedPlacement: "Arbeidsflater → Operativt → Roadmap",
    recommendation: "behold",
    rationale: "Retning/faser — ikke sprint-backlog.",
    mandate: M.roadmap,
  },
  {
    id: "dam-editorial",
    route: "/vis/assets/editorial",
    sourceFile: "src/pages/vis/assets/editorial.astro",
    title: "Redaksjonelle bilder",
    surfaceType: "assets",
    status: "active",
    currentPlacement: "Sekundær hub — label oppdateres til «Redaksjonelle bilder» (sekundær: DAM / bildebank)",
    suggestedPlacement: "Arbeidsflater → Redaksjonelle bilder",
    recommendation: "behold",
    rationale: "Avklart ett område. Editorial Image Library UI bevares — kun navn harmoniseres.",
    mandate: M.dam,
  },
  {
    id: "review",
    route: "/vis/review/",
    sourceFile: "src/pages/vis/review/index.astro",
    title: "Review",
    surfaceType: "review",
    status: "active",
    currentPlacement: "Sekundær hub",
    suggestedPlacement: "Arbeidsflater → Design og QA → Review",
    recommendation: "flytt under",
    rationale: "QA hører til design-spor.",
    mandate: M.review,
  },
  {
    id: "sprint-2026-w21",
    route: "/vis/sprints/2026-w21/",
    sourceFile: "src/pages/vis/sprints/2026-w21/index.astro",
    title: "Sprint 2026-W21",
    surfaceType: "sprint-lab",
    status: "active",
    currentPlacement: "Primær hub (aktiv sprint)",
    suggestedPlacement: "Nå → Sprint 2026-W21",
    recommendation: "behold",
    rationale: "Aktiv currentSprint.",
    mandate: M.sprint,
  },
  {
    id: "sprint-color",
    route: "/vis/sprints/2026-w21/color/",
    sourceFile: "src/pages/vis/sprints/2026-w21/color/index.astro",
    title: "Sprint lab — Color",
    surfaceType: "sprint-lab",
    status: "lab",
    currentPlacement: "Under aktiv sprint",
    suggestedPlacement: "Nå → Sprint → Color",
    recommendation: "behold",
    rationale: "Design Lock lab — farge.",
    mandate: { ...M.sprintLab, userNeed: "Vurdere fargepalett for MVP Design Lock" },
  },
  {
    id: "sprint-typography",
    route: "/vis/sprints/2026-w21/typography/",
    sourceFile: "src/pages/vis/sprints/2026-w21/typography/index.astro",
    title: "Sprint lab — Typography",
    surfaceType: "sprint-lab",
    status: "lab",
    currentPlacement: "Under aktiv sprint",
    suggestedPlacement: "Nå → Sprint → Typography",
    recommendation: "behold",
    rationale: "Typografi-pass — production tokens.",
    mandate: { ...M.sprintLab, userNeed: "Vurdere typografi mot production tokens" },
  },
  {
    id: "sprint-hub-types",
    route: "/vis/sprints/2026-w21/hub-types/",
    sourceFile: "src/pages/vis/sprints/2026-w21/hub-types/index.astro",
    title: "Sprint lab — Hub types",
    surfaceType: "sprint-lab",
    status: "lab",
    currentPlacement: "Under aktiv sprint + Review registry",
    suggestedPlacement: "Nå → Sprint → Hub types",
    recommendation: "behold",
    rationale: "IA-beslutning hub-typer.",
    mandate: { ...M.sprintLab, userNeed: "Beslutte hub-typer for produkt-IA", overlappingSurfaces: ["Review", "IA-prinsipper", "Hub Mandate v0.1"] },
  },
  {
    id: "sprint-editorial-hub",
    route: "/vis/sprints/2026-w21/editorial-hub/",
    sourceFile: "src/pages/vis/sprints/2026-w21/editorial-hub/index.astro",
    title: "Sprint lab — Editorial hub",
    surfaceType: "sprint-lab",
    status: "lab",
    currentPlacement: "Under aktiv sprint",
    suggestedPlacement: "Nå → Sprint → Editorial hub",
    recommendation: "behold",
    rationale: "Hub-visualisering redaksjonell IA.",
    mandate: { ...M.sprintLab, userNeed: "Visualisere redaksjonell hub-struktur" },
  },
  {
    id: "sprint-frontpage-mandate",
    route: "/vis/sprints/2026-w21/frontpage-mandate/",
    sourceFile: "src/pages/vis/sprints/2026-w21/frontpage-mandate/index.astro",
    title: "Sprint lab — Frontpage mandate",
    surfaceType: "sprint-lab",
    status: "lab",
    currentPlacement: "Under aktiv sprint",
    suggestedPlacement: "Nå → Sprint → Frontpage mandate",
    recommendation: "behold",
    rationale: "Forsidemandat-lab.",
    mandate: { ...M.sprintLab, userNeed: "Definere forsidemandat for VIS og produkt" },
  },
  {
    id: "sprint-primitives",
    route: "/vis/sprints/2026-w21/primitives/",
    sourceFile: "src/pages/vis/sprints/2026-w21/primitives/index.astro",
    title: "Sprint lab — Primitives (13 + 3 context)",
    surfaceType: "sprint-lab",
    status: "lab",
    currentPlacement: "Under aktiv sprint",
    suggestedPlacement: "Nå → Sprint → Primitives",
    recommendation: "behold",
    rationale: "MVP Design Lock primitives — grupper i tre.",
    mandate: { ...M.sprintLab, userNeed: "QA primitives før canonical i designsystem" },
  },
  {
    id: "control-center",
    route: "/vis/system/control-center",
    sourceFile: "src/pages/vis/system/control-center.astro",
    title: "Agentdrift / runbook",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system — route /vis/system/control-center",
    suggestedPlacement: "Forstå system → Agentdrift / runbook",
    recommendation: "behold",
    rationale: "Avklart: ikke «Control Center». Behold agent-runbook under Forstå system.",
    mandate: M.controlCenter,
  },
  {
    id: "ia-principles",
    route: "/vis/system/ia-principles-v01",
    sourceFile: "src/pages/vis/system/ia-principles-v01.astro",
    title: "IA-prinsipper v0.1",
    surfaceType: "system-doc",
    status: "canonical",
    currentPlacement: "VIS system",
    suggestedPlacement: "Forstå system → IA-prinsipper",
    recommendation: "behold",
    rationale: "Need-led IA-grunnmur.",
    mandate: { ...M.systemDoc, userNeed: "Forstå need-led IA-prinsipper for produktet", overlappingSurfaces: ["Hub Mandate v0.1", "KlarLyd – Strategisk IA v5"] },
  },
  {
    id: "ia-inventory",
    route: "/vis/system/ia-inventory-v01",
    sourceFile: "src/pages/vis/system/ia-inventory-v01.astro",
    title: "VIS IA Inventory v0.3.1",
    surfaceType: "system-doc",
    status: "active",
    currentPlacement: "VIS system (meta)",
    suggestedPlacement: "Meta / IA-arbeid",
    recommendation: "behold",
    rationale: "Mandatpass før tremeny.",
    mandate: M.iaInventory,
  },
  {
    id: "hub-mandate",
    route: "/vis/system/hub-mandate-v01",
    sourceFile: "src/pages/vis/system/hub-mandate-v01.astro",
    title: "Hub Mandate v0.1",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system",
    suggestedPlacement: "Forstå system → Hub mandate",
    recommendation: "behold",
    rationale: "Canonical hub-mandat.",
    mandate: { ...M.systemDoc, userNeed: "Forstå mandat for hver hub-type i produktet" },
  },
  {
    id: "design-system-v01-overview",
    route: "/vis/system/design-system-v01",
    sourceFile: "src/pages/vis/system/design-system-v01.astro",
    title: "Design System Overview (VIS legacy)",
    surfaceType: "system-doc",
    status: "legacy",
    currentPlacement: "VIS system — merket legacy",
    suggestedPlacement: "Historikk → Legacy design v01",
    recommendation: "arkiver",
    rationale: "Erstattet av /designsystem/.",
    mandate: { ...M.legacyDoc, userNeed: "Historisk designreferanse", overlappingSurfaces: ["Designsystem"], postUseAction: "Bruk /designsystem/ i stedet" },
  },
  {
    id: "article-system",
    route: "/vis/system/article-system",
    sourceFile: "src/pages/vis/system/article-system.astro",
    title: "Article system (VIS)",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system",
    suggestedPlacement: "Forstå system → Artikkel-system",
    recommendation: "behold",
    rationale: "Artikkelkomponent-referanse.",
    mandate: { ...M.systemDoc, userNeed: "Forstå artikkel-system for redaksjon og design" },
  },
  {
    id: "article-foundations",
    route: "/vis/system/article/foundations",
    sourceFile: "src/pages/vis/system/article/foundations.astro",
    title: "Article foundations",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system/article/",
    suggestedPlacement: "Forstå system → Artikkel → Foundations",
    recommendation: "behold",
    rationale: "Grunnmur artikkel.",
    mandate: { ...M.systemDoc, userNeed: "Forstå artikkel-grunnmur" },
  },
  {
    id: "article-components",
    route: "/vis/system/article/components",
    sourceFile: "src/pages/vis/system/article/components.astro",
    title: "Article components",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system/article/",
    suggestedPlacement: "Forstå system → Artikkel → Components",
    recommendation: "behold",
    rationale: "Komponent-preview.",
    mandate: { ...M.systemDoc, userNeed: "Se artikkel-komponenter i kontekst" },
  },
  {
    id: "article-templates",
    route: "/vis/system/article/templates",
    sourceFile: "src/pages/vis/system/article/templates.astro",
    title: "Article templates",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system/article/",
    suggestedPlacement: "Forstå system → Artikkel → Templates",
    recommendation: "behold",
    rationale: "Template-oppskrift.",
    mandate: { ...M.systemDoc, userNeed: "Finne riktig artikkel-mal" },
  },
  {
    id: "article-changelog",
    route: "/vis/system/article/changelog",
    sourceFile: "src/pages/vis/system/article/changelog.astro",
    title: "Article changelog",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system/article/",
    suggestedPlacement: "Forstå system → Artikkel → Changelog",
    recommendation: "behold",
    rationale: "Historikk artikkel-system.",
    mandate: { ...M.systemDoc, userNeed: "Finne begrunnelse for artikkel-endringer", primaryTask: "historikk", secondaryTask: "forstå-system" },
  },
  {
    id: "article-index",
    route: "/vis/system/article/",
    sourceFile: "src/pages/vis/system/article/index.astro",
    title: "Article system index",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system/article/",
    suggestedPlacement: "Forstå system → Artikkel (gruppe)",
    recommendation: "slå sammen",
    rationale: "Tre-node for article-underdokumenter.",
    mandate: { ...M.systemDoc, userNeed: "Navigere artikkel-dokumentasjon", mandateRecommendation: "slå sammen" },
  },
  {
    id: "vis-system-index",
    route: "/vis/system/",
    sourceFile: "src/pages/vis/system/index.astro",
    title: "Systemreferanse (legacy hub)",
    surfaceType: "system-doc",
    status: "legacy",
    currentPlacement: "VIS /system — manuell link-liste",
    suggestedPlacement: "Arkiver når tremeny finnes",
    recommendation: "arkiver",
    rationale: "Flat hub dupliserer tre.",
    mandate: { ...M.legacyDoc, userNeed: "Fallback navigasjon til system-sider", overlappingSurfaces: ["Backstage", "IA Inventory", "Gitbuss"], postUseAction: "Bruk tremeny v0.2 i stedet" },
  },
  {
    id: "task-bus-live",
    route: "/vis/system/task-bus-live",
    sourceFile: "src/pages/vis/system/task-bus-live.astro",
    title: "Task bus live (pensjonert)",
    surfaceType: "runtime-tool",
    status: "legacy",
    currentPlacement: "VIS system — merket pensjonert",
    suggestedPlacement: "Historikk / arkiv",
    recommendation: "arkiver",
    rationale: "Erstattet av Gitbuss + roadmap.",
    mandate: { ...M.legacyDoc, userNeed: "Historisk task-bus", overlappingSurfaces: ["Gitbuss"], postUseAction: "Bruk Gitbuss" },
  },
  {
    id: "vis-artikkel-placeholder",
    route: "/vis/artikkel",
    sourceFile: "src/pages/vis/artikkel.astro",
    title: "VIS wireframe — Artikkel (placeholder)",
    surfaceType: "placeholder",
    status: "historical",
    currentPlacement: "VIS rot — placeholder",
    suggestedPlacement: "Historikk eller slett",
    recommendation: "vurder sletting",
    rationale: "Tom placeholder.",
    mandate: M.placeholder,
  },
  {
    id: "vis-hub-placeholder",
    route: "/vis/hub",
    sourceFile: "src/pages/vis/hub.astro",
    title: "VIS wireframe — NAV-Hub (placeholder)",
    surfaceType: "placeholder",
    status: "historical",
    currentPlacement: "VIS rot — placeholder",
    suggestedPlacement: "Historikk eller slett",
    recommendation: "vurder sletting",
    rationale: "Tom placeholder.",
    mandate: M.placeholder,
  },
  {
    id: "raw-wireframes",
    route: "/vis/[slug]",
    sourceFile: "src/pages/vis/[slug].astro + public/vis/raw/*.html",
    title: "Raw HTML wireframes (10 filer)",
    surfaceType: "wireframe-render",
    status: "historical",
    currentPlacement: "Arkiv/details på /vis/",
    suggestedPlacement: "Historikk → Raw wireframes",
    recommendation: "arkiver",
    rationale: "Kun referanse — ikke primær nav.",
    mandate: M.wireframe,
  },
  {
    id: "raw-klarlyd-forside-a",
    route: "/vis/KlarLyd_Forside_Variant_A",
    sourceFile: "public/vis/raw/KlarLyd_Forside_Variant_A.html",
    title: "KlarLyd – Forside Variant A",
    surfaceType: "wireframe-raw",
    status: "historical",
    currentPlacement: "Historikk / arkiv på /vis/",
    suggestedPlacement: "Historikk / arkiv",
    recommendation: "arkiver",
    rationale: "Tidlig wireframe — produksjon er /no/.",
    mandate: { ...M.wireframe, userNeed: "Se tidlig forside-variant A", postUseAction: "Sammenlign med /no/ — ikke implementer" },
  },
  {
    id: "raw-klarlyd-forside-b",
    route: "/vis/KlarLyd_Forside_Variant_B_AI_v01",
    sourceFile: "public/vis/raw/KlarLyd_Forside_Variant_B_AI_v01.html",
    title: "KlarLyd – Forside Variant B (AI First)",
    surfaceType: "wireframe-raw",
    status: "historical",
    currentPlacement: "Historikk / arkiv",
    suggestedPlacement: "Historikk / arkiv",
    recommendation: "arkiver",
    rationale: "Historisk AI-first forsidespike.",
    mandate: { ...M.wireframe, userNeed: "Se AI-first forsidespike" },
  },
  {
    id: "raw-strategi-notion",
    route: "/vis/KlarLyd_Strategi_Notion_v05",
    sourceFile: "public/vis/raw/KlarLyd_Strategi_Notion_v05.html",
    title: "KlarLyd – Strategisk IA v5",
    surfaceType: "wireframe-raw",
    status: "historical",
    currentPlacement: "Historikk / arkiv",
    suggestedPlacement: "Historikk → Strategi",
    recommendation: "arkiver",
    rationale: "Erstattet av ia-principles + hub-mandate.",
    mandate: { ...M.wireframe, userNeed: "Finne tidlig strategisk IA-begrunnelse", overlappingSurfaces: ["IA-prinsipper v0.1", "Hub Mandate v0.1"] },
  },
  {
    id: "raw-sprint-foundation",
    route: "/vis/KlarLyd_Sprint_01_Foundation_Archive_v09",
    sourceFile: "public/vis/raw/KlarLyd_Sprint_01_Foundation_Archive_v09.html",
    title: "Sprint 01 Foundation (arkiv)",
    surfaceType: "wireframe-raw",
    status: "historical",
    currentPlacement: "Historikk / arkiv",
    suggestedPlacement: "Historikk → Lukkede sprintvisninger",
    recommendation: "arkiver",
    rationale: "Eksplisitt arkivert sprint.",
    mandate: { ...M.wireframe, userNeed: "Se lukket sprint som modell for fremtidige", overlappingSurfaces: ["Sprint 2026-W21"], postUseAction: "Modell for closedSprints — ikke aktiv lab" },
  },
  {
    id: "raw-live-board",
    route: "/vis/KlarLyd_Live_Board_Roadmap_v01",
    sourceFile: "public/vis/raw/KlarLyd_Live_Board_Roadmap_v01.html",
    title: "KlarLyd Live Board / Roadmap v0.4",
    surfaceType: "wireframe-raw",
    status: "legacy",
    currentPlacement: "Historikk — merket pensjonert",
    suggestedPlacement: "Historikk / arkiv",
    recommendation: "vurder sletting",
    rationale: "Erstattet av roadmap-timeline-v01.",
    mandate: { ...M.legacyDoc, userNeed: "Historisk live board", overlappingSurfaces: ["Roadmap timeline"], postUseAction: "Bruk roadmap-timeline-v01", mandateRecommendation: "vurder sletting" },
  },
  {
    id: "mvp-current-state",
    route: "(data)",
    sourceFile: "src/data/mvp-current-state.ts",
    title: "MVP current-state registry",
    surfaceType: "runtime-data",
    status: "canonical",
    currentPlacement: "Data — driver /vis/ MVP nå og sprint",
    suggestedPlacement: "Nå (datakilde)",
    recommendation: "behold",
    rationale: "Operativ sannhet for kontrollrom.",
    mandate: { ...M.runtimeData, userNeed: "Drive MVP-status og sprint-info på kontrollrom", overlappingSurfaces: ["VIS kontrollrom", "Sprint 2026-W21"] },
  },
  {
    id: "vis-frontpage-hubs",
    route: "(data)",
    sourceFile: "src/data/vis-frontpage-hubs-v01.ts",
    title: "VIS frontpage hubs registry",
    surfaceType: "runtime-data",
    status: "active",
    currentPlacement: "Data — driver hub-kort på /vis/",
    suggestedPlacement: "Konsolider med tremeny-data",
    recommendation: "slå sammen",
    rationale: "Konsolideres med tremeny i VIS Tree Navigation v0.1 — avklart neste steg.",
    mandate: M.hubsRegistry,
  },
];

export function getVisIaInventoryEntries(): VisIaEntry[] {
  return visIaInventoryEntries;
}

export function getVisIaInventoryEntriesFull(): VisIaEntryFull[] {
  return visIaInventoryEntries.map((entry) => ({
    ...entry,
    consolidation: visIaConsolidationById[entry.id] ?? {
      mandatePlain: entry.mandate.userNeed,
      practicalHelp: entry.mandate.coreContent,
      whatToDoHere: entry.mandate.postUseAction,
      whatNotToDoHere: "—",
      functionalValue: [],
      overlapKind: "ingen" as const,
      overlapNote: entry.mandate.overlappingSurfaces.join(", ") || "—",
      mergeRisk: "Ikke vurdert",
      futurePlacement: "trenger Thomas-avklaring" as const,
      needsThomasReview: true,
    },
  }));
}

export function getVisIaThomasReviewEntries(): VisIaEntryFull[] {
  return getVisIaInventoryEntriesFull().filter((e) => e.consolidation.needsThomasReview);
}

export function getVisIaEntriesByStatus(status: VisIaStatus): VisIaEntry[] {
  return visIaInventoryEntries.filter((e) => e.status === status);
}

export function getVisIaEntriesByRecommendation(rec: VisIaRecommendation): VisIaEntry[] {
  return visIaInventoryEntries.filter((e) => e.recommendation === rec);
}

export function getVisIaEntriesByTopTask(task: VisIaTopTask): VisIaEntry[] {
  return visIaInventoryEntries.filter(
    (e) => e.mandate.primaryTask === task || e.mandate.secondaryTask === task,
  );
}

export function getVisIaMergeCandidates(): VisIaEntry[] {
  return visIaInventoryEntries.filter((e) => e.recommendation === "slå sammen");
}

export function getVisIaArchiveCandidates(): VisIaEntry[] {
  return visIaInventoryEntries.filter((e) => e.recommendation === "arkiver");
}

export function getVisIaDeleteCandidates(): VisIaEntry[] {
  return visIaInventoryEntries.filter((e) => e.recommendation === "vurder sletting");
}
