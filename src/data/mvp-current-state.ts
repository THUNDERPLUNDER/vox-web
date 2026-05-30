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
    "Public AI guard live (#180, Upstash OK). Test Access Gate (#181) revertet/parkert. Neste: CES production env-vars for intern test (Thomas og Vibeke). Deretter AI usage monitoring v0.1 og Backstage v0.1.",
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
      note: "Production UI live. Public AI guard v0.1 applied (#180). AI blocked until CES prod env-vars. Access gate (#181) parkert — kode revertet; intern test uten testkode.",
      visFrontpage: true,
      kind: "public",
      frontpageDescription: "Standalone headless AI — guard på plass, prod AI venter CES (intern test).",
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
      id: "ces-prod-env",
      label: "CES production env-vars (intern test)",
      detail: "Sett CES i Vercel Production for intern test med Thomas og Vibeke — krever Upstash guard (#180). Ikke ekstern pilot ennå.",
    },
    {
      id: "ai-usage-monitoring",
      label: "AI usage monitoring v0.1",
      detail: "Eget spor etter CES prod env-vars — overvåkning før bredere bruk.",
    },
    {
      id: "backstage-v01",
      label: "Backstage v0.1",
      detail: "Eget spor etter monitoring — intern operativ flate.",
    },
    {
      id: "test-access-gate-parked",
      label: "Access / Mine sider — parkert",
      detail: "#181 parkert. Testkode-kode revertet. Fremtidig ekstern pilot via innlogget «Mine sider» i globalmeny, ikke kodefelt i chat.",
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
      summary: "Test Access Gate code reverted/parked after scope decision (#181)",
      issue: "#181",
      commit: "—",
    },
    {
      date: "2026-05-30",
      summary: "Test Access Gate (#181) parkert — intern test uten access code; CES prod env neste",
      issue: "#181",
      commit: "—",
    },
    {
      date: "2026-05-30",
      summary: "Public AI guard v0.1 — rate limit + origin guard on /api/chat (#180)",
      issue: "#180",
      commit: "—",
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
