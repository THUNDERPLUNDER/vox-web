/* CONTRACT: VIS IA Inventory v0.1 — kartlegging av flater, status og foreslått tremeny (analyse, ikke implementasjon). */

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
  | "flytt"
  | "arkiver"
  | "vurder sletting";

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
};

export type VisIaTreeNode = {
  id: string;
  label: string;
  href?: string;
  note?: string;
  children?: VisIaTreeNode[];
};

export type VisIaConsolidationNote = {
  id: string;
  title: string;
  recommendation: string;
  rationale: string;
};

export const visIaInventoryMeta = {
  version: "v0.1",
  updatedAt: "2026-05-31",
  purpose:
    "Kartlegging før trebasert lokalmeny i VIS. Analyse og forslag — ingen routes slettet eller flyttet.",
} as const;

/** Foreslått tremeny v0.1 — Thomas QA før implementasjon. */
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
          {
            id: "runtime-feed",
            label: "Runtime feed",
            note: "Innebygd i /vis/ — data i vis-runtime-feed.ts",
          },
          {
            id: "sprint-active",
            label: "Sprint 2026-W21",
            href: "/vis/sprints/2026-w21/",
            note: "Aktiv sprint — labs under denne noden i detaljvisning",
          },
        ],
      },
      {
        id: "system",
        label: "System",
        children: [
          {
            id: "backstage",
            label: "Backstage",
            href: "/backstage/",
            note: "Egen global rute — vises i VIS-tre som systemreferanse",
          },
          {
            id: "gitbuss",
            label: "Gitbuss",
            href: "/vis/system/github-runtime-status",
          },
          {
            id: "roadmap",
            label: "Roadmap",
            href: "/vis/system/roadmap-timeline-v01",
          },
          {
            id: "control-center",
            label: "Control Center",
            href: "/vis/system/control-center",
            note: "Prosjektkontekst for agenter — sekundær inngang",
          },
        ],
      },
      {
        id: "design",
        label: "Design",
        children: [
          {
            id: "designsystem",
            label: "Designsystem",
            href: "/designsystem/",
            note: "Egen global canonical rute — vises i VIS-tre",
          },
          {
            id: "review",
            label: "Review",
            href: "/vis/review/",
            note: "QA-innganger — under Design, ikke egen topp-hub",
          },
        ],
      },
      {
        id: "content-assets",
        label: "Innhold og assets",
        children: [
          {
            id: "dam",
            label: "DAM / bildebank",
            href: "/vis/assets/editorial",
            note: "Slå sammen navn med Editorial Image Library",
          },
        ],
      },
      {
        id: "archive",
        label: "Historikk / arkiv",
        children: [
          {
            id: "raw-wireframes",
            label: "Raw wireframes (HTML)",
            note: "public/vis/raw + /vis/[slug] — kun via arkiv/details",
          },
          {
            id: "legacy-system",
            label: "Legacy system-docs",
            note: "design-system-v01, task-bus-live, m.fl.",
          },
          {
            id: "closed-sprints",
            label: "Lukkede sprintvisninger",
            note: "Når currentSprint.status = closed",
          },
        ],
      },
    ],
  },
];

export const visIaConsolidationNotes: VisIaConsolidationNote[] = [
  {
    id: "designsystem-global",
    title: "/designsystem/ som global intern flate",
    recommendation: "Behold egen rute; vis som tre-node under Design",
    rationale:
      "Canonical UI-referanse brukes også utenfor VIS. Tremeny lenker hit — flytter ikke innhold inn i /vis/.",
  },
  {
    id: "backstage-global",
    title: "/backstage/ som global intern flate",
    recommendation: "Behold egen rute; vis som tre-node under System",
    rationale:
      "Systemreferanse for AI/API/guard. Samme mønster som designsystem — egen URL, VIS-tre peker hit.",
  },
  {
    id: "dam-editorial",
    title: "DAM / bildebank vs Editorial Image Library",
    recommendation: "Slå sammen til ett område: «Innhold og assets»",
    rationale:
      "Hub heter DAM; ruten er /vis/assets/editorial med Editorial Image Library v0.2. Samme funksjon — én node i tre.",
  },
  {
    id: "review-under-design",
    title: "Review-plassering",
    recommendation: "Under Design — ikke egen primær hub",
    rationale:
      "Review er QA/godkjenning av design/spinter, ikke eget arbeidsområde. Sekundær hub i dag er riktig.",
  },
  {
    id: "sprint-under-now",
    title: "Sprint 2026-W21",
    recommendation: "Under «Nå og sprint» mens aktiv",
    rationale:
      "Matcher mvp-current-state.currentSprint og VIS sprint guard. Ved sprintskifte → Historikk.",
  },
  {
    id: "raw-archive-only",
    title: "Raw VIS HTML",
    recommendation: "Kun Historikk / arkiv — ikke primær nav",
    rationale:
      "10+ eldre wireframes/strategidok i public/vis/raw. Nyttig referanse, men skal ikke konkurrere med kontrollrom.",
  },
];

export const visIaInventoryEntries: VisIaEntry[] = [
  {
    id: "vis-frontpage",
    route: "/vis/",
    sourceFile: "src/pages/vis/index.astro",
    title: "VIS kontrollrom",
    surfaceType: "kontrollrom",
    status: "active",
    currentPlacement: "VIS rot — hub-and-spoke frontpage",
    suggestedPlacement: "VIS kontrollrom (rot)",
    recommendation: "behold",
    rationale: "Primær inngang. Runtime feed + MVP-status + huber. Ikke backlog.",
  },
  {
    id: "runtime-feed",
    route: "/vis/ (embedded)",
    sourceFile: "src/data/vis-runtime-feed.ts",
    title: "Runtime feed",
    surfaceType: "runtime-data",
    status: "active",
    currentPlacement: "Innebygd øverst på /vis/",
    suggestedPlacement: "Nå og sprint → Runtime feed",
    recommendation: "behold",
    rationale: "Manuell agent-status. Kommunikasjonsregel § B4. Ikke egen route.",
  },
  {
    id: "designsystem",
    route: "/designsystem/",
    sourceFile: "src/pages/designsystem/index.astro",
    title: "Designsystem",
    surfaceType: "canonical-external",
    status: "canonical",
    currentPlacement: "Global intern rute + primær VIS-hub",
    suggestedPlacement: "Design → Designsystem (lenke til global rute)",
    recommendation: "behold",
    rationale: "Canonical UI/mønstre. Bør forbli egen flate — vises i VIS-tre.",
  },
  {
    id: "backstage",
    route: "/backstage/",
    sourceFile: "src/pages/backstage/index.astro",
    title: "Backstage",
    surfaceType: "canonical-external",
    status: "canonical",
    currentPlacement: "Global intern rute + primær VIS-hub",
    suggestedPlacement: "System → Backstage (lenke til global rute)",
    recommendation: "behold",
    rationale: "Systemreferanse AI/API/guard. Egen URL riktig — pekes til fra VIS-tre.",
  },
  {
    id: "gitbuss",
    route: "/vis/system/github-runtime-status",
    sourceFile: "src/pages/vis/system/github-runtime-status.astro",
    title: "Gitbuss / GitHub runtime status",
    surfaceType: "runtime-tool",
    status: "active",
    currentPlacement: "VIS system — primær hub «Gitbuss»",
    suggestedPlacement: "System → Gitbuss",
    recommendation: "behold",
    rationale: "Generert GitHub-feed. Operativ — ikke design-dok.",
  },
  {
    id: "roadmap",
    route: "/vis/system/roadmap-timeline-v01",
    sourceFile: "src/pages/vis/system/roadmap-timeline-v01.astro",
    title: "Roadmap timeline",
    surfaceType: "runtime-tool",
    status: "active",
    currentPlacement: "VIS system — primær hub",
    suggestedPlacement: "System → Roadmap",
    recommendation: "behold",
    rationale: "Retning/faser fra GitHub — ikke task-backlog.",
  },
  {
    id: "dam-editorial",
    route: "/vis/assets/editorial",
    sourceFile: "src/pages/vis/assets/editorial.astro",
    title: "DAM / Editorial Image Library",
    surfaceType: "assets",
    status: "active",
    currentPlacement: "Sekundær hub «DAM / bildebank»",
    suggestedPlacement: "Innhold og assets → DAM / bildebank",
    recommendation: "slå sammen",
    rationale: "Hub-navn og sideinnhold bruker ulike navn — konsolider label til ett område.",
  },
  {
    id: "review",
    route: "/vis/review/",
    sourceFile: "src/pages/vis/review/index.astro",
    title: "Review",
    surfaceType: "review",
    status: "active",
    currentPlacement: "Sekundær hub",
    suggestedPlacement: "Design → Review",
    recommendation: "flytt",
    rationale: "QA/godkjenning hører til design-spor — ikke egen toppkategori i tremeny.",
  },
  {
    id: "sprint-2026-w21",
    route: "/vis/sprints/2026-w21/",
    sourceFile: "src/pages/vis/sprints/2026-w21/index.astro",
    title: "Sprint 2026-W21",
    surfaceType: "sprint-lab",
    status: "active",
    currentPlacement: "Primær hub (aktiv sprint)",
    suggestedPlacement: "Nå og sprint → Sprint 2026-W21",
    recommendation: "behold",
    rationale: "Aktiv currentSprint. Labs og beslutningsgrunnlag for MVP Design Lock.",
  },
  {
    id: "sprint-color",
    route: "/vis/sprints/2026-w21/color/",
    sourceFile: "src/pages/vis/sprints/2026-w21/color/index.astro",
    title: "Sprint lab — Color",
    surfaceType: "sprint-lab",
    status: "lab",
    currentPlacement: "Under aktiv sprint",
    suggestedPlacement: "Nå og sprint → Sprint → Color",
    recommendation: "behold",
    rationale: "Design Lock lab — aktiv beslutningsflate for sprint.",
  },
  {
    id: "sprint-typography",
    route: "/vis/sprints/2026-w21/typography/",
    sourceFile: "src/pages/vis/sprints/2026-w21/typography/index.astro",
    title: "Sprint lab — Typography",
    surfaceType: "sprint-lab",
    status: "lab",
    currentPlacement: "Under aktiv sprint",
    suggestedPlacement: "Nå og sprint → Sprint → Typography",
    recommendation: "behold",
    rationale: "Typografi-pass for sprint — referanse til production tokens.",
  },
  {
    id: "sprint-hub-types",
    route: "/vis/sprints/2026-w21/hub-types/",
    sourceFile: "src/pages/vis/sprints/2026-w21/hub-types/index.astro",
    title: "Sprint lab — Hub types",
    surfaceType: "sprint-lab",
    status: "lab",
    currentPlacement: "Under aktiv sprint + Review registry",
    suggestedPlacement: "Nå og sprint → Sprint → Hub types",
    recommendation: "behold",
    rationale: "IA-beslutning hub-typer — stakeholder-safe i review.",
  },
  {
    id: "sprint-editorial-hub",
    route: "/vis/sprints/2026-w21/editorial-hub/",
    sourceFile: "src/pages/vis/sprints/2026-w21/editorial-hub/index.astro",
    title: "Sprint lab — Editorial hub",
    surfaceType: "sprint-lab",
    status: "lab",
    currentPlacement: "Under aktiv sprint",
    suggestedPlacement: "Nå og sprint → Sprint → Editorial hub",
    recommendation: "behold",
    rationale: "Hub-visualisering for redaksjonell IA.",
  },
  {
    id: "sprint-frontpage-mandate",
    route: "/vis/sprints/2026-w21/frontpage-mandate/",
    sourceFile: "src/pages/vis/sprints/2026-w21/frontpage-mandate/index.astro",
    title: "Sprint lab — Frontpage mandate",
    surfaceType: "sprint-lab",
    status: "lab",
    currentPlacement: "Under aktiv sprint",
    suggestedPlacement: "Nå og sprint → Sprint → Frontpage mandate",
    recommendation: "behold",
    rationale: "Forsidemandat-lab knyttet til VIS IA-arbeid.",
  },
  {
    id: "sprint-primitives",
    route: "/vis/sprints/2026-w21/primitives/",
    sourceFile: "src/pages/vis/sprints/2026-w21/primitives/index.astro",
    title: "Sprint lab — Primitives (13 + 3 context)",
    surfaceType: "sprint-lab",
    status: "lab",
    currentPlacement: "Under aktiv sprint — surfaces, buttons, cards, m.fl.",
    suggestedPlacement: "Nå og sprint → Sprint → Primitives",
    recommendation: "behold",
    rationale: "MVP Design Lock primitives. Mange undersider — grupper i tre, ikke flat liste.",
  },
  {
    id: "control-center",
    route: "/vis/system/control-center",
    sourceFile: "src/pages/vis/system/control-center.astro",
    title: "Viddel Control Center",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system — featured inngang",
    suggestedPlacement: "System → Control Center (sekundær)",
    recommendation: "behold",
    rationale: "Agent/prosjektkontekst. Nyttig — men ikke primær for Thomas/Vibeke daglig.",
  },
  {
    id: "ia-principles",
    route: "/vis/system/ia-principles-v01",
    sourceFile: "src/pages/vis/system/ia-principles-v01.astro",
    title: "IA-prinsipper v0.1",
    surfaceType: "system-doc",
    status: "canonical",
    currentPlacement: "VIS system",
    suggestedPlacement: "System → IA-prinsipper (dokumentasjon)",
    recommendation: "behold",
    rationale: "Need-led IA-grunnmur — canonical for produkt-IA, ikke sprint-lab.",
  },
  {
    id: "ia-inventory",
    route: "/vis/system/ia-inventory-v01",
    sourceFile: "src/pages/vis/system/ia-inventory-v01.astro",
    title: "VIS IA Inventory v0.1",
    surfaceType: "system-doc",
    status: "active",
    currentPlacement: "VIS system (ny)",
    suggestedPlacement: "System → IA inventory (meta — kan skjules i prod-meny senere)",
    recommendation: "behold",
    rationale: "Dette dokumentet — kartlegging før tremeny.",
  },
  {
    id: "hub-mandate",
    route: "/vis/system/hub-mandate-v01",
    sourceFile: "src/pages/vis/system/hub-mandate-v01.astro",
    title: "Hub Mandate v0.1",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system",
    suggestedPlacement: "System → Hub mandate",
    recommendation: "behold",
    rationale: "Canonical hub-mandat — referanse, ikke daglig navigasjon.",
  },
  {
    id: "design-system-v01-overview",
    route: "/vis/system/design-system-v01",
    sourceFile: "src/pages/vis/system/design-system-v01.astro",
    title: "Design System Overview (VIS legacy)",
    surfaceType: "system-doc",
    status: "legacy",
    currentPlacement: "VIS system — merket legacy i system-index",
    suggestedPlacement: "Historikk / arkiv → Legacy system-docs",
    recommendation: "arkiver",
    rationale: "Erstattet av /designsystem/ som canonical. Behold URL, fjern fra primær nav.",
  },
  {
    id: "article-system",
    route: "/vis/system/article-system",
    sourceFile: "src/pages/vis/system/article-system.astro",
    title: "Article system (VIS)",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system",
    suggestedPlacement: "System → Article docs (undergruppe)",
    recommendation: "behold",
    rationale: "Artikkelkomponent-referanse — støtter redaksjon og designsystem.",
  },
  {
    id: "article-foundations",
    route: "/vis/system/article/foundations",
    sourceFile: "src/pages/vis/system/article/foundations.astro",
    title: "Article foundations",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system/article/",
    suggestedPlacement: "System → Article → Foundations",
    recommendation: "behold",
    rationale: "Dokumentasjon — grupper article/* under én tre-node.",
  },
  {
    id: "article-components",
    route: "/vis/system/article/components",
    sourceFile: "src/pages/vis/system/article/components.astro",
    title: "Article components",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system/article/",
    suggestedPlacement: "System → Article → Components",
    recommendation: "behold",
    rationale: "Komponent-preview referanse.",
  },
  {
    id: "article-templates",
    route: "/vis/system/article/templates",
    sourceFile: "src/pages/vis/system/article/templates.astro",
    title: "Article templates",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system/article/",
    suggestedPlacement: "System → Article → Templates",
    recommendation: "behold",
    rationale: "Template-oppskrift — referanse.",
  },
  {
    id: "article-changelog",
    route: "/vis/system/article/changelog",
    sourceFile: "src/pages/vis/system/article/changelog.astro",
    title: "Article changelog",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system/article/",
    suggestedPlacement: "System → Article → Changelog",
    recommendation: "behold",
    rationale: "Historikk for artikkel-system — lav frekvens.",
  },
  {
    id: "article-index",
    route: "/vis/system/article/",
    sourceFile: "src/pages/vis/system/article/index.astro",
    title: "Article system index",
    surfaceType: "system-doc",
    status: "reference",
    currentPlacement: "VIS system/article/",
    suggestedPlacement: "System → Article (gruppe)",
    recommendation: "slå sammen",
    rationale: "Kan være tre-node for article-underdokumenter — unngå flat system-liste.",
  },
  {
    id: "vis-system-index",
    route: "/vis/system/",
    sourceFile: "src/pages/vis/system/index.astro",
    title: "Systemreferanse (legacy hub)",
    surfaceType: "system-doc",
    status: "legacy",
    currentPlacement: "VIS /system — manuell link-liste",
    suggestedPlacement: "Erstattes av tremeny — behold som fallback til overgang",
    recommendation: "arkiver",
    rationale: "Flat hub dupliserer det nye treet skal løse. Behold midlertidig.",
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
    rationale: "Erstattet av GitHub runtime + roadmap. Vurder sletting etter tremeny.",
  },
  {
    id: "vis-artikkel-placeholder",
    route: "/vis/artikkel",
    sourceFile: "src/pages/vis/artikkel.astro",
    title: "VIS wireframe — Artikkel (placeholder)",
    surfaceType: "placeholder",
    status: "historical",
    currentPlacement: "VIS rot — placeholder",
    suggestedPlacement: "Historikk / arkiv eller fjern lenker",
    recommendation: "vurder sletting",
    rationale: "Tom placeholder — rå wireframes nå via /vis/[slug].",
  },
  {
    id: "vis-hub-placeholder",
    route: "/vis/hub",
    sourceFile: "src/pages/vis/hub.astro",
    title: "VIS wireframe — NAV-Hub (placeholder)",
    surfaceType: "placeholder",
    status: "historical",
    currentPlacement: "VIS rot — placeholder",
    suggestedPlacement: "Historikk / arkiv eller fjern lenker",
    recommendation: "vurder sletting",
    rationale: "Tom placeholder — erstattet av production hubs og sprint-labs.",
  },
  {
    id: "raw-wireframes",
    route: "/vis/[slug]",
    sourceFile: "src/pages/vis/[slug].astro + public/vis/raw/*.html",
    title: "Raw HTML wireframes (10 filer)",
    surfaceType: "wireframe-render",
    status: "historical",
    currentPlacement: "Arkiv/details på /vis/ + direkte slug-URL",
    suggestedPlacement: "Historikk / arkiv → Raw wireframes",
    recommendation: "arkiver",
    rationale: "KlarLyd wireframes, strategi, sprint-arkiv. Kun søkbar referanse — ikke primær nav.",
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
  },
  {
    id: "raw-strategi-notion",
    route: "/vis/KlarLyd_Strategi_Notion_v05",
    sourceFile: "public/vis/raw/KlarLyd_Strategi_Notion_v05.html",
    title: "KlarLyd – Strategisk IA v5",
    surfaceType: "wireframe-raw",
    status: "historical",
    currentPlacement: "Historikk / arkiv",
    suggestedPlacement: "Historikk / arkiv → Strategi",
    recommendation: "arkiver",
    rationale: "Strategidok — erstattet av ia-principles-v01 og hub-mandate.",
  },
  {
    id: "raw-sprint-foundation",
    route: "/vis/KlarLyd_Sprint_01_Foundation_Archive_v09",
    sourceFile: "public/vis/raw/KlarLyd_Sprint_01_Foundation_Archive_v09.html",
    title: "Sprint 01 Foundation (arkiv)",
    surfaceType: "wireframe-raw",
    status: "historical",
    currentPlacement: "Historikk / arkiv",
    suggestedPlacement: "Historikk / arkiv → Lukkede sprintvisninger",
    recommendation: "arkiver",
    rationale: "Eksplisitt arkivert sprint — modell for fremtidige closedSprints.",
  },
  {
    id: "raw-live-board",
    route: "/vis/KlarLyd_Live_Board_Roadmap_v01",
    sourceFile: "public/vis/raw/KlarLyd_Live_Board_Roadmap_v01.html",
    title: "KlarLyd Live Board / Roadmap v0.4",
    surfaceType: "wireframe-raw",
    status: "legacy",
    currentPlacement: "Historikk — merket pensjonert i system-index",
    suggestedPlacement: "Historikk / arkiv",
    recommendation: "vurder sletting",
    rationale: "Erstattet av roadmap-timeline-v01. Duplikat formål.",
  },
  {
    id: "mvp-current-state",
    route: "(data)",
    sourceFile: "src/data/mvp-current-state.ts",
    title: "MVP current-state registry",
    surfaceType: "runtime-data",
    status: "canonical",
    currentPlacement: "Data — driver /vis/ MVP nå og sprint",
    suggestedPlacement: "Nå og sprint (datakilde)",
    recommendation: "behold",
    rationale: "Operativ sannhet — ikke egen side, men kritisk for kontrollrom.",
  },
  {
    id: "vis-frontpage-hubs",
    route: "(data)",
    sourceFile: "src/data/vis-frontpage-hubs-v01.ts",
    title: "VIS frontpage hubs registry",
    surfaceType: "runtime-data",
    status: "active",
    currentPlacement: "Data — driver hub-kort på /vis/",
    suggestedPlacement: "Erstattes gradvis av tremeny-data",
    recommendation: "slå sammen",
    rationale: "Hub-definisjon overlapper med fremtidig tre — konsolider i v0.2.",
  },
];

export function getVisIaInventoryEntries(): VisIaEntry[] {
  return visIaInventoryEntries;
}

export function getVisIaEntriesByStatus(status: VisIaStatus): VisIaEntry[] {
  return visIaInventoryEntries.filter((e) => e.status === status);
}

export function getVisIaEntriesByRecommendation(rec: VisIaRecommendation): VisIaEntry[] {
  return visIaInventoryEntries.filter((e) => e.recommendation === rec);
}
