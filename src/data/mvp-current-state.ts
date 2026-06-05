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

export type SprintStatus = "active" | "closed";

/** Canonical active sprint — VIS control room reads this; never label active sprint as historikk. */
export type CurrentSprint = {
  id: string;
  label: string;
  route: string;
  status: SprintStatus;
  weekFocus: string;
  issue?: string;
};

export type ClosedSprint = {
  id: string;
  label: string;
  route: string;
  closedAt?: string;
};

export const mvpCurrentState = {
  updatedAt: "2026-06-05",
  currentSprint: {
    id: "2026-w21",
    label: "2026-W21",
    route: "/vis/sprints/2026-w21/",
    status: "active",
    weekFocus: "MVP Design Lock v0.1 — intern AI-test, backstage og monitoring før ekstern deling.",
    issue: "#126",
  } satisfies CurrentSprint,
  closedSprints: [] satisfies ClosedSprint[],
  currentFocus:
    "Monitoring levert (#188). Reliability-test via Vercel guard-limits (100/500 midlertidig) — ikke lokal token. Fallback ved behov.",
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
      note: "Live i production. Public guard aktiv — grenser justerbare i Vercel for pre-pilot CES-test (#188).",
      visFrontpage: true,
      kind: "public",
      frontpageDescription: "Headless AI-chat — live (intern test). Public guard aktiv.",
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
      id: "backstage",
      label: "Backstage",
      route: "/backstage/",
      role: "System/API/guard/env — canonical referanse",
      visFrontpage: false,
    },
    {
      id: "review",
      label: "Review registry",
      route: "/vis/review/",
      role: "Stakeholder review og surface QA",
      visFrontpage: false,
      frontpageDescription: "Status og QA for pågående surface-arbeid.",
    },
    {
      id: "sprint-w21",
      label: "Sprint preview 2026-W21",
      route: "/vis/sprints/2026-w21/",
      role: "Aktiv sprint — labs, guardrails og beslutningsgrunnlag",
      visFrontpage: false,
      frontpageDescription: "Operativ sprintflate for 2026-W21.",
    },
    {
      id: "knowledge-status",
      label: "Knowledge status",
      route: "/vis/system/knowledge-status-v01/",
      role: "Source trust, review-behov og manifest-gate — sample inventory v0.1",
      visFrontpage: false,
    },
  ] satisfies CanonicalReference[],
  nextRisks: [
    {
      id: "internal-ai-test-qa",
      label: "Intern AI-test QA (Thomas og Vibeke)",
      detail: "CES live i production — systematisk intern test av /no/chat/ før bredere deling.",
    },
    {
      id: "ai-usage-monitoring",
      label: "AI usage monitoring v0.1",
      detail: "Hybrid v0.1 implementert — Upstash drift + PostHog EU. Intern test og verifisering før ekstern deling.",
    },
    {
      id: "backstage-v01",
      label: "Backstage v0.1 — live",
      detail: "Intern systemreferanse på /backstage/ — AI-flow, guards, env-vars og production checklist (#184).",
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
      date: "2026-06-05",
      summary: "Expanded source inventory sample v0.1 — 81 Drive snapshot entries, market/audio/inspiration classification og VIS knowledge-status oppdatert (#232)",
      issue: "#232",
      commit: "—",
    },
    {
      date: "2026-06-05",
      summary: "VIS knowledge status panel v0.1 — source trust og manifest-gate lesbart i VIS (#230)",
      issue: "#230",
      commit: "—",
    },
    {
      date: "2026-05-30",
      summary: "Backstage guardrail — operating rules, Return Ticket-felt, build-time verify (#184)",
      issue: "#184",
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
    status:
      r.id === "sprint-w21"
        ? mvpCurrentState.currentSprint.status === "active"
          ? "Aktiv sprint"
          : "Historikk"
        : "Reference",
    kind: "reference" as const,
  }));

  return [...surfaceEntries, ...refEntries];
}

/** Active sprint for VIS control room — derived from registry. */
export function getCurrentSprintVisEntry(baseUrl: string) {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const sprint = mvpCurrentState.currentSprint;
  return {
    id: sprint.id,
    title: `Sprint ${sprint.label}`,
    href: `${base}${sprint.route.replace(/^\//, "")}`,
    status: sprint.status === "active" ? "Aktiv sprint" : "Historikk",
    weekFocus: sprint.weekFocus,
    issue: sprint.issue,
    isActive: sprint.status === "active",
  };
}
