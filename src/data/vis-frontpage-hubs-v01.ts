/* CONTRACT: VIS frontpage hub definitions v0.1 — mandate, links and active/planned status for /vis/ IA. */

export type VisHubAvailability = "active" | "planned" | "historikk";

export type VisFrontpageHub = {
  id: string;
  title: string;
  mandate: string;
  href?: string;
  availability: VisHubAvailability;
  statusLabel: string;
  issue?: string;
};

/** Main hubs on VIS frontpage — hub & spoke model, not backlog. */
export function getVisFrontpageHubs(baseUrl: string): VisFrontpageHub[] {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  return [
    {
      id: "designsystem",
      title: "Designsystem",
      mandate: "Gjeldende UI-mønstre, komponenter og applied surfaces.",
      href: `${base}designsystem/`,
      availability: "active",
      statusLabel: "Applied / Canonical",
    },
    {
      id: "backstage",
      title: "Backstage",
      mandate: "Hvordan AI, API, guards, env-vars, feilstater og production fungerer.",
      availability: "planned",
      statusLabel: "Planned · Next",
      issue: "#184",
    },
    {
      id: "gitbuss",
      title: "Gitbuss",
      mandate:
        "Operativ oversikt over GitHub issues, arbeidsspor og Return Tickets. GitHub er source of truth for oppgaver — VIS viser inngang og status.",
      href: `${base}vis/system/github-runtime-status`,
      availability: "active",
      statusLabel: "Runtime feed",
    },
    {
      id: "roadmap",
      title: "Roadmap",
      mandate: "Retning og kommende faser for MVP. Viser neste større bevegelse, ikke alle småoppgaver.",
      href: `${base}vis/system/roadmap-timeline-v01`,
      availability: "active",
      statusLabel: "Retning / faser",
    },
    {
      id: "dam",
      title: "DAM / bildebank",
      mandate: "Visuelle assets, bildebruk, prompt-/asset-kilder og hvilke bilder som er aktuelle for MVP.",
      href: `${base}vis/assets/editorial`,
      availability: "active",
      statusLabel: "Editorial library v0.2",
    },
    {
      id: "review",
      title: "Review",
      mandate: "Flater for QA, sammenligning og godkjenning.",
      href: `${base}vis/review/`,
      availability: "active",
      statusLabel: "Review registry",
    },
    {
      id: "sprint",
      title: "Sprint / historikk",
      mandate: "Hvordan vi kom hit. Ikke gjeldende sannhet.",
      href: `${base}vis/sprints/2026-w21/`,
      availability: "historikk",
      statusLabel: "Historikk · W21",
    },
  ] satisfies VisFrontpageHub[];
}

export const visFrontpageMandate = {
  title: "VIS kontrollrom",
  lead: "VIS-forsiden gir rask oversikt over hva som er sant nå, hvilke interne huber som finnes, og hva som er neste arbeid. Den er ikke backlog.",
  bullets: [
    "VIS er intern visnings- og reviewflate",
    "GitHub Projects/issues er oppgavebuss",
    "/designsystem/ er UI/mønster-sannhet",
    "/backstage/ blir system/API/guard-sannhet (#184)",
    "Roadmap viser retning, ikke detaljerte oppgaver",
    "DAM/bildebank viser visuelle assets og kildebruk",
  ],
} as const;

export const visSourceOfTruthNotes = [
  { label: "src/data/mvp-current-state.ts", role: "Gjeldende MVP-status" },
  { label: "/designsystem/", role: "Gjeldende UI/mønstre" },
  { label: "/backstage/", role: "System/API/guard når etablert (#184)" },
  { label: "GitHub issues/projects", role: "Oppgavebuss" },
  { label: "Roadmap", role: "Retning / faser" },
  { label: "DAM / bildebank", role: "Assetoversikt" },
  { label: "Sprint-sider", role: "Historikk" },
] as const;
