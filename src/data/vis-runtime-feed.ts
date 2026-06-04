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
  updatedAt: "2026-06-04",
  activeNow: [
    {
      id: "ai-usage-monitoring-v01",
      headline:
        "Vi tester om Googles dokumenterte Agent Search API er mer stabilt enn channel-laget vi først brukte.",
      workTitle: "AI usage monitoring v0.1 (#188)",
      area: "Data, monitoring og innsikt",
      why:
        "Vi må se om chatten virker, om den feiler, og hvilke innganger som brukes — uten å lagre spørsmål eller svar.",
      status:
        "To reliability-serier (16 kall, guard 100/500): 25% success, 0 rate_limit, 75% upstream. Guard og testoppsett OK — CES er flaskehalsen.",
      possibleSolution:
        "Google Agent Search direct API spike (#198): assessment + trygg probe, før evt. ekstern fallback.",
      nextDecision:
        "Kjør agent-search:probe lokalt med SA. Hvis stabil → optional VIDDEL_AI_BACKEND. Guard 100/500 til beslutning.",
      issue: "#188",
      issueLink: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
      progressSteps: [
        { id: "monitoring", label: "Monitoring levert", state: "done" },
        { id: "guard-env", label: "Guard limits via Vercel", state: "done" },
        { id: "ces-test", label: "Ren CES-test (2 serier)", state: "done" },
        { id: "agent-search", label: "Agent Search direct #198", state: "current" },
      ],
    },
  ],
  recentlyCompletedSummary:
    "Guard limits via Vercel (#212) og to rene CES-serier — 25% success, upstream dominant.",
  lastReturnTicketSummary:
    "Kontrollserie 25% — #198 er Google Agent Search direct API spike (ikke ekstern fallback ennå). Ingen flere channel-serier.",
  links: {
    primary: [
      {
        label: "Issue #188",
        href: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
        kind: "issue",
      },
      {
        label: "PR #199",
        href: "https://github.com/THUNDERPLUNDER/vox-web/pull/199",
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
