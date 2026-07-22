/* CONTRACT: Synthetic, non-persistent data for #283 concept prototype only. */

export const conceptPersona = {
  name: "Kari",
  age: 67,
  device: "Phonak Audéo Lumity",
  phone: "iPhone",
  phase: "Etablert bruker",
  usage: "Bruker apparatene hver dag",
  preference: "Vil ha korte steg, ett om gangen",
};

export const conceptHistory = [
  {
    date: "I dag",
    title: "Svak lyd i høyre apparat",
    status: "Trenger oppfølging",
    detail: "Startet etter lading. Filter er kontrollert, men lyden er fortsatt svak.",
  },
  {
    date: "8. juli",
    title: "Ustabil Bluetooth på telefon",
    status: "Løst",
    detail: "Startet telefon og apparater på nytt. Tilkoblingen har vært stabil siden.",
  },
  {
    date: "24. juni",
    title: "Vanskelig å høre i familieselskap",
    status: "Prøver tiltak",
    detail: "Sitter nærmere den som snakker og bruker eget restaurantprogram.",
  },
];

export const conceptSummaryItems = [
  "Lyden er svakere i høyre apparat enn i venstre.",
  "Apparatet er slått av og på og har vært ladet.",
  "Filter og lydutgang er kontrollert.",
  "Problemet vedvarer og brukeren ønsker råd om neste steg.",
];

export const conceptInsights = [
  {
    value: "38 %",
    label: "trenger mest hjelp med lyd og teknisk feilsøking",
    note: "Eksempel basert på 120 syntetiske hjelpesituasjoner",
  },
  {
    value: "27 %",
    label: "står fortsatt fast etter de første egenhjelpsstegene",
    note: "Eksempel basert på syntetisk «hjalp / hjalp ikke»-state",
  },
  {
    value: "1.",
    label: "foreslått lokallagstema: praktisk hjelp med apparat og app",
    note: "Eksempel på hvordan behov kan bli til aktivitet",
  },
];

export const conceptTopics = [
  { label: "Svak eller manglende lyd", value: 38 },
  { label: "Bluetooth og app", value: 24 },
  { label: "Samtaler i støy", value: 21 },
  { label: "Tilvenning og bruk", value: 17 },
];
