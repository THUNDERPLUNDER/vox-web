/* CONTRACT: Operativ MVP current-state registry — single source for VIS frontpage and agent status checks.
   Update when MVP status, applied surfaces, design patterns, AI status or next risks change.
*/

export type SurfaceStatus =
  | "Applied"
  | "Canonical"
  | "Applied / Canonical"
  | "Candidate"
  | "Needs QA"
  | "Planned"
  | "Deprecated";

export type MvpSurface = {
  id: string;
  label: string;
  route: string;
  status: SurfaceStatus;
  note?: string;
  /** Show in VIS frontpage «MVP nå» */
  visFrontpage: boolean;
  /** public = prod route; internal = VIS/designsystem; reference = review/sprint */
  kind: "public" | "internal" | "reference";
  frontpageDescription?: string;
};

export type CanonicalReference = {
  id: string;
  label: string;
  route: string;
  role: string;
  visFrontpage: boolean;
  frontpageDescription?: string;
};

export type NextRisk = {
  id: string;
  label: string;
  detail?: string;
};

export type RecentChange = {
  date: string;
  summary: string;
  issue?: string;
  commit?: string;
};

export const mvpCurrentState = {
  updatedAt: "2026-05-30",
  currentFocus:
    "Standalone Spør Viddel og designsystem-katalog er merged. Neste: Public AI guard v0.1 og production CES env-vars før bred AI-aktivering.",
  mvpSurfaces: [
    {
      id: "frontpage",
      label: "Forside",
      route: "/no/",
      status: "Applied",
      visFrontpage: true,
      kind: "public",
      frontpageDescription: "Offentlig forside og routing.",
    },
    {
      id: "hjelp",
      label: "Hjelp",
      route: "/no/hjelp/",
      status: "Applied",
      visFrontpage: true,
      kind: "public",
      frontpageDescription: "Praktisk hjelpehub.",
    },
    {
      id: "bedre-lyd",
      label: "Bedre lyd",
      route: "/no/bedre-lyd/",
      status: "Applied",
      visFrontpage: true,
      kind: "public",
      frontpageDescription: "Editorial/magasinflate.",
    },
    {
      id: "chat",
      label: "Spør Viddel",
      route: "/no/chat/",
      status: "Applied",
      note: "Production UI live. Production AI blocked until CES env-vars + Public AI guard/rate limit.",
      visFrontpage: true,
      kind: "public",
      frontpageDescription: "Standalone headless AI — UI live, prod AI venter env-vars/guard.",
    },
    {
      id: "designsystem",
      label: "Designsystem",
      route: "/designsystem/",
      status: "Applied / Canonical",
      note: "MVP designsystem source of truth v0.1.",
      visFrontpage: true,
      kind: "internal",
      frontpageDescription: "Canonical mønster- og komponentreferanse (HITL).",
    },
  ] satisfies MvpSurface[],
  canonicalReferences: [
    {
      id: "designsystem",
      label: "Designsystem",
      route: "/designsystem/",
      role: "Gjeldende designsystem-sannhet",
      visFrontpage: false,
    },
    {
      id: "review",
      label: "Review registry",
      route: "/vis/review/",
      role: "Stakeholder review og surface QA",
      visFrontpage: true,
      frontpageDescription: "Status og QA for pågående surface-arbeid.",
    },
    {
      id: "sprint-w21",
      label: "Sprint preview 2026-W21",
      route: "/vis/sprints/2026-w21/",
      role: "Historikk · guardrails · produktanatomi",
      visFrontpage: true,
      frontpageDescription: "MVP Design Lock — historikk og beslutningsgrunnlag.",
    },
  ] satisfies CanonicalReference[],
  nextRisks: [
    {
      id: "public-ai-guard",
      label: "Public AI guard v0.1",
      detail: "Rate limit og trygg public AI-aktivering før bred bruk av /no/chat/.",
    },
    {
      id: "ces-prod-env",
      label: "CES production env-vars",
      detail: "Vercel Production må ha CES-konfigurasjon for /api/chat.",
    },
    {
      id: "transcript-qa",
      label: "Transcript QA",
      detail: "Samtalelogg mønster — Needs QA i /designsystem/.",
    },
    {
      id: "loading-error-qa",
      label: "Loading / Error QA",
      detail: "Candidate-mønster — systematisk QA mot artikkel-AI og standalone.",
    },
    {
      id: "interactive-previews",
      label: "Interactive pattern previews",
      detail: "Parkert til senere pass — statiske previews i v0.1.",
    },
  ] satisfies NextRisk[],
  recentChanges: [
    {
      date: "2026-05-30",
      summary: "Design System Source of Truth v0.1 merged — canonical /designsystem/",
      issue: "#157",
      commit: "1fcef2f6",
    },
    {
      date: "2026-05-30",
      summary: "#125M-C Standalone AI custom chat R1 merged — /no/chat/ headless",
      issue: "#157 · #125M-C",
      commit: "e896d377",
    },
  ] satisfies RecentChange[],
} as const;

export type VisFrontpageEntry = {
  title: string;
  description: string;
  href: string;
  status: string;
  note?: string;
  kind: MvpSurface["kind"] | "reference";
};

/** Entries for VIS frontpage «MVP nå» — derived from registry, not hand-coded in VIS. */
export function getVisFrontpageEntries(baseUrl: string): VisFrontpageEntry[] {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  const surfaceOrder = ["chat", "designsystem", "frontpage", "hjelp", "bedre-lyd"];
  const surfaces = surfaceOrder
    .map((id) => mvpCurrentState.mvpSurfaces.find((s) => s.id === id))
    .filter((s): s is MvpSurface => !!s && s.visFrontpage);

  const refOrder = ["review", "sprint-w21"];
  const references = refOrder
    .map((id) => mvpCurrentState.canonicalReferences.find((r) => r.id === id))
    .filter((r): r is CanonicalReference => !!r && r.visFrontpage);

  const surfaceEntries: VisFrontpageEntry[] = surfaces.map((s) => ({
    title: s.id === "chat" ? "Spør Viddel production" : s.id === "designsystem" ? "Designsystem" : `${s.label} production`,
    description: s.frontpageDescription ?? s.label,
    href: `${base}${s.route.replace(/^\//, "")}`,
    status: s.status,
    note: s.note,
    kind: s.kind,
  }));

  const refEntries: VisFrontpageEntry[] = references.map((r) => ({
    title: r.label,
    description: r.frontpageDescription ?? r.role,
    href: `${base}${r.route.replace(/^\//, "")}`,
    status: r.id === "sprint-w21" ? "Historikk" : "Reference",
    kind: "reference" as const,
  }));

  return [...surfaceEntries, ...refEntries];
}
