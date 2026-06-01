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
        "Vi legger inn smal og trygg overvåkning av AI-chatten — driftstall og få produkt-events — før vi deler den med flere.",
      workTitle: "#188 AI usage monitoring v0.1",
      area: "Data, monitoring og trygg intern test",
      why:
        "Thomas og Vibeke trenger å se om chatten virker og om den misbrukes — uten å lagre spørsmål eller svar.",
      status: "Hybrid v0.1 implementert. Intern test og verifisering gjenstår.",
      possibleSolution:
        "Upstash/Vercel for drift, PostHog EU for få anonyme produkt-events.",
      nextDecision: "Godkjenn tall og mønstre etter intern test — deretter vurdere ekstern deling.",
      issue: "#188",
      issueLink: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
      progressSteps: [
        { id: "drift", label: "Driftssignaler", state: "done" },
        { id: "posthog", label: "PostHog EU", state: "done" },
        { id: "verify", label: "Intern test", state: "current" },
      ],
    },
  ],
  recentlyCompletedSummary:
    "VIS Tree Navigation v0.1 (#192), IA Inventory v0.3.1 (#191) og Backstage v0.1 i production.",
  lastReturnTicketSummary: "#188 Hybrid v0.1 — drift + PostHog implementert.",
  links: {
    primary: [
      {
        label: "Issue #188",
        href: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
        kind: "issue",
      },
      {
        label: "Backstage monitoring",
        href: "/backstage/",
        kind: "page",
      },
    ],
    secondary: [
      {
        label: "Spør Viddel (test)",
        href: "/no/chat/",
        kind: "page",
      },
    ],
  },
} satisfies VisRuntimeFeed;

export function getVisRuntimeFeed(): VisRuntimeFeed {
  return visRuntimeFeed;
}
