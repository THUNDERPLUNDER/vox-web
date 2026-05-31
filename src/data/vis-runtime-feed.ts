/* CONTRACT: VIS Runtime Feed v0.1 — kondensert agent-status for /vis/ (manuelt ved Return Ticket). */

export type VisRuntimeActiveEntry = {
  id: string;
  title: string;
  area: string;
  status: string;
  goal: string;
  progress: string;
  next: string;
  issue?: string;
  link?: string;
};

export type VisRuntimeFeedEntry = {
  id: string;
  title: string;
  status: string;
  issue?: string;
  link?: string;
};

export type VisRuntimeFeedLink = {
  label: string;
  href: string;
  kind?: "issue" | "page" | "external";
};

export type VisRuntimeFeedDecision = {
  title: string;
  detail: string;
  link?: string;
};

export type VisRuntimeFeed = {
  updatedAt: string;
  statusLine: string;
  lastReturnTicketSummary: string;
  activeNow: VisRuntimeActiveEntry[];
  recentlyCompleted: VisRuntimeFeedEntry[];
  nextDecision: VisRuntimeFeedDecision;
  links: VisRuntimeFeedLink[];
};

/** Manually updated after important Return Tickets — not synced from GitHub. */
export const visRuntimeFeed = {
  updatedAt: "2026-05-31",
  statusLine: "Assessment levert for #188 — venter godkjenning før monitoring-implementasjon.",
  lastReturnTicketSummary:
    "VIS Runtime Feed v0.1 etablert — manuell agent-status på /vis/ før #188 implementasjon.",
  activeNow: [
    {
      id: "ai-usage-monitoring-v01",
      title: "#188 AI usage monitoring v0.1",
      area: "Data / monitoring / innsikt",
      status: "Solution assessment ferdig — Thomas vurderer Hybrid v0.1",
      goal: "Velge trygg monitoring-retning før ekstern deling",
      progress: "Assessment ✓ → Godkjenning → Implementasjon",
      next: "Godkjenne Hybrid v0.1 eller justere scope",
      issue: "#188",
      link: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
    },
  ],
  recentlyCompleted: [
    {
      id: "backstage-v01",
      title: "Backstage v0.1 live",
      status: "Live",
      issue: "#184",
      link: "https://vox.raddum.no/backstage/",
    },
    {
      id: "vis-ia-frontpage-v01",
      title: "VIS IA / frontpage v0.1 live",
      status: "Live",
      issue: "#186",
      link: "https://vox.raddum.no/vis/",
    },
    {
      id: "chat-production-live",
      title: "Spør Viddel live i production",
      status: "Live",
      link: "https://vox.raddum.no/no/chat/",
    },
  ],
  nextDecision: {
    title: "Hybrid v0.1",
    detail: "Upstash/Vercel/CES for drift + PostHog EU for få trygge produkt-events",
    link: "https://github.com/THUNDERPLUNDER/vox-web/issues/188#issuecomment-4585993994",
  },
  links: [
    {
      label: "#188",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
      kind: "issue",
    },
    {
      label: "Assessment",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/188#issuecomment-4585993994",
      kind: "issue",
    },
  ],
} satisfies VisRuntimeFeed;

export function getVisRuntimeFeed(): VisRuntimeFeed {
  return visRuntimeFeed;
}
