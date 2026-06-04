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
  updatedAt: "2026-06-02",
  activeNow: [
    {
      id: "ai-usage-monitoring-v01",
      headline:
        "Vi forenkler reliability-test ved å styre public guard-grenser fra Vercel.",
      workTitle: "AI usage monitoring v0.1 (#188)",
      area: "Data, monitoring og innsikt",
      why:
        "Vi må se om chatten virker, om den feiler, og hvilke innganger som brukes — uten å lagre spørsmål eller svar.",
      status:
        "Monitoring og guard v0.2 er levert. Nå kan Thomas midlertidig heve burst/daily limits i Vercel (100/500) og kjøre reliability-test uten lokal token.",
      possibleSolution:
        "VIDDEL_CHAT_BURST_LIMIT og VIDDEL_CHAT_DAILY_LIMIT i Vercel — public guard forblir aktiv.",
      nextDecision:
        "Thomas setter høyere limits, redeployer, Cursor kjører reliability-test. Vurder CES — deretter fallback-spike ved behov.",
      issue: "#188",
      issueLink: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
      progressSteps: [
        { id: "monitoring", label: "Monitoring levert", state: "done" },
        { id: "guard-env", label: "Guard limits via Vercel", state: "current" },
        { id: "ces-test", label: "Ren CES-test", state: "upcoming" },
        { id: "fallback", label: "Fallback ved behov", state: "upcoming" },
      ],
    },
  ],
  recentlyCompletedSummary:
    "Guard strategy v0.2 (#199) merged. INT-007 Anne-spor registrert i gitbuss (#200–#204).",
  lastReturnTicketSummary:
    "Guard limits via Vercel env v0.1 — reliability-test uten lokal ops-token.",
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
