/* CONTRACT: VIS review registry (#131C) — data source for /vis/review/.
   Add new review surfaces here with sprint, type, status and stakeholderSafe flag.
   Only stakeholderSafe items render on the public review entry.
 */

export type ReviewItemType = "active" | "reference" | "archive" | "deprecated";

export type ReviewItemStatus =
  | "needs-review"
  | "in-review"
  | "decision-candidate"
  | "closed"
  | "reference";

export type ReviewRegistryItem = {
  id: string;
  title: string;
  /** Path from site root, e.g. /vis/sprints/2026-w21/hub-types/ */
  href: string;
  sprint: string;
  issue: string;
  type: ReviewItemType;
  status: ReviewItemStatus;
  stakeholderSafe: boolean;
  description: string;
};

export const reviewStatusLabels: Record<ReviewItemStatus, string> = {
  "needs-review": "Needs review",
  "in-review": "In review",
  "decision-candidate": "Decision candidate",
  closed: "Closed",
  reference: "Reference",
};

export const reviewRegistry: ReviewRegistryItem[] = [
  {
    id: "sprint-preview-2026-w21",
    title: "Sprint Preview 2026-W21",
    href: "/vis/sprints/2026-w21/",
    sprint: "2026-W21",
    issue: "#126",
    type: "active",
    status: "in-review",
    stakeholderSafe: true,
    description: "Overordnet inngang til MVP Design Lock — typography, color og primitives.",
  },
  {
    id: "hub-type-split",
    title: "Hub type split",
    href: "/vis/sprints/2026-w21/hub-types/",
    sprint: "2026-W21",
    issue: "#125C",
    type: "reference",
    status: "closed",
    stakeholderSafe: true,
    description:
      "Beslutning tatt: Hjelp A3 for utility-hub. Editorial hub kommer senere. VIS-beslutningsflate avsluttet etter #125C-R1.",
  },
  {
    id: "hjelp-a3-production",
    title: "Hjelp A3 production slice",
    href: "/no/hub/",
    sprint: "2026-W21",
    issue: "#125D",
    type: "reference",
    status: "closed",
    stakeholderSafe: true,
    description:
      "Applied Hjelp A3 på /no/hub — QA-godkjent. Videre polish venter til editorial hub og forside er på plass.",
  },
  {
    id: "editorial-hub-prototype",
    title: "Editorial hub prototype",
    href: "/vis/sprints/2026-w21/editorial-hub/",
    sprint: "2026-W21",
    issue: "#125E",
    type: "reference",
    status: "decision-candidate",
    stakeholderSafe: true,
    description:
      "QA-godkjent. E2 situation-first anbefalt som base — applied som #125F på /no/lyd-i-hverdagen/.",
  },
  {
    id: "frontpage-mandate",
    title: "Frontpage mandate",
    href: "/vis/sprints/2026-w21/frontpage-mandate/",
    sprint: "2026-W21",
    issue: "#125G-R2",
    type: "reference",
    status: "decision-candidate",
    stakeholderSafe: true,
    description:
      "Mandat godkjent — avklaringsflate / triage. Applied som #125G-R3 på /no/.",
  },
  {
    id: "nav-top-menu",
    title: "Navigation / top menu",
    href: "/no/",
    sprint: "2026-W21",
    issue: "#125H",
    type: "active",
    status: "needs-review",
    stakeholderSafe: true,
    description:
      "Toppmeny og footer synket til hubmodellen — Forside, Hjelp, Lyd i hverdagen, Ordbok, Om + Start samtale CTA.",
  },
  {
    id: "forside-routing",
    title: "Forside / routing",
    href: "/no/",
    sprint: "2026-W21",
    issue: "#125G",
    type: "reference",
    status: "closed",
    stakeholderSafe: true,
    description:
      "Forside/routing QA-godkjent som avklaringsflate — Hjelp, Lyd i hverdagen og Hørehjelpen fast-track. Neste: nav/toppmeny.",
  },
  {
    id: "lyd-i-hverdagen-production",
    title: "Lyd i hverdagen production slice",
    href: "/no/lyd-i-hverdagen/",
    sprint: "2026-W21",
    issue: "#125F",
    type: "reference",
    status: "closed",
    stakeholderSafe: true,
    description:
      "Editorial production slice QA-godkjent på /no/lyd-i-hverdagen/. Videre polish venter til forside/routing og helhetsjustering.",
  },
  {
    id: "interaction-states",
    title: "Interaction states",
    href: "/vis/sprints/2026-w21/primitives/interaction-states/",
    sprint: "2026-W21",
    issue: "#124D",
    type: "reference",
    status: "decision-candidate",
    stakeholderSafe: true,
    description: "Hover, focus og state-adferd før MVP surface reskin.",
  },
  {
    id: "cards-context",
    title: "Cards context",
    href: "/vis/sprints/2026-w21/primitives/cards/context/",
    sprint: "2026-W21",
    issue: "#129",
    type: "reference",
    status: "decision-candidate",
    stakeholderSafe: true,
    description: "Clickable surfaces og card-roller — hub, editorial, helper, AI bridge.",
  },
  {
    id: "buttons-context",
    title: "Buttons context",
    href: "/vis/sprints/2026-w21/primitives/buttons/context/",
    sprint: "2026-W21",
    issue: "#128",
    type: "reference",
    status: "decision-candidate",
    stakeholderSafe: true,
    description: "Action taxonomy, seed questions og pill-hierarki.",
  },
  {
    id: "typography-lab",
    title: "Typography Lab",
    href: "/vis/sprints/2026-w21/typography/",
    sprint: "2026-W21",
    issue: "#123",
    type: "reference",
    status: "reference",
    stakeholderSafe: true,
    description: "Typografisk retning for MVP — display, sans og editorial presisjon.",
  },
  {
    id: "color-lab",
    title: "Color Lab",
    href: "/vis/sprints/2026-w21/color/",
    sprint: "2026-W21",
    issue: "#122",
    type: "reference",
    status: "reference",
    stakeholderSafe: true,
    description: "Fargetokens og retninger for MVP Design Lock.",
  },
];

/** Items safe to show on /vis/review/ */
export function stakeholderSafeItems(items: ReviewRegistryItem[] = reviewRegistry): ReviewRegistryItem[] {
  return items.filter((item) => item.stakeholderSafe);
}

export function activeBySprint(items: ReviewRegistryItem[]): { sprint: string; items: ReviewRegistryItem[] }[] {
  const active = items.filter((item) => item.type === "active");
  const sprintOrder = [...new Set(active.map((item) => item.sprint))].sort((a, b) => b.localeCompare(a));
  return sprintOrder.map((sprint) => ({
    sprint,
    items: active.filter((item) => item.sprint === sprint),
  }));
}

export function referenceItems(items: ReviewRegistryItem[]): ReviewRegistryItem[] {
  return items.filter((item) => item.type === "reference");
}

export function archivedItems(items: ReviewRegistryItem[]): ReviewRegistryItem[] {
  return items.filter((item) => item.type === "archive" || item.type === "deprecated");
}
