export type ConversationMessage = {
  role: "user" | "assistant";
  text: string;
};

export type ConversationPrototype = {
  id: string;
  title: string;
  updatedAt: string;
  excerpt?: string;
  articleOrigin?: string;
  messages: ConversationMessage[];
};

export type ConversationListItem = ConversationPrototype & {
  dayKey: string;
  dayLabel: string;
  timeLabel: string;
  showDay: boolean;
};

export type ConversationDayGroup = {
  dayKey: string;
  dayLabel: string;
  items: ConversationListItem[];
};

export const conversationPrototypeNow = "2026-07-31T12:00:00+02:00";

export const conversationPrototypeData: ConversationPrototype[] = [
  {
    id: "hearing-test",
    title: "Hva skjer på hørselstesten?",
    updatedAt: "2026-07-31T10:42:00+02:00",
    excerpt: "Jeg er usikker på hva som skjer under undersøkelsen.",
    messages: [
      { role: "assistant", text: "Hva lurer du på før hørselstesten?" },
      { role: "user", text: "Jeg er usikker på hva som skjer under undersøkelsen." },
      {
        role: "assistant",
        text: "Du får vanligvis først noen spørsmål om hørselen din. Deretter måles hvordan du hører ulike toner og tale.",
      },
    ],
  },
  {
    id: "family",
    title: "Hvordan snakke med familien om at jeg strever med å høre",
    updatedAt: "2026-07-31T09:55:00+02:00",
    excerpt: "Jeg vil forklare det uten at samtalen blir for alvorlig.",
    messages: [
      { role: "user", text: "Jeg vil forklare det uten at samtalen blir for alvorlig." },
      {
        role: "assistant",
        text: "Det kan hjelpe å beskrive konkrete situasjoner og si tydelig hva familien kan gjøre når dere snakker sammen.",
      },
    ],
  },
  {
    id: "sharp-sound",
    title: "Lyden blir skarp av bestikk og tallerkener",
    updatedAt: "2026-07-31T08:15:00+02:00",
    excerpt: "Hvorfor blir bestikk og tallerkener så høye?",
    articleOrigin: "Lydømfintlighet",
    messages: [
      { role: "user", text: "Hvorfor blir bestikk og tallerkener så høye?" },
      {
        role: "assistant",
        text: "Skarpe, plutselige lyder kan oppleves sterkere når hørselen er sliten eller lydnivået i høreapparatet ikke passer situasjonen.",
      },
    ],
  },
  {
    id: "audiologist",
    title: "Hva bør jeg ta opp med audiografen?",
    updatedAt: "2026-07-31T07:30:00+02:00",
    excerpt: "Jeg vil ikke glemme noe viktig på timen.",
    articleOrigin: "Før timen",
    messages: [
      { role: "user", text: "Jeg vil ikke glemme noe viktig på timen." },
      {
        role: "assistant",
        text: "Skriv gjerne ned situasjoner der du hører godt, og situasjoner der lyden blir vanskelig. Det gir audiografen et konkret utgangspunkt.",
      },
    ],
  },
  {
    id: "tinnitus",
    title: "Jeg hører en lyd som andre ikke hører",
    updatedAt: "2026-07-28T16:20:00+02:00",
    excerpt: "Det er en høy tone som særlig merkes om kvelden.",
    articleOrigin: "Hva er tinnitus?",
    messages: [
      { role: "user", text: "Det er en høy tone som særlig merkes om kvelden." },
      {
        role: "assistant",
        text: "En lyd som ikke kommer utenfra kan være tinnitus. Legg merke til når lyden er mest plagsom, og kontakt helsepersonell hvis den er ny eller bekymrer deg.",
      },
    ],
  },
  {
    id: "work",
    title: "Hvordan sier jeg fra på jobb?",
    updatedAt: "2026-07-24T09:05:00+02:00",
    excerpt: "Møter er vanskelige når flere snakker samtidig.",
    messages: [
      { role: "user", text: "Møter er vanskelige når flere snakker samtidig." },
      {
        role: "assistant",
        text: "Du kan be om én taler om gangen, en tydelig møteagenda og en plass der du ser ansiktene til dem som snakker.",
      },
    ],
  },
  {
    id: "devices",
    title: "De nye apparatene høres rare ut",
    updatedAt: "2026-07-18T13:30:00+02:00",
    excerpt: "Musikk låter mye flatere enn før.",
    articleOrigin: "Den første tiden med nye høreapparater og hva du kan forvente",
    messages: [
      { role: "user", text: "Musikk låter mye flatere enn før." },
      {
        role: "assistant",
        text: "Nye innstillinger kan trenge tilvenning, men musikk bør fortsatt oppleves naturlig. Noter hva som låter annerledes og ta det med til audiografen.",
      },
    ],
  },
];

const dateKey = (iso: string) => iso.slice(0, 10);

const utcDayNumber = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86_400_000;
};

const formatDayLabel = (key: string, nowKey: string) => {
  const difference = utcDayNumber(nowKey) - utcDayNumber(key);
  if (difference === 0) return "I dag";
  if (difference === 1) return "I går";

  const date = new Date(`${key}T12:00:00+02:00`);
  if (difference > 1 && difference < 7) {
    const weekday = new Intl.DateTimeFormat("nb-NO", { weekday: "long" }).format(date);
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  }

  const nowYear = Number(nowKey.slice(0, 4));
  const dateYear = Number(key.slice(0, 4));
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    ...(dateYear === nowYear ? {} : { year: "numeric" }),
  }).format(date);
};

const formatTimeLabel = (iso: string) =>
  new Intl.DateTimeFormat("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Oslo",
  }).format(new Date(iso));

export function groupPrototypeConversations(
  conversations: ConversationPrototype[],
  now = conversationPrototypeNow,
): ConversationDayGroup[] {
  const nowKey = dateKey(now);
  const groups = new Map<string, ConversationPrototype[]>();

  [...conversations]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .forEach((conversation) => {
      const key = dateKey(conversation.updatedAt);
      const group = groups.get(key) ?? [];
      group.push(conversation);
      groups.set(key, group);
    });

  return [...groups.entries()].map(([key, items]) => {
    const dayLabel = formatDayLabel(key, nowKey);
    return {
      dayKey: key,
      dayLabel,
      items: items.map((conversation, index) => ({
        ...conversation,
        dayKey: key,
        dayLabel,
        timeLabel: formatTimeLabel(conversation.updatedAt),
        showDay: index === 0,
      })),
    };
  });
}
