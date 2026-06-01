/* CONTRACT: VIS Tree Navigation v0.1 — felles datakilde for tremeny, hub-kort og page contract. */

import { mvpCurrentState } from "./mvp-current-state.ts";

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

const sprintRoute = mvpCurrentState.currentSprint.route.replace(/\/$/, "");

export const visPageContracts: Record<string, VisPageContract> = {
  "vis-kontrollrom": {
    id: "vis-kontrollrom",
    title: "VIS kontrollrom",
    type: "kontrollrom",
    status: "active",
    purpose: "Rask oversikt over hva som er sant nå, og hvor du går videre. Ikke backlog.",
    primaryTask: "status-nå",
    audience: ["Thomas", "Vibeke"],
    relatedArea: ["runtime-feed", "gitbuss"],
    lastReviewed: "2026-06-01",
    ownerRole: "Thomas",
    nextAction: "Les «Akkurat nå» og velg arbeidsflate i menyen.",
  },
  "runtime-feed": {
    id: "runtime-feed",
    title: "Runtime feed",
    type: "runtime-data",
    status: "active",
    purpose: "Kort «Akkurat nå» på forsiden — hva skjer og hva er neste beslutning.",
    primaryTask: "status-nå",
    audience: ["Thomas", "Vibeke"],
    canonicalSource: "src/data/vis-runtime-feed.ts",
    lastReviewed: "2026-06-01",
    ownerRole: "Thomas",
  },
  "sprint-active": {
    id: "sprint-active",
    title: "Sprint 2026-W21",
    type: "sprint-lab",
    status: "active",
    purpose: "Designarbeid og beslutninger denne sprinten.",
    primaryTask: "jobber-med",
    audience: ["Thomas", "Vibeke"],
    lastReviewed: "2026-06-01",
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
    purpose: "Retning og faser over tid — ikke daglig task-backlog.",
    primaryTask: "forstå-system",
    audience: ["Thomas", "Vibeke"],
    lastReviewed: "2026-06-01",
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
    status: "reference",
    purpose: "Agent-runbook og filpeker — operativ hjelp for Cursor og agenter.",
    primaryTask: "forstå-system",
    audience: ["Cursor", "@rigger"],
    canonicalSource: "/backstage/",
    lastReviewed: "2026-06-01",
    ownerRole: "Thomas",
    nextAction: "Start agent-oppgave med riktig kontekst.",
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
        label: "VIS kontrollrom",
        href: "/vis",
        pageContractId: "vis-kontrollrom",
        hubTier: "primary",
      },
      {
        id: "runtime-feed",
        label: "Runtime feed",
        navOnly: true,
        pageContractId: "runtime-feed",
      },
      {
        id: "sprint-active",
        label: "Sprint 2026-W21",
        href: sprintRoute,
        pageContractId: "sprint-active",
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
    id: "understand",
    label: "Forstå system og innhold",
    items: [
      {
        id: "agentdrift",
        label: "Agentdrift / runbook",
        href: "/vis/system/control-center",
        pageContractId: "agentdrift-runbook",
      },
      {
        id: "ia-inventory",
        label: "IA inventory",
        href: "/vis/system/ia-inventory-v01",
        pageContractId: "ia-inventory",
      },
    ],
  },
  {
    id: "history",
    label: "Historikk",
    items: [
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
  updatedAt: "2026-06-01",
  dataSource: "src/data/vis-navigation-v01.ts",
} as const;

export const visFrontpageMandate = {
  title: "VIS kontrollrom",
  lead: "Rask oversikt over hva som er sant nå, neste steg og hvor du går videre. Ikke backlog.",
} as const;

export const visPrimaryNextWorkIds = [
  "vis-tree-navigation-v01",
  "internal-ai-test-qa",
] as const;

export const visSourceOfTruthNotes = [
  { label: "src/data/mvp-current-state.ts", role: "Gjeldende MVP-status" },
  { label: "/designsystem/", role: "Gjeldende UI/mønstre" },
  { label: "/backstage/", role: "System/API/guard — canonical referanse" },
  { label: "GitHub issues/projects", role: "Oppgavebuss" },
  { label: "Roadmap", role: "Retning / faser" },
  { label: "Redaksjonelle bilder", role: "Assetoversikt" },
  { label: "Sprint-sider", role: "Aktiv sprint · lukkede i arkiv" },
  { label: "src/data/vis-navigation-v01.ts", role: "Tremeny og page contract" },
] as const;
