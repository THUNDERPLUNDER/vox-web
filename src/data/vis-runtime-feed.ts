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
  updatedAt: "2026-05-31",
  activeNow: [
    {
      id: "ai-usage-monitoring-v01",
      headline:
        "Vi vurderer hvordan Viddel skal måle bruk av AI-chatten før vi deler den med flere.",
      workTitle: "#188 AI usage monitoring v0.1",
      area: "Data, monitoring og innsikt",
      why:
        "Vi trenger å se om chatten virker, om den feiler, og hvilke innganger som faktisk blir brukt — uten å lagre spørsmål eller svar.",
      status: "Vurdering ferdig. Neste steg er å velge løsning.",
      possibleSolution:
        "Smal hybrid: teknisk drift i Vercel, Upstash og CES + få trygge produkt-events i PostHog EU.",
      nextDecision:
        "Skal vi godkjenne hybrid-retningen, eller starte enklere med bare driftstellerne?",
      issue: "#188",
      issueLink: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
      progressSteps: [
        { id: "assessment", label: "Vurdering ferdig", state: "done" },
        { id: "decision", label: "Beslutning", state: "current" },
        { id: "implementation", label: "Implementasjon", state: "upcoming" },
      ],
    },
  ],
  recentlyCompletedSummary:
    "Backstage v0.1, VIS frontpage v0.1 og Spør Viddel live i production.",
  lastReturnTicketSummary: "#188 assessment er levert. Ingen kode endret ennå.",
  links: {
    primary: [
      {
        label: "Issue #188",
        href: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
        kind: "issue",
      },
    ],
    secondary: [
      {
        label: "Assessment-kommentar",
        href: "https://github.com/THUNDERPLUNDER/vox-web/issues/188#issuecomment-4585993994",
        kind: "issue",
      },
    ],
  },
} satisfies VisRuntimeFeed;

export function getVisRuntimeFeed(): VisRuntimeFeed {
  return visRuntimeFeed;
}
