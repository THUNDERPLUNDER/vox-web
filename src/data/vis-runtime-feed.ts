/* CONTRACT: VIS Runtime Feed v0.1 — kondensert agent-status for /vis/ (manuelt ved Return Ticket). */

export type VisRuntimeFeedEntry = {
  id: string;
  title: string;
  status: string;
  issue?: string;
  link?: string;
  next?: string;
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
  activeNow: VisRuntimeFeedEntry[];
  recentlyCompleted: VisRuntimeFeedEntry[];
  nextDecision: VisRuntimeFeedDecision;
  links: VisRuntimeFeedLink[];
};

/** Manually updated after important Return Tickets — not synced from GitHub. */
export const visRuntimeFeed = {
  updatedAt: "2026-05-30",
  statusLine: "Backstage og VIS er live. #188 assessment levert — venter godkjenning før monitoring-implementasjon.",
  activeNow: [
    {
      id: "ai-usage-monitoring-v01",
      title: "#188 AI usage monitoring v0.1",
      status: "Solution assessment ferdig — Thomas vurderer Hybrid v0.1",
      issue: "#188",
      link: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
      next: "Godkjenn retning og implementer smal hybrid monitoring",
    },
  ],
  recentlyCompleted: [
    {
      id: "backstage-v01",
      title: "Backstage v0.1 live",
      status: "Merget og production-verifisert",
      issue: "#184",
      link: "https://vox.raddum.no/backstage/",
    },
    {
      id: "vis-ia-frontpage-v01",
      title: "VIS IA / frontpage v0.1 live",
      status: "Kontrollrom med huber og MVP-status fra registry",
      issue: "#186",
      link: "https://vox.raddum.no/vis/",
    },
    {
      id: "chat-production-live",
      title: "Spør Viddel live i production",
      status: "CES aktiv · Upstash guard · intern test",
      link: "https://vox.raddum.no/no/chat/",
    },
  ],
  nextDecision: {
    title: "Godkjenn Hybrid v0.1",
    detail:
      "Upstash/Vercel/CES for drift + PostHog EU for få trygge produkt-events — ingen innholdslogging i v0.1.",
    link: "https://github.com/THUNDERPLUNDER/vox-web/issues/188#issuecomment-4585993994",
  },
  links: [
    {
      label: "Issue #188 — AI usage monitoring",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/188",
      kind: "issue",
    },
    {
      label: "Assessment-kommentar #188",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/188#issuecomment-4585993994",
      kind: "issue",
    },
    {
      label: "Backstage",
      href: "https://vox.raddum.no/backstage/",
      kind: "page",
    },
    {
      label: "Spør Viddel",
      href: "https://vox.raddum.no/no/chat/",
      kind: "page",
    },
  ],
} satisfies VisRuntimeFeed;

export function getVisRuntimeFeed(): VisRuntimeFeed {
  return visRuntimeFeed;
}
