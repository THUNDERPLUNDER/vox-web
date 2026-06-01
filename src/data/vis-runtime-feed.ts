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
      id: "vis-tree-navigation-v01",
      headline:
        "Vi bygger en enkel venstremeny på interne VIS-flater, så det er lettere å se hvor man er og hva siden er til for.",
      workTitle: "#192 VIS Tree Navigation v0.1",
      area: "VIS IA og intern navigasjon",
      why:
        "Thomas og Vibeke trenger orientering uten ny backlog-UI — felles tremeny, page contract og rolig sidebar.",
      status: "v0.1 implementert. QA på desktop og mobil (~390px) gjenstår.",
      possibleSolution:
        "Felles datakilde (vis-navigation-v01), VisInternalLayout, sidebar på nøkkelsider.",
      nextDecision: "Godkjenn tremeny og page contract som daglig mønster på flere VIS-flater.",
      issue: "#192",
      issueLink: "https://github.com/THUNDERPLUNDER/vox-web/issues/192",
      progressSteps: [
        { id: "data", label: "Felles datakilde", state: "done" },
        { id: "sidebar", label: "Sidebar + layout", state: "done" },
        { id: "qa", label: "QA og utrulling", state: "current" },
      ],
    },
  ],
  recentlyCompletedSummary:
    "VIS IA Inventory v0.3.1 (#191), Backstage v0.1 og VIS frontpage v0.1 i production.",
  lastReturnTicketSummary: "#192 v0.1 — tremeny, page contract og layout på nøkkelsider.",
  links: {
    primary: [
      {
        label: "Issue #192",
        href: "https://github.com/THUNDERPLUNDER/vox-web/issues/192",
        kind: "issue",
      },
    ],
    secondary: [
      {
        label: "IA inventory (referanse)",
        href: "/vis/system/ia-inventory-v01/",
        kind: "page",
      },
      {
        label: "Issue #188 (parkert)",
        href: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
        kind: "issue",
      },
    ],
  },
} satisfies VisRuntimeFeed;

export function getVisRuntimeFeed(): VisRuntimeFeed {
  return visRuntimeFeed;
}
