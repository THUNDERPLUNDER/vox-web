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
  updatedAt: "2026-05-29",
  activeNow: [
    {
      id: "ai-usage-monitoring-v01",
      headline:
        "Vi skiller brukerbeskyttelse fra intern stabilitetstest av AI-chatten.",
      workTitle: "AI usage monitoring v0.1 (#188)",
      area: "Data, monitoring og innsikt",
      why:
        "Vi må se om chatten virker, om den feiler, og hvilke innganger som brukes — uten å lagre spørsmål eller svar.",
      status:
        "Monitoring er levert. Nå justerer vi guard-strategien slik at Cursor kan teste CES-stabilitet uten å bli stoppet av vanlig public rate limit.",
      possibleSolution:
        "Public guard står fast. Ops-test får hemmelig server-token for måling.",
      nextDecision:
        "Kjør ren ops-test. Hvis CES fortsatt er ustabil, start fallback-spike.",
      issue: "#188",
      issueLink: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
      progressSteps: [
        { id: "monitoring", label: "Monitoring levert", state: "done" },
        { id: "guard-v02", label: "Guard strategy v0.2", state: "current" },
        { id: "ces-test", label: "Ren CES-test", state: "upcoming" },
        { id: "fallback", label: "Fallback ved behov", state: "upcoming" },
      ],
    },
  ],
  recentlyCompletedSummary:
    "VIS Tree Navigation v0.1 (#192), IA Inventory v0.3.1 (#191) og Backstage v0.1 i production.",
  lastReturnTicketSummary:
    "VIS-språk oppdatert: vi feilsøker chat-stabilitet og skiller public guard fra intern ops-test (#199).",
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
