/* CONTRACT: VIS IA Consolidation Readiness v0.3 — funksjonell verdi, migrasjon og Thomas QA. */

import type { VisIaTopTask } from "./vis-ia-inventory-v01.ts";

export type VisIaFunctionalValue =
  | "god oversikt"
  | "nyttig preview"
  | "runtime-status"
  | "lenker"
  | "QA-funksjon"
  | "historisk beslutningsgrunnlag"
  | "bilde-/assetstruktur"
  | "systemforklaring"
  | "teknisk runbook"
  | "designmønstre"
  | "beslutningsgrunnlag"
  | "navigasjonshjelp";

export type VisIaOverlapKind = "ingen" | "route-navn" | "reelt behov" | "route og behov";

export type VisIaFuturePlacement =
  | "behold som egen flate"
  | "behold som global flate og vis i VIS-tre"
  | "slå sammen med annen flate"
  | "gjør om til seksjon under annen flate"
  | "flytt til historikk / arkiv"
  | "vurder sletting senere"
  | "trenger Thomas-avklaring";

export type VisIaConsolidationReadiness = {
  /** Kort menneskelig: «Hva er denne siden til for?» */
  mandatePlain: string;
  /** Hva hjelper den oss med i praksis? */
  practicalHelp: string;
  /** Hva gjør vi her? */
  whatToDoHere: string;
  /** Hva skal vi ikke gjøre her? */
  whatNotToDoHere: string;
  functionalValue: VisIaFunctionalValue[];
  overlapKind: VisIaOverlapKind;
  overlapNote: string;
  mergeRisk: string;
  futurePlacement: VisIaFuturePlacement;
  migrationNote?: string;
  needsThomasReview: boolean;
};

export type VisIaDeepDiveArea = {
  id: string;
  letter: string;
  title: string;
  summary: string;
  clarifications: { question: string; answer: string }[];
  preserveWhenMerging: string[];
  doNotMix: string[];
};

export type VisIaMetadataStrategy = {
  approach: "hybrid";
  summary: string;
  perPage: string;
  centralRegistry: string;
  headerRevival: string;
};

export type VisIaClosedDecision = {
  id: string;
  topic: string;
  decision: string;
  rationale: string;
};

/** Avklaringer lukket i Thomas QA — innarbeidet som anbefalinger, ikke åpne spørsmål. */
export const visIaClosedDecisions: VisIaClosedDecision[] = [
  {
    id: "dam-label",
    topic: "DAM / Editorial label",
    decision:
      "Ett område: hovedlabel «Redaksjonelle bilder», sekundær forklaring «DAM / bildebank». Route /vis/assets/editorial uendret.",
    rationale: "Samme flate og innhold — kun navn var forvirrende. Hele Editorial Image Library UI bevares.",
  },
  {
    id: "control-center-rename",
    topic: "Control Center → Agentdrift / runbook",
    decision:
      "Ikke bruk «Control Center» (forveksles med VIS kontrollrom). Behold funksjonalitet under smalere navn «Agentdrift / runbook» under Forstå system. Ikke arkiver — egen agent-/runtime-verdi.",
    rationale: "Dupliserer ikke Backstage fullt ut. Agent-runbook, filpeker og runtime-kontekst må bevares.",
  },
  {
    id: "placeholders",
    topic: "/vis/artikkel og /vis/hub",
    decision:
      "«Vurder sletting senere». Ikke primære trenoder. Nye previewflater bygges med page contract og konkret mandat.",
    rationale: "Tomme placeholders uten funksjonell verdi i dag.",
  },
  {
    id: "hub-registry",
    topic: "Hub-registry / tremeny-data",
    decision:
      "Neste implementasjon (VIS Tree Navigation v0.1) konsoliderer hub-registry og tremeny til én felles datakilde eller tydelig delt kontrakt.",
    rationale: "Unngå parallelle sannheter mellom VIS-frontpage, hub-kort og lokalmeny.",
  },
];

/** Anbefalt neste steg etter merge av denne analysen — ikke implementert i denne PR. */
export const visIaNextImplementation = {
  id: "vis-tree-navigation-v01",
  name: "VIS Tree Navigation v0.1",
  summary:
    "Tremeny, page contract og konsolidert hub/tre-data. Bygges som eget arbeid etter denne analysen er merget.",
  includes: [
    "Trebasert lokalmeny i VIS",
    "Page contract på VIS-sider (VIS-header viser hensikt automatisk)",
    "Én datakilde for hub-kort og tremeny",
    "Label «Arbeidsflater» som navigasjonskategori",
    "«Redaksjonelle bilder» som hovedlabel for assets",
    "«Agentdrift / runbook» under Forstå system",
  ],
  pageContractFields: [
    "title",
    "type",
    "status",
    "purpose",
    "primaryTask",
    "audience",
    "relatedArea",
    "canonicalSource",
    "lastReviewed",
    "ownerRole",
    "nextAction",
  ] as const,
  headerGoals: [
    "Hva er denne siden?",
    "Hva brukes den til?",
    "Er den aktiv, canonical, lab, reference, historical eller legacy?",
  ],
} as const;

export const visIaConsolidationMeta = {
  version: "v0.3.1",
  passName: "VIS IA Consolidation Readiness v0.3.1",
  updatedAt: "2026-05-31",
  treeNavCategoryLabel: "Arbeidsflater",
} as const;

/** Grundig vurdering av seks konfliktområder — Thomas/Vibeke-språk. */
export const visIaDeepDiveAreas: VisIaDeepDiveArea[] = [
  {
    id: "area-a",
    letter: "A",
    title: "VIS kontrollrom / Runtime Feed / Gitbuss",
    summary:
      "Tre flater handler om «hvor er vi?», men med ulikt dybde og formål. De ligner — de løser ikke helt samme behov.",
    clarifications: [
      {
        question: "Hva er forsiden (/vis/) sitt mandat?",
        answer:
          "Gi et raskt, samlet bilde: hva er MVP-status, hva jobber vi med nå, og hvor går du videre. Det er inngangen — ikke detaljarkivet.",
      },
      {
        question: "Hva er Runtime Feed sitt mandat?",
        answer:
          "Kort, menneskelig «Akkurat nå»-stripe: hva skjer, hvorfor, og hva er neste beslutning. Oppdateres manuelt av agent/team — ikke auto-generert fra GitHub.",
      },
      {
        question: "Hva er Gitbuss sitt mandat?",
        answer:
          "Operativ GitHub-oversikt: issues, PR-er og nylig aktivitet. For når du vil se hva som faktisk skjer i repoet — dypere enn forsiden.",
      },
      {
        question: "Hva skal ikke blandes?",
        answer:
          "Ikke la forsiden bli en full GitHub-klone. Ikke la Runtime Feed erstatte Gitbuss. Ikke bruk Gitbuss som «god morgen»-oversikt for Vibeke.",
      },
    ],
    preserveWhenMerging: [
      "Forsiden: hub-kort, MVP-blokk og feed-stripe",
      "Runtime Feed: headline/why/nextDecision og kommunikasjonsregelen",
      "Gitbuss: generert GitHub-feed og lenker til issues/PR",
    ],
    doNotMix: ["Aggregert «nå»", "Manuell kommunikasjon", "GitHub-detalj"],
  },
  {
    id: "area-b",
    letter: "B",
    title: "Backstage / System / Control Center / /vis/system/",
    summary:
      "Backstage er den vi peker til når noen spør «hvordan fungerer systemet?». Resten er støtte, agent-hjelp eller gammel navigasjon.",
    clarifications: [
      {
        question: "Backstage som canonical systemforklaring?",
        answer:
          "Ja. Backstage er den autoritative flate for AI, API, guardrails og arbeidsregler. Den skal ikke flyttes inn i /vis/.",
      },
      {
        question: "Er /vis/system/ overflødig når tremeny kommer?",
        answer:
          "Ja, som primær navigasjon. Flat link-liste dupliserer det tremenyen skal gjøre. Behold midlertidig som fallback — arkiver i menyen.",
      },
      {
        question: "Skal Control Center fjernes som begrep?",
        answer:
          "Ja — bruk «Agentdrift / runbook» i stedet. Plassering under Forstå system, ikke egen toppkategori. Behold funksjonaliteten: siden dupliserer ikke Backstage, den har egen agent-/runtime-verdi.",
      },
    ],
    preserveWhenMerging: [
      "Backstage: hele pedagogiske systemreferansen",
      "Agentdrift / runbook: filpeker og agent-instruksjoner",
      "IA-prinsipper og Hub Mandate: canonical dokumentasjon",
    ],
    doNotMix: ["Systemforklaring for mennesker", "Agent-runbook", "Flat link-liste"],
  },
  {
    id: "area-c",
    letter: "C",
    title: "Roadmap / Sprint / GitHub Projects / Live Board",
    summary:
      "Retning, aktiv uke og daglige oppgaver er tre lag. Live Board er historikk — ikke aktiv flate.",
    clarifications: [
      {
        question: "Hva er retning?",
        answer: "Roadmap-tidslinjen: faser og milepæler over tid. «Hvor er vi på vei?» — ikke «hva gjør vi i dag?».",
      },
      {
        question: "Hva er aktiv uke?",
        answer: "Sprint 2026-W21 og labs: designbeslutninger denne sprinten. Stenger når sprinten stenger.",
      },
      {
        question: "Hva er oppgavebuss?",
        answer: "Gitbuss: issues og PR-er akkurat nå. Operativt — ikke strategisk.",
      },
      {
        question: "Hva er historisk wireframe?",
        answer: "Live Board HTML og gamle sprint-HTML i raw/. Nyttig som begrunnelse — ikke som aktiv plan.",
      },
    ],
    preserveWhenMerging: [
      "Roadmap: tidslinje-visualisering",
      "Sprint: lab-struktur og beslutningsgrunnlag",
      "Gitbuss: runtime GitHub-data",
    ],
    doNotMix: ["Retning", "Aktiv sprint", "Daglige issues", "Historisk wireframe"],
  },
  {
    id: "area-d",
    letter: "D",
    title: "Designsystem / Review / design-system-v01",
    summary:
      "Ett canonical designsystem. Review er QA-inngang. Legacy v01 skal tydelig merkes som utdatert.",
    clarifications: [
      {
        question: "Hva er canonical designsystem?",
        answer: "/designsystem/ — production tokens, komponenter og mønstre. Dette er sannheten for UI.",
      },
      {
        question: "Hva er QA/review?",
        answer: "/vis/review/ — innganger til å godkjenne sprint-labs og sjekke at design er klart. Ikke eget designsystem.",
      },
      {
        question: "Hva er legacy?",
        answer: "/vis/system/design-system-v01 — gammel VIS-versjon. Behold URL, men merk «ikke canonical» og pek til /designsystem/.",
      },
      {
        question: "Hva må ikke forveksles?",
        answer: "Sprint-labs (forslag) vs designsystem (vedtatt). Review vs designsystem. Legacy v01 vs canonical.",
      },
    ],
    preserveWhenMerging: [
      "Designsystem: alle tokens og komponenter",
      "Review: QA-registry og stakeholder-lenker",
      "Sprint-labs: beslutningsgrunnlag til review",
    ],
    doNotMix: ["Canonical design", "QA-inngang", "Legacy referanse", "Aktiv lab"],
  },
  {
    id: "area-e",
    letter: "E",
    title: "Redaksjonelle bilder (DAM / bildebank)",
    summary:
      "Avklart: ett område. Hovedlabel «Redaksjonelle bilder», sekundær «DAM / bildebank». Ikke to flater.",
    clarifications: [
      {
        question: "Ett område eller to?",
        answer:
          "Ett. Avklart label: hoved «Redaksjonelle bilder», sekundær «DAM / bildebank». Route /vis/assets/editorial uendret.",
      },
      {
        question: "Hva er mandatet?",
        answer: "Finne og velge redaksjonelle bilder til artikler og innhold. Støtte Vibeke og redaksjon.",
      },
      {
        question: "Hva må bevares?",
        answer: "Hele Editorial Image Library UI, bildestruktur, metadata og preview. Kun hub- og menylabel oppdateres ved tremeny.",
      },
    ],
    preserveWhenMerging: ["Editorial Image Library UI", "Asset-metadata", "Preview-funksjon"],
    doNotMix: ["Hub-label", "Sideinnhold"],
  },
  {
    id: "area-f",
    letter: "F",
    title: "Raw wireframes / /vis/artikkel / /vis/hub",
    summary:
      "Wireframes er historikk med verdi. Placeholders er tomme og bør ikke finnes i primær navigasjon.",
    clarifications: [
      {
        question: "Hva er historikk?",
        answer: "10+ HTML-filer i public/vis/raw — tidlige forsider, strategi, sprint-arkiv. Bevar som beslutningsgrunnlag.",
      },
      {
        question: "Hva er tom placeholder?",
        answer: "/vis/artikkel og /vis/hub — Astro-sider uten innhold. Ingen funksjonell verdi i dag.",
      },
      {
        question: "Hva kan vurderes slettet senere?",
        answer: "Placeholders og Live Board wireframe (har allerede canonical erstatning).",
      },
      {
        question: "Hva må bevares som beslutningsgrunnlag?",
        answer: "Strategisk IA v5, Sprint 01 Foundation, forside-varianter — merket historical, lenket fra arkiv.",
      },
    ],
    preserveWhenMerging: [
      "Raw HTML-filer og vis:meta i head",
      "Wireframe-viewer (/vis/[slug])",
      "Arkiv-seksjon på forsiden",
    ],
    doNotMix: ["Historisk referanse", "Tom placeholder", "Aktiv sprint-lab", "Production /no/"],
  },
];

export const visIaMetadataStrategy: VisIaMetadataStrategy = {
  approach: "hybrid",
  summary:
    "Canonical metadata i sentral registry; hver side kan overstyre med frontmatter eller eksportert konstant. VIS-header leser registry først, deretter side-local.",
  perPage:
    "VIS-sider under /vis/ og globale interne flater får `export const visPageContract = { … }` eller Astro frontmatter. Gir presis purpose og nextAction per side.",
  centralRegistry:
    "src/data/vis-page-contracts.ts samler alle kontrakter for header, tremeny og IA-inventar. Én kilde for «hva finnes» — sidene eier detaljene.",
  headerRevival:
    "PrototypeLayout (eller ny VisPageShell) leser contract og viser: tittel, purpose, status-badge (aktiv/canonical/lab/historikk), nextAction og lenke til canonicalSource. Samme nytte som gammel wireframe-infobar — ryddigere og konsistent på tvers av Astro-sider.",
};

export const visIaPageContractV03Fields = [
  { field: "title", required: true, description: "Sidetittel i header", example: "Sprint lab — Color" },
  { field: "type", required: true, description: "Flate-type", example: "sprint-lab" },
  { field: "status", required: true, description: "active | canonical | lab | reference | historical | legacy", example: "lab" },
  { field: "purpose", required: true, description: "Én setning: hva siden er til for", example: "Velge fargepalett for MVP Design Lock" },
  { field: "primaryTask", required: true, description: "Primær top task (1–7)", example: "beslutninger-qa" },
  { field: "audience", required: true, description: "Thomas, Vibeke, Cursor, …", example: "Thomas,Vibeke" },
  { field: "relatedArea", required: false, description: "Overlappende flater (ID-er)", example: "designsystem,review" },
  { field: "canonicalSource", required: false, description: "Operativ sannhet hvis lab/legacy", example: "/designsystem/" },
  { field: "lastReviewed", required: true, description: "ISO-dato siste mandatvurdering", example: "2026-05-31" },
  { field: "ownerRole", required: true, description: "Hvem eier innholdet", example: "Thomas" },
  { field: "nextAction", required: false, description: "Hva brukeren bør gjøre etter besøk", example: "Godkjenn i Review eller oppdater designsystem" },
] as const;

export const visIaPageContractV03Example = {
  title: "Sprint lab — Color",
  type: "sprint-lab",
  status: "lab",
  purpose: "Velge fargepalett for MVP Design Lock",
  primaryTask: "beslutninger-qa",
  audience: ["Thomas", "Vibeke"],
  relatedArea: ["designsystem", "review"],
  canonicalSource: "/designsystem/",
  lastReviewed: "2026-05-31",
  ownerRole: "Thomas",
  nextAction: "Godkjenn palett i Review — deretter oppdater tokens i designsystem",
} as const;

type C = VisIaConsolidationReadiness;

const c = (
  partial: Omit<C, "functionalValue" | "overlapKind"> & {
    functionalValue: VisIaFunctionalValue[];
    overlapKind?: VisIaOverlapKind;
  },
): C => ({
  overlapKind: "ingen",
  ...partial,
});

/** Konsolideringsvurdering per flate-ID. */
export const visIaConsolidationById: Record<string, VisIaConsolidationReadiness> = {
  "vis-frontpage": c({
    mandatePlain: "VIS-forsiden er inngangen: «Hvor står vi, og hvor går jeg videre?»",
    practicalHelp: "Du slipper GitHub og filsøk for å forstå status og finne riktig arbeidsflate.",
    whatToDoHere: "Start dagen her. Les feed-stripe og MVP-blokk. Velg hub etter behov.",
    whatNotToDoHere: "Ikke bruk forsiden som full issue-liste eller dyp systemdokumentasjon.",
    functionalValue: ["god oversikt", "runtime-status", "lenker", "navigasjonshjelp"],
    overlapKind: "reelt behov",
    overlapNote: "Overlapper delvis med Gitbuss og Runtime Feed — men forsiden aggregerer, de andre går dypere.",
    mergeRisk: "Hvis vi slår forsiden med Gitbuss mister Vibeke det rolige overblikket. Hub-kort og feed må bevares.",
    futurePlacement: "behold som egen flate",
    needsThomasReview: false,
  }),
  "runtime-feed": c({
    mandatePlain: "Kort «Akkurat nå»-melding i menneskelig språk — hva skjer og hva er neste steg.",
    practicalHelp: "Thomas og Vibeke ser hva team/agent jobber med uten å lese teknisk logg.",
    whatToDoHere: "Les headline, why og nextDecision. Følg lenke til sprint eller beslutning.",
    whatNotToDoHere: "Ikke behandle feed som komplett prosjektstatus eller erstatning for Gitbuss.",
    functionalValue: ["runtime-status", "beslutningsgrunnlag"],
    overlapKind: "reelt behov",
    overlapNote: "Ligner Gitbuss tematisk — men feed er manuell kommunikasjon, Gitbuss er auto GitHub.",
    mergeRisk: "Hvis feed slugges inn i Gitbuss forsvinner menneskelig tone og § B4-kommunikasjonsregelen.",
    futurePlacement: "gjør om til seksjon under annen flate",
    migrationNote: "Forblir innebygd på /vis/. Data i vis-runtime-feed.ts. Ingen route-endring.",
    needsThomasReview: false,
  }),
  gitbuss: c({
    mandatePlain: "Operativ GitHub-oversikt — issues, PR-er og nylig aktivitet.",
    practicalHelp: "Se hva som faktisk skjer i repoet uten å åpne GitHub.",
    whatToDoHere: "Sjekk åpne issues/PR. Prioriter arbeid. Knytt til sprint eller roadmap ved behov.",
    whatNotToDoHere: "Ikke bruk Gitbuss som «god morgen»-forside for Vibeke. Ikke bland med roadmap-retning.",
    functionalValue: ["runtime-status", "god oversikt", "lenker"],
    overlapKind: "reelt behov",
    overlapNote: "Tematisk lik forsiden — men løser dypere operativt behov, ikke aggregert inngang.",
    mergeRisk: "Slå sammen med forsiden → overveldende for ikke-tekniske. Generert feed må beholdes separat.",
    futurePlacement: "behold som egen flate",
    migrationNote: "Under «Operativt» i tremeny. Behold /vis/system/github-runtime-status.",
    needsThomasReview: false,
  }),
  designsystem: c({
    mandatePlain: "Canonical referanse for UI: farger, typografi, komponenter og mønstre.",
    practicalHelp: "Finn riktig design for produksjon — for deg, Vibeke og agenter.",
    whatToDoHere: "Slå opp tokens og komponenter. Bruk som sannhet ved QA og implementasjon.",
    whatNotToDoHere: "Ikke dupliser mønstre i VIS legacy. Ikke forveksle med sprint-labs (forslag).",
    functionalValue: ["designmønstre", "nyttig preview", "systemforklaring"],
    overlapKind: "route-navn",
    overlapNote: "Route-navn overlapper med design-system-v01 — reelt behov er ulikt (canonical vs legacy).",
    mergeRisk: "Ingen sammenslåing med legacy. Alt innhold i /designsystem/ må stå urørt.",
    futurePlacement: "behold som global flate og vis i VIS-tre",
    needsThomasReview: false,
  }),
  backstage: c({
    mandatePlain: "Systemforklaring for AI, API og arbeidsregler — den autoritative interne referansen.",
    practicalHelp: "Forstå hvordan Viddel fungerer uten å grave i repo eller GitHub.",
    whatToDoHere: "Les operating rules. Referer agenter hit. Ta systembeslutninger informert.",
    whatNotToDoHere: "Ikke erstatte med Control Center eller flat /vis/system/-liste.",
    functionalValue: ["systemforklaring", "teknisk runbook", "lenker"],
    overlapKind: "reelt behov",
    overlapNote: "Control Center og /vis/system/ ligner — Backstage er canonical for mennesker og agenter.",
    mergeRisk: "Slå sammen med Control Center → mister pedagogisk struktur Backstage har bygget opp.",
    futurePlacement: "behold som global flate og vis i VIS-tre",
    needsThomasReview: false,
  }),
  roadmap: c({
    mandatePlain: "Se retning og faser over tid — «hvor er vi på vei?»",
    practicalHelp: "Plasser sprint-arbeid i større bilde uten å blande med daglige issues.",
    whatToDoHere: "Forstå faser og milepæler. Bruk som kontekst ved prioritering.",
    whatNotToDoHere: "Ikke bruk roadmap som sprint-backlog eller erstatning for Gitbuss.",
    functionalValue: ["god oversikt", "beslutningsgrunnlag", "historisk beslutningsgrunnlag"],
    overlapKind: "reelt behov",
    overlapNote: "Live Board wireframe løste samme behov — nå erstattet. Sprint er annet lag (aktiv uke).",
    mergeRisk: "Slå sammen med sprint → forvirrer retning vs denne uken. Tidslinje-visualisering må bevares.",
    futurePlacement: "behold som egen flate",
    needsThomasReview: false,
  }),
  "dam-editorial": c({
    mandatePlain:
      "Redaksjonelle bilder — finne og velge bilder til artikler og innhold (sekundær: DAM / bildebank).",
    practicalHelp: "Vibeke og Thomas kan browse bilder uten å lete i mapper eller Storyblok blindt.",
    whatToDoHere: "Velg bilde til innhold. Noter valg til redaksjon/Storyblok.",
    whatNotToDoHere: "Ikke behandle DAM og Editorial som to områder — avklart som én flate.",
    functionalValue: ["bilde-/assetstruktur", "nyttig preview", "lenker"],
    overlapKind: "route-navn",
    overlapNote: "Var kun navne-overlapp — avklart: ett område, to label-nivåer.",
    mergeRisk: "Kun label-endring i hub/meny. Hele Editorial Image Library UI må bevares urørt.",
    futurePlacement: "behold som egen flate",
    migrationNote:
      "Hovedlabel «Redaksjonelle bilder», sekundær «DAM / bildebank». Route uendret. Hub-registry oppdateres i VIS Tree Navigation v0.1.",
    needsThomasReview: false,
  }),
  review: c({
    mandatePlain: "QA-inngang: godkjenne design og sprint-labs før de blir canonical.",
    practicalHelp: "Thomas og Vibeke har ett sted å sjekke «er dette klart?»",
    whatToDoHere: "Gå gjennom review-lenker. Godkjenn eller send tilbake til lab.",
    whatNotToDoHere: "Ikke behandle Review som eget designsystem eller primær hub.",
    functionalValue: ["QA-funksjon", "lenker", "beslutningsgrunnlag"],
    overlapKind: "reelt behov",
    overlapNote: "Knyttet til sprint-labs og designsystem — ulikt mandat (godkjenning vs referanse).",
    mergeRisk: "Flytt under Design i tre — ikke slå sammen innhold. QA-registry må bevares.",
    futurePlacement: "gjør om til seksjon under annen flate",
    migrationNote: "Tremeny: Design → Review. Route og funksjon uendret.",
    needsThomasReview: false,
  }),
  "sprint-2026-w21": c({
    mandatePlain: "Aktiv sprint: designarbeid og beslutninger denne uken (W21).",
    practicalHelp: "Se hva som jobbes med nå og finn riktig lab.",
    whatToDoHere: "Åpne relevant lab. Ta beslutning. Oppdater review/designsystem.",
    whatNotToDoHere: "Ikke forveksle med roadmap (retning) eller gamle sprint-HTML i arkiv.",
    functionalValue: ["god oversikt", "lenker", "beslutningsgrunnlag"],
    overlapKind: "route-navn",
    overlapNote: "Sprint 01 Foundation i raw/ ligner navn — men er lukket historikk.",
    mergeRisk: "Ved sprintskifte: flytt til arkiv, ikke slett labs. Struktur er modell for neste sprint.",
    futurePlacement: "behold som egen flate",
    migrationNote: "Ved ny sprint: opprett ny mappe, flytt W21 til Historikk i tre. Behold URL som arkiv.",
    needsThomasReview: false,
  }),
  "sprint-color": c({
    mandatePlain: "Beslutte fargepalett for MVP Design Lock.",
    practicalHelp: "Se og vurdere fargevalg i kontekst — stakeholder-safe.",
    whatToDoHere: "Sammenlign alternativer. Beslut. Send til Review.",
    whatNotToDoHere: "Ikke behandle som canonical — designsystem er sannhet etter godkjenning.",
    functionalValue: ["nyttig preview", "beslutningsgrunnlag", "QA-funksjon"],
    overlapKind: "ingen",
    overlapNote: "Del av sprint — ingen reelt behovsoverlapp med andre flater.",
    mergeRisk: "Grupper under sprint i tre — ikke slå sammen labs med hverandre.",
    futurePlacement: "gjør om til seksjon under annen flate",
    needsThomasReview: false,
  }),
  "sprint-typography": c({
    mandatePlain: "Vurdere typografi mot production tokens.",
    practicalHelp: "Typografi-pass knyttet til designsystem.",
    whatToDoHere: "Sammenlign med /designsystem/. Beslut. Oppdater tokens ved godkjenning.",
    whatNotToDoHere: "Ikke dupliser token-definisjon her — pek til canonical.",
    functionalValue: ["nyttig preview", "designmønstre", "beslutningsgrunnlag"],
    overlapKind: "ingen",
    overlapNote: "Knyttet til designsystem etter beslutning — ikke overlapp i dag.",
    mergeRisk: "Behold som lab under sprint.",
    futurePlacement: "gjør om til seksjon under annen flate",
    needsThomasReview: false,
  }),
  "sprint-hub-types": c({
    mandatePlain: "Beslutte hub-typer for produkt-IA.",
    practicalHelp: "IA-beslutning visualisert for Thomas og Vibeke.",
    whatToDoHere: "Vurdere hub-typer. Knytt til IA-prinsipper og Review.",
    whatNotToDoHere: "Ikke implementer i /no/ direkte — beslutning først.",
    functionalValue: ["beslutningsgrunnlag", "nyttig preview", "QA-funksjon"],
    overlapKind: "reelt behov",
    overlapNote: "Knyttet til IA-prinsipper og Hub Mandate — samme tema, ulikt format (lab vs doc).",
    mergeRisk: "Lab-visualisering må bevares — ikke slå sammen med ia-principles doc.",
    futurePlacement: "gjør om til seksjon under annen flate",
    needsThomasReview: false,
  }),
  "sprint-editorial-hub": c({
    mandatePlain: "Visualisere redaksjonell hub-struktur.",
    practicalHelp: "Se hvordan redaksjonell IA kan se ut.",
    whatToDoHere: "Vurdere struktur. Diskuter med Vibeke. Oppdater mandat-doc ved beslutning.",
    whatNotToDoHere: "Ikke forveksle med production /no/hub.",
    functionalValue: ["nyttig preview", "beslutningsgrunnlag"],
    overlapKind: "ingen",
    overlapNote: "Ingen reelt overlapp — lab for redaksjonell IA.",
    mergeRisk: "Behold under sprint.",
    futurePlacement: "gjør om til seksjon under annen flate",
    needsThomasReview: false,
  }),
  "sprint-frontpage-mandate": c({
    mandatePlain: "Definere forsidemandat for VIS og produkt.",
    practicalHelp: "Arbeidsflate for IA-beslutninger om forsiden.",
    whatToDoHere: "Les og kommenter mandat. Koble til inventory og IA-prinsipper.",
    whatNotToDoHere: "Ikke erstatte /vis/ eller /no/ — dette er beslutningsgrunnlag.",
    functionalValue: ["beslutningsgrunnlag", "systemforklaring"],
    overlapKind: "reelt behov",
    overlapNote: "Knyttet til IA inventory-arbeid — samme problemområde, ulikt format.",
    mergeRisk: "Behold som lab — verdifullt for pågående IA-arbeid.",
    futurePlacement: "gjør om til seksjon under annen flate",
    needsThomasReview: false,
  }),
  "sprint-primitives": c({
    mandatePlain: "QA primitives (13 + 3 context) før canonical i designsystem.",
    practicalHelp: "Se alle grunnleggende UI-elementer samlet for Design Lock.",
    whatToDoHere: "Gå gjennom hver primitive. Godkjenn i Review. Oppdater designsystem.",
    whatNotToDoHere: "Ikke flat liste i tremeny — grupper under Primitives-node.",
    functionalValue: ["nyttig preview", "designmønstre", "QA-funksjon"],
    overlapKind: "reelt behov",
    overlapNote: "Overlapper designsystem tematisk — lab er forslag, designsystem er vedtatt.",
    mergeRisk: "Mange undersider — grupper i tre. Ikke slå sammen med /designsystem/.",
    futurePlacement: "gjør om til seksjon under annen flate",
    needsThomasReview: false,
  }),
  "control-center": c({
    mandatePlain:
      "Agentdrift / runbook — prosjektkontekst og filpeker for Cursor og agenter (ikke «Control Center»).",
    practicalHelp: "Agenter finner riktig fil og runtime-kontekst raskere.",
    whatToDoHere: "Start agent-oppgave her hvis du trenger filkart og driftsrunbook.",
    whatNotToDoHere:
      "Ikke kalle det Control Center — forveksles med VIS kontrollrom. Ikke erstatte Backstage.",
    functionalValue: ["teknisk runbook", "lenker", "navigasjonshjelp", "runtime-status"],
    overlapKind: "reelt behov",
    overlapNote:
      "Backstage er pedagogisk systemforklaring. Agentdrift / runbook er operativ agent-hjelp — ulikt mandat, begge bevares.",
    mergeRisk:
      "Slå sammen med Backstage → mister agent-spesifikk filkart. Arkivering avvist — egen runtime-verdi.",
    futurePlacement: "gjør om til seksjon under annen flate",
    migrationNote:
      "Tremeny under Forstå system: «Agentdrift / runbook». Route /vis/system/control-center uendret. Display-navn i tre og page contract.",
    needsThomasReview: false,
  }),
  "ia-principles": c({
    mandatePlain: "Need-led IA-prinsipper — grunnmur for produktstruktur.",
    practicalHelp: "Forstå hvorfor IA er bygget slik — uten Notion eller GitHub.",
    whatToDoHere: "Les prinsipper ved IA-beslutninger. Referer i review og labs.",
    whatNotToDoHere: "Ikke erstatte med gammel Strategisk IA v5 wireframe.",
    functionalValue: ["systemforklaring", "beslutningsgrunnlag", "historisk beslutningsgrunnlag"],
    overlapKind: "reelt behov",
    overlapNote: "Strategisk IA v5 i raw/ er forgjenger — canonical er denne siden.",
    mergeRisk: "Dokumentet er canonical — ingen sammenslåing.",
    futurePlacement: "behold som egen flate",
    needsThomasReview: false,
  }),
  "ia-inventory": c({
    mandatePlain: "Kartlegge VIS-flater, mandat og konsolidering før tremeny bygges.",
    practicalHelp: "Thomas QA-er hvilke sider som bør finnes og hva som kan slås sammen.",
    whatToDoHere: "Les deep dives A–F. Godkjenn anbefalinger. Merk det som trenger avklaring.",
    whatNotToDoHere: "Ikke implementer tremeny her — dette er analyseflate.",
    functionalValue: ["beslutningsgrunnlag", "god oversikt", "systemforklaring"],
    overlapKind: "route-navn",
    overlapNote: "Erstatter delvis flat /vis/system/ som navigasjonshjelp — ulikt mandat.",
    mergeRisk: "Meta-dokument — kan skjules i prod-meny etter tremeny.",
    futurePlacement: "gjør om til seksjon under annen flate",
    migrationNote: "Skjul i prod-tre etter godkjenning. Behold URL for IA-arbeid.",
    needsThomasReview: false,
  }),
  "hub-mandate": c({
    mandatePlain: "Canonical mandat for hver hub-type i produktet.",
    practicalHelp: "Forstå hva hver hub skal løse for brukeren.",
    whatToDoHere: "Slå opp ved hub-beslutninger. Koble til sprint-labs.",
    whatNotToDoHere: "Ikke dupliser i sprint-labs permanent — lab skal peke hit.",
    functionalValue: ["systemforklaring", "beslutningsgrunnlag"],
    overlapKind: "ingen",
    overlapNote: "Referanse-doc — lite overlapp.",
    mergeRisk: "Behold som doc under Forstå system.",
    futurePlacement: "behold som egen flate",
    needsThomasReview: false,
  }),
  "design-system-v01-overview": c({
    mandatePlain: "Gammel designreferanse i VIS — ikke lenger canonical.",
    practicalHelp: "Historisk sammenligning hvis noen lurer på «hva var før /designsystem/».",
    whatToDoHere: "Sjekk canonical /designsystem/ i stedet.",
    whatNotToDoHere: "Ikke bruk som aktiv designreferanse.",
    functionalValue: ["historisk beslutningsgrunnlag"],
    overlapKind: "route og behov",
    overlapNote: "Samme behov som designsystem — men legacy. Route og innhold overlapper.",
    mergeRisk: "Redirect til /designsystem/ kan miste historisk diff. Behold URL med tydelig legacy-badge.",
    futurePlacement: "flytt til historikk / arkiv",
    migrationNote: "Page contract: status=legacy, canonicalSource=/designsystem/. Fjern fra primær nav.",
    needsThomasReview: false,
  }),
  "article-system": c({
    mandatePlain: "Oversikt over artikkel-systemet — komponenter og maler for redaksjon.",
    practicalHelp: "Forstå hvordan artikler bygges i produktet.",
    whatToDoHere: "Start her for artikkel-dok. Gå til foundations/components/templates.",
    whatNotToDoHere: "Ikke flat liste — grupper under Artikkel-node i tre.",
    functionalValue: ["systemforklaring", "lenker", "nyttig preview"],
    overlapKind: "route-navn",
    overlapNote: "article/ index overlapper — samme område, bør være én tre-node.",
    mergeRisk: "Slå sammen index med undersider som gruppe — ikke slett undersider.",
    futurePlacement: "slå sammen med annen flate",
    migrationNote: "Tre: Artikkel-system → Foundations, Components, Templates, Changelog.",
    needsThomasReview: false,
  }),
  "article-foundations": c({
    mandatePlain: "Grunnmur for artikkel-systemet.",
    practicalHelp: "Forstå grunnleggende struktur før komponenter.",
    whatToDoHere: "Les foundations før du endrer artikkel-komponenter.",
    whatNotToDoHere: "Ikke dupliser designsystem — pek til canonical.",
    functionalValue: ["systemforklaring"],
    overlapKind: "ingen",
    overlapNote: "Del av artikkel-gruppe.",
    mergeRisk: "Behold som underside — grupper i tre.",
    futurePlacement: "gjør om til seksjon under annen flate",
    needsThomasReview: false,
  }),
  "article-components": c({
    mandatePlain: "Preview av artikkel-komponenter.",
    practicalHelp: "Se komponenter i kontekst.",
    whatToDoHere: "Sjekk komponent før bruk i artikkel.",
    whatNotToDoHere: "Ikke erstatte /designsystem/.",
    functionalValue: ["nyttig preview", "designmønstre"],
    overlapKind: "ingen",
    overlapNote: "Artikkel-spesifikk — ikke overlapp med designsystem.",
    mergeRisk: "Behold preview-funksjon.",
    futurePlacement: "gjør om til seksjon under annen flate",
    needsThomasReview: false,
  }),
  "article-templates": c({
    mandatePlain: "Oppskrifter for artikkel-maler.",
    practicalHelp: "Finn riktig mal for ny artikkel-type.",
    whatToDoHere: "Velg mal. Følg oppskrift.",
    whatNotToDoHere: "Ikke hardkod maler i /no/ uten doc her.",
    functionalValue: ["systemforklaring", "lenker"],
    overlapKind: "ingen",
    overlapNote: "Del av artikkel-gruppe.",
    mergeRisk: "Behold mal-dokumentasjon.",
    futurePlacement: "gjør om til seksjon under annen flate",
    needsThomasReview: false,
  }),
  "article-changelog": c({
    mandatePlain: "Historikk for endringer i artikkel-systemet.",
    practicalHelp: "Finn begrunnelse for tidligere artikkel-endringer.",
    whatToDoHere: "Slå opp ved «hvorfor er det slik?»",
    whatNotToDoHere: "Ikke bruk som aktiv utviklingsflate.",
    functionalValue: ["historisk beslutningsgrunnlag"],
    overlapKind: "ingen",
    overlapNote: "Historikk — lav frekvens.",
    mergeRisk: "Behold som changelog under Artikkel.",
    futurePlacement: "gjør om til seksjon under annen flate",
    needsThomasReview: false,
  }),
  "article-index": c({
    mandatePlain: "Inngang til artikkel-dokumentasjon.",
    practicalHelp: "Navigere til riktig artikkel-doc.",
    whatToDoHere: "Velg underside (foundations, components, …).",
    whatNotToDoHere: "Ikke dupliser system/ flat liste.",
    functionalValue: ["lenker", "navigasjonshjelp"],
    overlapKind: "route-navn",
    overlapNote: "Overlapper article-system oversikt — én tre-node holder.",
    mergeRisk: "Slå sammen navigasjon — behold alle undersider.",
    futurePlacement: "slå sammen med annen flate",
    migrationNote: "article-system + article/index → én «Artikkel-system» node.",
    needsThomasReview: false,
  }),
  "vis-system-index": c({
    mandatePlain: "Gammel flat liste over system-sider — midlertidig navigasjon.",
    practicalHelp: "Fallback til alle /vis/system/-lenker finnes.",
    whatToDoHere: "Bruk til overgang hvis tremeny ikke er klar.",
    whatNotToDoHere: "Ikke bruk som primær navigasjon når tremeny finnes.",
    functionalValue: ["lenker", "navigasjonshjelp"],
    overlapKind: "route og behov",
    overlapNote: "Dupliserer det tremeny skal løse — samme behov (finn system-side).",
    mergeRisk: "Arkiver i meny — lenker kan brytes hvis slettet for tidlig.",
    futurePlacement: "flytt til historikk / arkiv",
    migrationNote: "Behold URL som fallback. Fjern fra hub og primær nav. Redirect ikke nødvendig.",
    needsThomasReview: false,
  }),
  "task-bus-live": c({
    mandatePlain: "Pensjonert oppgavebuss — erstattet av Gitbuss og roadmap.",
    practicalHelp: "Historisk referanse til gammel task-flyt.",
    whatToDoHere: "Bruk Gitbuss og roadmap i stedet.",
    whatNotToDoHere: "Ikke bruk som aktiv verktøyflate.",
    functionalValue: ["historisk beslutningsgrunnlag"],
    overlapKind: "reelt behov",
    overlapNote: "Løste samme behov som Gitbuss — nå erstattet.",
    mergeRisk: "Sletting mister historikk — arkiver med legacy-lenke til Gitbuss.",
    futurePlacement: "flytt til historikk / arkiv",
    migrationNote: "Legacy-badge + canonicalSource=Gitbuss.",
    needsThomasReview: false,
  }),
  "vis-artikkel-placeholder": c({
    mandatePlain: "Tom placeholder — ingen funksjon i dag. Avklart: vurder sletting senere.",
    practicalHelp: "Ingen praktisk verdi.",
    whatToDoHere: "Ikke bruk. Gå til /no/artikkel/ eller sprint-labs.",
    whatNotToDoHere: "Ikke inkluder som primær trenode. Ikke lenke fra hub eller primær nav.",
    functionalValue: [],
    overlapKind: "route-navn",
    overlapNote: "Route ligner production — tom flate uten mandat.",
    mergeRisk: "Sletting krever sjekk av inbound lenker. Ny preview bygges med page contract ved behov.",
    futurePlacement: "vurder sletting senere",
    migrationNote: "Ikke i tremeny. Ved sletting: QA inbound links. Eventuell ny flate krever konkret mandat.",
    needsThomasReview: false,
  }),
  "vis-hub-placeholder": c({
    mandatePlain: "Tom placeholder — ingen funksjon i dag. Avklart: vurder sletting senere.",
    practicalHelp: "Ingen praktisk verdi.",
    whatToDoHere: "Ikke bruk. Gå til /no/hub/ eller sprint-labs.",
    whatNotToDoHere: "Ikke inkluder som primær trenode. Ikke lenke fra hub eller primær nav.",
    functionalValue: [],
    overlapKind: "route-navn",
    overlapNote: "Route ligner production — tom flate uten mandat.",
    mergeRisk: "Sletting krever sjekk av inbound lenker. Ny preview bygges med page contract ved behov.",
    futurePlacement: "vurder sletting senere",
    migrationNote: "Ikke i tremeny. Ved sletting: QA inbound links.",
    needsThomasReview: false,
  }),
  "raw-wireframes": c({
    mandatePlain: "Samling eldre HTML-wireframes — historisk referanse.",
    practicalHelp: "Finn tidlig design eller strategi når du trenger begrunnelse.",
    whatToDoHere: "Bruk arkiv på /vis/ eller direkte slug. Sammenlign med canonical.",
    whatNotToDoHere: "Ikke bruk som gjeldende produkt eller aktiv beslutningsflate.",
    functionalValue: ["historisk beslutningsgrunnlag", "nyttig preview"],
    overlapKind: "reelt behov",
    overlapNote: "Sprint-labs er aktiv beslutning — wireframes er historikk. Ikke samme behov.",
    mergeRisk: "Slå sammen med sprint-labs → forveksling. Wireframe-viewer og vis:meta må bevares.",
    futurePlacement: "flytt til historikk / arkiv",
    migrationNote: "Kun Historikk i tre. Page contract status=historical på alle.",
    needsThomasReview: false,
  }),
  "raw-klarlyd-forside-a": c({
    mandatePlain: "Tidlig forside-variant A — historikk.",
    practicalHelp: "Se hvordan forsiden så ut tidlig.",
    whatToDoHere: "Sammenlign med /no/.",
    whatNotToDoHere: "Ikke implementer fra denne filen.",
    functionalValue: ["historisk beslutningsgrunnlag", "nyttig preview"],
    overlapKind: "reelt behov",
    overlapNote: "Production er /no/ — wireframe er historikk.",
    mergeRisk: "Behold HTML og viewer.",
    futurePlacement: "flytt til historikk / arkiv",
    needsThomasReview: false,
  }),
  "raw-klarlyd-forside-b": c({
    mandatePlain: "AI-first forsidespike — historikk.",
    practicalHelp: "Begrunnelse for AI-first retning tidlig i prosjektet.",
    whatToDoHere: "Les som historikk. Sammenlign med nåværende /no/chat/.",
    whatNotToDoHere: "Ikke bruk som aktiv spec.",
    functionalValue: ["historisk beslutningsgrunnlag"],
    overlapKind: "ingen",
    overlapNote: "Unik historisk artefakt.",
    mergeRisk: "Behold i arkiv.",
    futurePlacement: "flytt til historikk / arkiv",
    needsThomasReview: false,
  }),
  "raw-strategi-notion": c({
    mandatePlain: "Tidlig strategisk IA (Notion v5) — erstattet av ia-principles.",
    practicalHelp: "Finn gammel begrunnelse for IA-valg.",
    whatToDoHere: "Sammenlign med ia-principles-v01 og hub-mandate.",
    whatNotToDoHere: "Ikke bruk som gjeldende strategi.",
    functionalValue: ["historisk beslutningsgrunnlag"],
    overlapKind: "reelt behov",
    overlapNote: "Samme behov som ia-principles — men denne er utdatert.",
    mergeRisk: "Behold som arkiv — canonical er ia-principles.",
    futurePlacement: "flytt til historikk / arkiv",
    migrationNote: "canonicalSource=/vis/system/ia-principles-v01",
    needsThomasReview: false,
  }),
  "raw-sprint-foundation": c({
    mandatePlain: "Lukket Sprint 01 — modell for fremtidige arkivsprint.",
    practicalHelp: "Se hvordan vi dokumenterte lukket sprint.",
    whatToDoHere: "Bruk som mal når W21 stenger.",
    whatNotToDoHere: "Ikke forveksle med aktiv W21.",
    functionalValue: ["historisk beslutningsgrunnlag"],
    overlapKind: "route-navn",
    overlapNote: "Navn ligner aktiv sprint — ulik status (lukket vs aktiv).",
    mergeRisk: "Tydelig «lukket»-merke. Ikke slett — modell for closedSprints.",
    futurePlacement: "flytt til historikk / arkiv",
    needsThomasReview: false,
  }),
  "raw-live-board": c({
    mandatePlain: "Gammel live board wireframe — erstattet av roadmap-timeline.",
    practicalHelp: "Ingen aktiv verdi — canonical er roadmap-siden.",
    whatToDoHere: "Bruk /vis/system/roadmap-timeline-v01.",
    whatNotToDoHere: "Ikke bruk som aktiv roadmap.",
    functionalValue: ["historisk beslutningsgrunnlag"],
    overlapKind: "reelt behov",
    overlapNote: "Samme behov som roadmap — fullt erstattet.",
    mergeRisk: "Har allerede retired-banner i viewer. Sletting OK etter QA.",
    futurePlacement: "vurder sletting senere",
    migrationNote: "Redirect finnes delvis. QA inbound lenker før sletting.",
    needsThomasReview: false,
  }),
  "mvp-current-state": c({
    mandatePlain: "Data som driver MVP-status og sprint-info på forsiden.",
    practicalHelp: "Operativ sannhet for «hvor står MVP» — ikke egen side.",
    whatToDoHere: "Oppdater ved sprintskifte eller MVP-endring.",
    whatNotToDoHere: "Ikke lag egen route — datakilde for kontrollrom.",
    functionalValue: ["runtime-status", "god oversikt"],
    overlapKind: "ingen",
    overlapNote: "Backend for kontrollrom — ikke overlapp med brukerflate.",
    mergeRisk: "Kritisk data — må bevares uansett tremeny.",
    futurePlacement: "behold som egen flate",
    migrationNote: "Forblir i mvp-current-state.ts. Dokumenter i page contract for /vis/.",
    needsThomasReview: false,
  }),
  "vis-frontpage-hubs": c({
    mandatePlain: "Definerer hub-kort på VIS-forsiden inntil tremeny finnes.",
    practicalHelp: "Styrer hvilke flater som vises som kort på /vis/.",
    whatToDoHere: "Oppdater ved IA-endring inntil konsolidert datakilde finnes.",
    whatNotToDoHere: "Ikke la hub-kort og tremeny divergere permanent — avklart løses i neste steg.",
    functionalValue: ["navigasjonshjelp", "lenker"],
    overlapKind: "route og behov",
    overlapNote: "Samme behov som fremtidig tremeny — parallelle kilder i dag.",
    mergeRisk: "Konsolider uten å miste hub-kort på forsiden under overgang.",
    futurePlacement: "slå sammen med annen flate",
    migrationNote:
      "VIS Tree Navigation v0.1: én felles datakilde (eller tydelig delt kontrakt) for hub-kort og tremeny. vis-frontpage-hubs-v01.ts merges inn.",
    needsThomasReview: false,
  }),
};

export function getVisIaConsolidation(id: string): VisIaConsolidationReadiness | undefined {
  return visIaConsolidationById[id];
}

export function getVisIaThomasReviewEntries(): string[] {
  return Object.entries(visIaConsolidationById)
    .filter(([, c]) => c.needsThomasReview)
    .map(([id]) => id);
}

export function getVisIaConsolidationByFuture(
  placement: VisIaFuturePlacement,
): string[] {
  return Object.entries(visIaConsolidationById)
    .filter(([, c]) => c.futurePlacement === placement)
    .map(([id]) => id);
}

/** Tremodell v0.3.1 — avklarte beslutninger innarbeidet. */
export const visIaTreeProposalV03 = {
  note: "Need-led tremodell v0.3.1 — «Arbeidsflater» som navigasjonskategori (top task 3 uendret)",
  excludedFromTree: ["/vis/artikkel", "/vis/hub"],
  sections: [
    {
      id: "now",
      label: "Nå — status og sprint",
      topTasks: ["status-nå", "jobber-med"] as VisIaTopTask[],
      items: [
        { label: "VIS kontrollrom (forside)", href: "/vis/", note: "Aggregert inngang + feed + hub-kort" },
        { label: "Sprint 2026-W21", href: "/vis/sprints/2026-w21/", note: "Aktiv sprint + labs" },
      ],
    },
    {
      id: "workspaces",
      label: "Arbeidsflater",
      topTasks: ["finn-flate"] as VisIaTopTask[],
      items: [
        { label: "Designsystem", href: "/designsystem/", note: "Global canonical" },
        { label: "Review / QA", href: "/vis/review/", note: "Under Design i tre" },
        {
          label: "Redaksjonelle bilder",
          href: "/vis/assets/editorial",
          note: "Sekundær: DAM / bildebank — ett område",
        },
        { label: "Gitbuss", href: "/vis/system/github-runtime-status", note: "Operativ GitHub" },
        { label: "Roadmap", href: "/vis/system/roadmap-timeline-v01", note: "Retning — ikke sprint" },
      ],
    },
    {
      id: "understand",
      label: "Forstå system og innhold",
      topTasks: ["forstå-system"] as VisIaTopTask[],
      items: [
        { label: "Backstage", href: "/backstage/", note: "Canonical systemforklaring" },
        { label: "IA-prinsipper", href: "/vis/system/ia-principles-v01" },
        { label: "Hub Mandate", href: "/vis/system/hub-mandate-v01" },
        { label: "Artikkel-system", href: "/vis/system/article/" },
        {
          label: "Agentdrift / runbook",
          href: "/vis/system/control-center",
          note: "Ikke «Control Center» — under Forstå system",
        },
      ],
    },
    {
      id: "history",
      label: "Historikk — begrunnelse og arkiv",
      topTasks: ["historikk", "unngå-forveksling"] as VisIaTopTask[],
      items: [
        { label: "Raw wireframes", note: "public/vis/raw — status historical" },
        { label: "Design System v01 (legacy)", href: "/vis/system/design-system-v01" },
        { label: "Task bus live", href: "/vis/system/task-bus-live" },
        { label: "Lukkede sprintvisninger", note: "Ved sprintskifte" },
        { label: "/vis/artikkel, /vis/hub", note: "Vurder sletting senere — ikke i tre" },
      ],
    },
  ],
} as const;
