/* CONTRACT: VIS Runtime Feed v0.1 — kondensert agent-status for /vis/ (manuelt ved Return Ticket).
   Kommunikasjonsregel: skriv for Thomas/Vibeke — headline uten forkunnskap. Se OPERATING_RULES § B4. */

export type VisRuntimeProgressStep = {
  id: string;
  label: string;
  state: "done" | "current" | "upcoming";
};

export type VisRuntimeActiveWork = {
  id: string;
  /** Første setning — forklarer arbeidet uten kontekst. */
  headline: string;
  workTitle: string;
  area: string;
  why: string;
  status: string;
  possibleSolution: string;
  nextDecision: string;
  issue?: string;
  issueLink?: string;
  progressSteps: VisRuntimeProgressStep[];
};

export type VisRuntimeFeedLink = {
  label: string;
  href: string;
  kind?: "issue" | "page" | "external";
};

export type VisRuntimeFeed = {
  updatedAt: string;
  activeNow: VisRuntimeActiveWork[];
  recentlyCompletedSummary: string;
  lastReturnTicketSummary: string;
  links: {
    primary: VisRuntimeFeedLink[];
    secondary?: VisRuntimeFeedLink[];
  };
};

/** Manually updated after important Return Tickets — not synced from GitHub. */
export const visRuntimeFeed = {
  updatedAt: "2026-06-01",
  activeNow: [
    {
      id: "ai-usage-monitoring-v01",
      headline:
        "Vi legger inn trygg måling av AI-chatten før vi deler Viddel med flere.",
      workTitle: "AI usage monitoring v0.1 (#188)",
      area: "Data, monitoring og innsikt",
      why:
        "Vi må se om chatten virker, om den feiler, og hvilke innganger som brukes — uten å lagre spørsmål eller svar.",
      status: "Implementert i PR #194. Venter privacy/logging QA før merge.",
      possibleSolution: "Drift via Upstash nå. PostHog EU aktiveres senere med egen Vercel-nøkkel.",
      nextDecision: "Merge driftsspor først. PostHog aktiveres senere med egen Vercel-nøkkel.",
      issue: "#188",
      issueLink: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
      progressSteps: [
        { id: "implement", label: "Implementert", state: "done" },
        { id: "qa", label: "Privacy/logging QA", state: "current" },
        { id: "merge", label: "Merge", state: "upcoming" },
      ],
    },
  ],
  recentlyCompletedSummary:
    "VIS Tree Navigation v0.1 (#192), IA Inventory v0.3.1 (#191) og Backstage v0.1 i production.",
  lastReturnTicketSummary:
    "Privacy/logging QA er gjort i kode. Live Vercel logs og Upstash teller må fortsatt verifiseres.",
  links: {
    primary: [
      {
        label: "Issue #188",
        href: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
        kind: "issue",
      },
      {
        label: "PR #194",
        href: "https://github.com/THUNDERPLUNDER/vox-web/pull/194",
        kind: "issue",
      },
    ],
    secondary: [
      {
        label: "Backstage monitoring",
        href: "/backstage/",
        kind: "page",
      },
    ],
  },
} satisfies VisRuntimeFeed;

export function getVisRuntimeFeed(): VisRuntimeFeed {
  return visRuntimeFeed;
}
