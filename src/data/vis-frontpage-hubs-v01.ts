/* CONTRACT: VIS frontpage hub definitions v0.1 — mandate, links and active/planned status for /vis/ IA. */

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

/** Main hubs on VIS frontpage — hub & spoke model, not backlog. */
export function getVisFrontpageHubs(baseUrl: string): VisFrontpageHub[] {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  return [
    {
      id: "designsystem",
      title: "Designsystem",
      mandate: "UI-mønstre, komponenter og applied surfaces.",
      href: `${base}designsystem/`,
      availability: "active",
      tier: "primary",
    },
    {
      id: "backstage",
      title: "Backstage",
      mandate: "AI, API, guards, env-vars og production.",
      availability: "planned",
      tier: "primary",
      issue: "#184",
    },
    {
      id: "gitbuss",
      title: "Gitbuss",
      mandate: "GitHub issues, arbeidsspor og Return Tickets.",
      href: `${base}vis/system/github-runtime-status`,
      availability: "active",
      tier: "primary",
    },
    {
      id: "roadmap",
      title: "Roadmap",
      mandate: "Retning og kommende faser — ikke alle småoppgaver.",
      href: `${base}vis/system/roadmap-timeline-v01`,
      availability: "active",
      tier: "primary",
    },
    {
      id: "dam",
      title: "DAM / bildebank",
      mandate: "Visuelle assets og bildebruk for MVP.",
      href: `${base}vis/assets/editorial`,
      availability: "active",
      tier: "secondary",
    },
    {
      id: "review",
      title: "Review",
      mandate: "QA, sammenligning og godkjenning.",
      href: `${base}vis/review/`,
      availability: "active",
      tier: "secondary",
    },
    {
      id: "sprint",
      title: "Sprint / historikk",
      mandate: "Hvordan vi kom hit — ikke gjeldende sannhet.",
      href: `${base}vis/sprints/2026-w21/`,
      availability: "historikk",
      tier: "secondary",
    },
  ] satisfies VisFrontpageHub[];
}

export const visFrontpageMandate = {
  title: "VIS kontrollrom",
  lead: "Rask oversikt over hva som er sant nå, neste steg og hvor du går videre. Ikke backlog.",
} as const;

export const visPrimaryNextWorkIds = [
  "internal-ai-test-qa",
  "ai-usage-monitoring",
  "backstage-v01",
] as const;

export const visSourceOfTruthNotes = [
  { label: "src/data/mvp-current-state.ts", role: "Gjeldende MVP-status" },
  { label: "/designsystem/", role: "Gjeldende UI/mønstre" },
  { label: "/backstage/", role: "System/API/guard når etablert (#184)" },
  { label: "GitHub issues/projects", role: "Oppgavebuss" },
  { label: "Roadmap", role: "Retning / faser" },
  { label: "DAM / bildebank", role: "Assetoversikt" },
  { label: "Sprint-sider", role: "Historikk" },
] as const;
