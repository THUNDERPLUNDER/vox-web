/* CONTRACT: VIS Tree Navigation v0.1 — felles datakilde for tremeny, hub-kort og page contract. */

export type VisHubAvailability = "active" | "planned" | "historikk";

export type VisHubTier = "primary" | "secondary";

export type VisFrontpageHub = {
  id: string;
  title: string;
  mandate: string;
  href?: string;
  availability: VisHubAvailability;
  tier: VisHubTier;
  issue?: string;
};

export type VisPageStatus =
  | "active"
  | "canonical"
  | "lab"
  | "reference"
  | "historical"
  | "legacy";

export type VisPageContract = {
  id: string;
  title: string;
  type: string;
  status: VisPageStatus;
  purpose: string;
  primaryTask: string;
  audience: string[];
  relatedArea?: string[];
  canonicalSource?: string;
  lastReviewed: string;
  ownerRole: string;
  nextAction?: string;
};

export type VisNavItem = {
  id: string;
  label: string;
  href?: string;
  secondaryLabel?: string;
  pageContractId?: string;
  hubTier?: "primary" | "secondary";
  navOnly?: boolean;
};

export type VisNavSection = {
  id: string;
  label: string;
  items: VisNavItem[];
};

export const visPageContracts: Record<string, VisPageContract> = {
  "vis-kontrollrom": {
    id: "vis-kontrollrom",
    title: "VIS Project State",
    type: "project-state-read-model",
    status: "active",
    purpose: "Kuratert Project Brain-projeksjon og inngang til Grunnmur, Design og Kode. Ikke backlog.",
    primaryTask: "status-nå",
    audience: ["Thomas", "Vibeke", "interessenter"],
    relatedArea: ["project-brain", "designsystem", "gitbuss"],
    canonicalSource: "Viddel – Project Brain (Current)",
    lastReviewed: "2026-09-07",
    ownerRole: "Thomas",
    nextAction: "Les Project State og gå videre til den kilden eller arbeidsflaten du trenger.",
  },
  "runtime-feed": {
    id: "runtime-feed",
    title: "Runtime feed",
    type: "runtime-data",
    status: "historical",
    purpose: "Tidligere runtime-presentasjon. Beholdes smalt og eier ikke overordnet prosjektstatus.",
    primaryTask: "historikk",
    audience: ["Thomas", "Vibeke"],
    canonicalSource: "src/data/vis-runtime-feed.ts",
    lastReviewed: "2026-09-07",
    ownerRole: "Thomas",
  },
  "sprint-active": {
    id: "sprint-active",
    title: "Sprint 2026-W21 (historikk)",
    type: "sprint-lab",
    status: "historical",
    purpose: "Historisk designarbeid og beslutningsgrunnlag. Ikke gjeldende prosjektstatus.",
    primaryTask: "historikk",
    audience: ["Thomas", "Vibeke"],
    lastReviewed: "2026-09-07",
    ownerRole: "Thomas",
    nextAction: "Åpne relevant lab og ta beslutning i Review.",
  },
  "sprint-lab-default": {
    id: "sprint-lab-default",
    title: "Sprint lab",
    type: "sprint-lab",
    status: "lab",
    purpose: "Beslutningsgrunnlag for design i aktiv sprint.",
    primaryTask: "beslutninger-qa",
    audience: ["Thomas", "Vibeke"],
    canonicalSource: "/designsystem/",
    lastReviewed: "2026-06-01",
    ownerRole: "Thomas",
    nextAction: "Godkjenn i Review — deretter oppdater designsystem.",
  },
  designsystem: {
    id: "designsystem",
    title: "Designsystem",
    type: "canonical-external",
    status: "canonical",
    purpose: "Canonical UI-mønstre, tokens og komponenter for produksjon.",
    primaryTask: "forstå-system",
    audience: ["Thomas", "Vibeke", "Cursor"],
    lastReviewed: "2026-06-01",
    ownerRole: "Thomas",
    nextAction: "Slå opp mønster før implementasjon eller QA.",
  },
  backstage: {
    id: "backstage",
    title: "Backstage",
    type: "canonical-external",
    status: "canonical",
    purpose: "Systemforklaring for AI, API og arbeidsregler — autoritativ referanse.",
    primaryTask: "forstå-system",
    audience: ["Thomas", "Vibeke", "Cursor"],
    lastReviewed: "2026-06-01",
    ownerRole: "Thomas",
    nextAction: "Les operating rules ved systemendringer.",
  },
  gitbuss: {
    id: "gitbuss",
    title: "Gitbuss",
    type: "runtime-tool",
    status: "active",
    purpose: "Operativ GitHub-oversikt — issues og PR-er uten å åpne GitHub.",
    primaryTask: "jobber-med",
    audience: ["Thomas", "Cursor"],
    lastReviewed: "2026-06-01",
    ownerRole: "Thomas",
    nextAction: "Prioriter arbeid — koble til sprint eller roadmap ved behov.",
  },
  roadmap: {
    id: "roadmap",
    title: "Roadmap",
    type: "runtime-tool",
    status: "active",
    purpose: "NOW → NEXT → LATER med WATCH som separat signallag — ikke daglig task-backlog.",
    primaryTask: "forstå-system",
    audience: ["Thomas", "Vibeke"],
    lastReviewed: "2026-09-08",
    ownerRole: "Thomas",
  },
  "redaksjonelle-bilder": {
    id: "redaksjonelle-bilder",
    title: "Redaksjonelle bilder",
    type: "assets",
    status: "active",
    purpose: "Finne og velge bilder til artikler og innhold.",
    primaryTask: "finn-flate",
    audience: ["Thomas", "Vibeke"],
    lastReviewed: "2026-06-01",
    ownerRole: "Vibeke",
    nextAction: "Velg bilde til innhold i Storyblok/redaksjon.",
  },
  review: {
    id: "review",
    title: "Review",
    type: "review",
    status: "active",
    purpose: "QA og godkjenne design og sprint-labs før de blir canonical.",
    primaryTask: "beslutninger-qa",
    audience: ["Thomas", "Vibeke"],
    lastReviewed: "2026-06-01",
    ownerRole: "Thomas",
    nextAction: "Gå gjennom review-lenker og godkjenn eller send tilbake.",
  },
  "agentdrift-runbook": {
    id: "agentdrift-runbook",
    title: "Agentdrift / runbook",
    type: "system-doc",
    status: "legacy",
    purpose: "Superseded Control Center. Beholdes som historisk referanse; Project Brain + VIS Project State er ny inngang.",
    primaryTask: "historikk",
    audience: ["Thomas"],
    canonicalSource: "/backstage/",
    lastReviewed: "2026-09-07",
    ownerRole: "Thomas",
    nextAction: "Bruk Project Brain og VIS Project State som gjeldende inngang.",
  },
  "ia-inventory": {
    id: "ia-inventory",
    title: "IA inventory",
    type: "system-doc",
    status: "reference",
    purpose: "Dyp referanse for VIS IA — mandat, overlapp og konsolidering. Ikke daglig UI-mønster.",
    primaryTask: "forstå-system",
    audience: ["Thomas"],
    lastReviewed: "2026-06-01",
    ownerRole: "Thomas",
  },
  "knowledge-status": {
    id: "knowledge-status",
    title: "Knowledge status",
    type: "runtime-data",
    status: "active",
    purpose: "Lesbar oversikt over source trust, review-behov og manifest-gate — uten JSON/scripts.",
    primaryTask: "forstå-system",
    audience: ["Thomas", "Vibeke", "@navigator"],
    canonicalSource: "data/source-inventory/knowledge-status.sample.json",
    lastReviewed: "2026-06-05",
    ownerRole: "Thomas",
    nextAction: "Sjekk datastore-ready og review-flagg før manifest-godkjenning.",
  },
  "conversation-area-pattern-v01": {
    id: "conversation-area-pattern-v01",
    title: "Innlogget samtaleområde",
    type: "interactive-pattern-verification",
    status: "reference",
    purpose: "Klikkbart, godkjent strukturgrunnlag før UX-copy, visuell design og implementering.",
    primaryTask: "beslutninger-qa",
    audience: ["Thomas", "Vibeke", "@navigator", "@rigger"],
    canonicalSource: "docs/project/VIDDEL_CONVERSATION_AREA_LAYOUT_CBA_v0_2.md",
    lastReviewed: "2026-07-31",
    ownerRole: "Thomas",
    nextAction: "Bruk mønsteret sammen med godkjent copy-review; neste port er visuell retning og tokens.",
  },
  "conversation-area-copy-review-v01": {
    id: "conversation-area-copy-review-v01",
    title: "Innlogget samtaleområde — copy-review",
    type: "interactive-pattern-verification",
    status: "reference",
    purpose: "Klikkbar kontroll av godkjent UX-copy i den strukturelle CBA-en.",
    primaryTask: "beslutninger-qa",
    audience: ["Thomas", "Vibeke", "@navigator", "@rigger"],
    canonicalSource: "docs/project/VIDDEL_CONVERSATION_AREA_UX_COPY_CBA_v0_1.md",
    lastReviewed: "2026-07-31",
    ownerRole: "Thomas",
    nextAction: "Bruk copy-reviewen sammen med strukturreferansen; neste port er visuell retning og tokens.",
  },
  "conversation-area-visual-review-v01": {
    id: "conversation-area-visual-review-v01",
    title: "Innlogget samtaleområde — visuell kontroll",
    type: "interactive-pattern-verification",
    status: "reference",
    purpose: "Lett kontroll av visuelt hierarki og semantisk tokenbruk før implementering.",
    primaryTask: "beslutninger-qa",
    audience: ["Thomas", "Vibeke", "@navigator", "@rigger"],
    canonicalSource: "src/styles/tokens.css",
    lastReviewed: "2026-07-31",
    ownerRole: "Thomas",
    nextAction: "Bruk retningen sammen med implementeringsbrief v0.1.",
  },
  "status-to-audiologist-pattern-v01": {
    id: "status-to-audiologist-pattern-v01",
    title: "Min status til audiograf",
    type: "interactive-pattern-verification",
    status: "reference",
    purpose: "Klikkbart, godkjent struktur-, copy- og visualgrunnlag for et brukerkontrollert statusutkast.",
    primaryTask: "beslutninger-qa",
    audience: ["Thomas", "Vibeke", "@navigator", "@rigger"],
    canonicalSource: "docs/design/prototypes/VIDDEL_STATUS_TO_AUDIOLOGIST_VISUAL_REVIEW_v0_1.md",
    lastReviewed: "2026-08-02",
    ownerRole: "Thomas",
    nextAction: "Bruk grunnlaget i en avgrenset implementeringsbrief; deling, data og produktkode er ikke besluttet.",
  },
  "raw-wireframes": {
    id: "raw-wireframes",
    title: "Raw wireframes",
    type: "wireframe",
    status: "historical",
    purpose: "Historiske HTML-wireframes — begrunnelse, ikke gjeldende produkt.",
    primaryTask: "historikk",
    audience: ["Thomas", "Vibeke"],
    canonicalSource: "/no/",
    lastReviewed: "2026-06-01",
    ownerRole: "Thomas",
  },
  "legacy-docs": {
    id: "legacy-docs",
    title: "Legacy system-docs",
    type: "system-doc",
    status: "legacy",
    purpose: "Utdaterte systemdokumenter — sjekk canonical erstatning.",
    primaryTask: "historikk",
    audience: ["Thomas"],
    lastReviewed: "2026-06-01",
    ownerRole: "Thomas",
  },
};

export const visNavSections: VisNavSection[] = [
  {
    id: "now",
    label: "Nå",
    items: [
      {
        id: "kontrollrom",
        label: "Project State",
        href: "/vis",
        pageContractId: "vis-kontrollrom",
        hubTier: "primary",
      },
    ],
  },
  {
    id: "workspaces",
    label: "Arbeidsflater",
    items: [
      {
        id: "designsystem",
        label: "Designsystem",
        href: "/designsystem",
        pageContractId: "designsystem",
        hubTier: "primary",
      },
      {
        id: "backstage",
        label: "Backstage",
        href: "/backstage",
        pageContractId: "backstage",
        hubTier: "primary",
      },
      {
        id: "gitbuss",
        label: "Gitbuss",
        href: "/vis/system/github-runtime-status",
        pageContractId: "gitbuss",
        hubTier: "primary",
      },
      {
        id: "roadmap",
        label: "Roadmap",
        href: "/vis/system/roadmap-timeline-v01",
        pageContractId: "roadmap",
        hubTier: "primary",
      },
      {
        id: "redaksjonelle-bilder",
        label: "Redaksjonelle bilder",
        href: "/vis/assets/editorial",
        secondaryLabel: "DAM / bildebank",
        pageContractId: "redaksjonelle-bilder",
        hubTier: "secondary",
      },
      {
        id: "review",
        label: "Review",
        href: "/vis/review",
        pageContractId: "review",
        hubTier: "secondary",
      },
    ],
  },
  {
    id: "pattern-verifications",
    label: "Mønsterverifiseringer",
    items: [
      {
        id: "conversation-area-pattern-v01",
        label: "Innlogget samtaleområde",
        href: "/vis/viddel-conversation-area-cba-v0_1",
        secondaryLabel: "Strukturell CBA v0.2",
        pageContractId: "conversation-area-pattern-v01",
      },
      {
        id: "conversation-area-copy-review-v01",
        label: "Innlogget samtaleområde — copy",
        href: "/vis/viddel-conversation-area-copy-review-v0_1",
        secondaryLabel: "UX-copy CBA v0.1",
        pageContractId: "conversation-area-copy-review-v01",
      },
      {
        id: "conversation-area-visual-review-v01",
        label: "Innlogget samtaleområde — visuelt",
        href: "/vis/viddel-conversation-area-visual-review-v0_1",
        secondaryLabel: "Visuell kontroll v0.1",
        pageContractId: "conversation-area-visual-review-v01",
      },
      {
        id: "status-to-audiologist-pattern-v01",
        label: "Min status til audiograf",
        href: "/vis/viddel-status-to-audiologist-cba-v0_1",
        secondaryLabel: "Samlet CBA v0.1",
        pageContractId: "status-to-audiologist-pattern-v01",
      },
    ],
  },
  {
    id: "understand",
    label: "Forstå system og innhold",
    items: [
      {
        id: "agentdrift",
        label: "Control Center (superseded)",
        href: "/vis/system/control-center",
        pageContractId: "agentdrift-runbook",
      },
      {
        id: "ia-inventory",
        label: "IA inventory",
        href: "/vis/system/ia-inventory-v01",
        pageContractId: "ia-inventory",
      },
      {
        id: "knowledge-status",
        label: "Knowledge status",
        href: "/vis/system/knowledge-status-v01",
        pageContractId: "knowledge-status",
      },
    ],
  },
  {
    id: "history",
    label: "Historikk",
    items: [
      {
        id: "sprint-w21-history",
        label: "Sprint 2026-W21",
        href: "/vis/sprints/2026-w21",
        pageContractId: "sprint-active",
      },
      {
        id: "raw-wireframes",
        label: "Raw wireframes",
        href: "/vis",
        pageContractId: "raw-wireframes",
      },
      {
        id: "legacy-design-v01",
        label: "Legacy design v01",
        href: "/vis/system/design-system-v01",
        pageContractId: "legacy-docs",
      },
      {
        id: "task-bus-live",
        label: "Task bus live",
        href: "/vis/system/task-bus-live",
        pageContractId: "legacy-docs",
      },
      {
        id: "sprint-archive",
        label: "Eldre sprintflater",
        href: "/vis/KlarLyd_Sprint_01_Foundation_Archive_v09",
        pageContractId: "raw-wireframes",
      },
      {
        id: "placeholder-artikkel",
        label: "Placeholder: artikkel",
        href: "/vis/artikkel",
        pageContractId: "legacy-docs",
      },
      {
        id: "placeholder-hub",
        label: "Placeholder: hub",
        href: "/vis/hub",
        pageContractId: "legacy-docs",
      },
    ],
  },
];

export const visNavigationMeta = {
  version: "v0.1",
  updatedAt: "2026-09-07",
  dataSource: "src/data/vis-navigation-v01.ts",
} as const;

export const visFrontpageMandate = {
  title: "Viddel Project State",
  lead: "Kuratert prosjektoversikt og inngang til Grunnmur, Design og Kode. Ikke backlog.",
} as const;

export const visPrimaryNextWorkIds = [
  "ai-usage-monitoring",
  "internal-ai-test-qa",
] as const;

export const visSourceOfTruthNotes = [
  { label: "Viddel – Project Brain (Current)", role: "Overordnet prosjektsyntese" },
  { label: "src/data/vis-project-state-v01.ts", role: "Kuratert VIS-projeksjon" },
  { label: "src/data/mvp-current-state.ts", role: "Smal produkt-/runtime-status" },
  { label: "/designsystem/", role: "Gjeldende UI/mønstre" },
  { label: "/backstage/", role: "System/API/guard — canonical referanse" },
  { label: "GitHub issues/projects", role: "Oppgavebuss" },
  { label: "Roadmap", role: "Retning / faser" },
  { label: "Redaksjonelle bilder", role: "Assetoversikt" },
  { label: "Sprint-sider", role: "Aktiv sprint · lukkede i arkiv" },
  { label: "src/data/vis-navigation-v01.ts", role: "Tremeny og page contract" },
] as const;
