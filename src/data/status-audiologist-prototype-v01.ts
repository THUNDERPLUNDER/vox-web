import {
  conversationPrototypeData,
  conversationPrototypeNow,
  type ConversationPrototype,
} from "./conversation-prototype-v01.ts";

export type StatusDraftPoint = {
  id: string;
  text: string;
  sourceConversationIds: string[];
};

export type StatusDraftGroup = {
  title: string;
  points: StatusDraftPoint[];
};

export type StatusPeriodMode = "30-days" | "90-days" | "custom";

export type StatusPeriodRange = {
  from: string;
  to: string;
};

export const statusDraftGroups: StatusDraftGroup[] = [
  {
    title: "Dette har vært vanskelig",
    points: [
      {
        id: "sharp-sounds",
        text: "Bestikk og tallerkener oppleves skarpe og ubehagelige.",
        sourceConversationIds: ["sharp-sound"],
      },
      {
        id: "meetings",
        text: "Møter blir krevende når flere snakker samtidig.",
        sourceConversationIds: ["work"],
      },
      {
        id: "music",
        text: "Musikk låter flatere med de nye høreapparatene.",
        sourceConversationIds: ["devices"],
      },
    ],
  },
  {
    title: "Dette har jeg prøvd",
    points: [
      {
        id: "meeting-position",
        text: "Jeg har forsøkt å sitte nærmere dem som snakker i møter.",
        sourceConversationIds: ["work"],
      },
    ],
  },
  {
    title: "Dette vil jeg ta opp",
    points: [
      {
        id: "settings",
        text: "Om innstillingene kan justeres for musikk og skarpe hverdagslyder.",
        sourceConversationIds: ["devices", "sharp-sound"],
      },
      {
        id: "next-appointment",
        text: "Hva jeg bør følge med på før neste time.",
        sourceConversationIds: ["audiologist"],
      },
    ],
  },
];

const dateKey = (iso: string) => iso.slice(0, 10);

const shiftDateKey = (key: string, days: number) => {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
};

export function getStatusPeriodRange(
  mode: StatusPeriodMode,
  customFrom = "2026-07-01",
  customTo = "2026-07-31",
  now = conversationPrototypeNow,
): StatusPeriodRange {
  if (mode === "custom") return { from: customFrom, to: customTo };
  const to = dateKey(now);
  return { from: shiftDateKey(to, mode === "30-days" ? -29 : -89), to };
}

export function getStatusPointSources(
  point: StatusDraftPoint,
  range: StatusPeriodRange,
  conversations: ConversationPrototype[] = conversationPrototypeData,
) {
  const sourceIds = new Set(point.sourceConversationIds);
  return conversations
    .filter((conversation) => sourceIds.has(conversation.id))
    .filter((conversation) => {
      const key = dateKey(conversation.updatedAt);
      return key >= range.from && key <= range.to;
    })
    .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
}

const formatSourceDate = (iso: string) =>
  new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Oslo",
  }).format(new Date(iso));

export function formatStatusPointSource(sources: ConversationPrototype[]) {
  if (sources.length === 1) {
    return `Fra «${sources[0].title}» · ${formatSourceDate(sources[0].updatedAt)}`;
  }
  const dates = sources.map((source) => formatSourceDate(source.updatedAt));
  const dateList = dates.length === 2 ? dates.join(" og ") : `${dates.slice(0, -1).join(", ")} og ${dates.at(-1)}`;
  return `Fra ${sources.length === 2 ? "to" : sources.length} samtaler · ${dateList}`;
}

export function countStatusPointsInRange(
  range: StatusPeriodRange,
  groups: StatusDraftGroup[] = statusDraftGroups,
  conversations: ConversationPrototype[] = conversationPrototypeData,
) {
  return groups.flatMap((group) => group.points).filter((point) => getStatusPointSources(point, range, conversations).length)
    .length;
}
