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
      status: "Landet teknisk (#194/#195). Reliability hardening v0.1 pågår — ekstern pilot venter på stabil chat.",
      possibleSolution: "Drift via Upstash + script-basert driftcheck. PostHog EU aktiveres senere.",
      nextDecision: "Merge reliability hardening. Ekstern pilot når chat >80% success over script-serie.",
      issue: "#188",
      issueLink: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
      progressSteps: [
        { id: "implement", label: "Monitoring levert", state: "done" },
        { id: "reliability", label: "Reliability hardening", state: "current" },
        { id: "pilot", label: "Ekstern pilot", state: "upcoming" },
      ],
    },
  ],
  recentlyCompletedSummary:
    "VIS Tree Navigation v0.1 (#192), IA Inventory v0.3.1 (#191) og Backstage v0.1 i production.",
  lastReturnTicketSummary:
    "Chat reliability hardening v0.1: server-side retry, CES timeout, safe metadata logging. Ekstern pilot venter.",
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
