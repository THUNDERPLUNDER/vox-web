/* CONTRACT: Curated Horizon Roadmap v0.1 projection. Project Brain owns direction;
   GitHub owns task/runtime status; VIS is a read-only projection of both. */

export type RoadmapHorizon = "now" | "next" | "later";
export type RoadmapTrackId = "product-beta" | "funding-delivery" | "field-value" | "knowledge-advantage";
export type StrategicFunction = "LEASE" | "OWN" | "ECOSYSTEM";
export type ExecutionLikelihood = "committed" | "probable" | "conditional" | "option";
export type TimingConfidence = "fixed" | "bounded" | "open";

export type RoadmapTiming = {
  confidence: TimingConfidence;
  label: string;
  start?: string;
  end?: string;
};

export type RoadmapInitiative = {
  id: string;
  projectionOrder: number;
  title: string;
  summary: string;
  track: RoadmapTrackId;
  horizons: RoadmapHorizon[];
  strategicFunction: StrategicFunction;
  executionLikelihood: ExecutionLikelihood;
  timing: RoadmapTiming;
  gate: string;
  significance: "critical" | "high" | "potentially-high";
  sourceIssues: number[];
};

export type RoadmapWatchSignal = {
  id: string;
  title: string;
  note: string;
};

export const roadmapProjectionMeta = {
  version: "v0.1",
  title: "Viddel Horizon Roadmap",
  sourceDocument: "Viddel – Project Brain (Current)",
  sourceRevision:
    "ANLCKQmBcAoTnKyFyEvU-Cj49KvnKJXkV9Mn5dZci0UsTlRBirzZVOl46sarKYOU9wNfTYMjxotFTSpvaT4w3ZgB3Q7aSuS10gr-bvEY0IY",
  operatingModelRevision:
    "ANLCKQksoDTdByzhOiblhA2EJ2B08dXmzelQzI4PzwN7QCmjgIEWlkU56EuXr4i4DHqQ2NfN0BeGxXNHIvcg_G7T_HKp__hZHMZYhQtPKoQ",
  projectionDate: "2026-09-12",
  shapingIssue: 374,
  shapingCommentId: 5583033572,
  projectionOwner: "Thomas",
} as const;

export const roadmapHorizons: Array<{ id: RoadmapHorizon; label: string; description: string }> = [
  { id: "now", label: "NOW", description: "Det vi arbeider med eller må avklare nå." },
  { id: "next", label: "NEXT", description: "Det vi tror kommer etter, hvis dagens avklaringer går som forventet." },
  { id: "later", label: "LATER", description: "Muligheter vi vil huske, men ikke har planlagt å gjøre ennå." },
];

export const roadmapTracks: Array<{ id: RoadmapTrackId; code: string; label: string }> = [
  { id: "product-beta", code: "A", label: "Produkt / beta" },
  { id: "funding-delivery", code: "B", label: "Finansiering / levering" },
  { id: "field-value", code: "C", label: "Felt / verdi / økosystem" },
  { id: "knowledge-advantage", code: "D", label: "Kunnskap / fordel" },
];

const openTiming: RoadmapTiming = {
  confidence: "open",
  label: "Åpen timing — ingen dato er etablert",
};

export const roadmapInitiatives: RoadmapInitiative[] = [
  {
    id: "funding-scope",
    projectionOrder: 1,
    title: "Oppstartstilskudd 1 → aktiv leveransekoordinering",
    summary: "IN-tilskuddet er godkjent. Finansiering er ikke lenger en åpen gate; nå må støtten omsettes i avgrenset Markedsklar- og leveransekoordinering uten scope creep.",
    track: "funding-delivery",
    horizons: ["now"],
    strategicFunction: "ECOSYSTEM",
    executionLikelihood: "committed",
    timing: openTiming,
    gate: "Godkjent ramme → Markedsklar-avtale / DOGA → tydelig startklart eksternt scope",
    significance: "critical",
    sourceIssues: [355, 383],
  },
  {
    id: "doga-markedsklar",
    projectionOrder: 2,
    title: "NoA / Kristine + Markedsklar",
    summary: "Bruk Markedsklar til å undersøke første betalende kunde, klinikkverdi, arbeidsflyt og betalingsusikkerhet — ikke som generell produkt- eller UI-sprint.",
    track: "field-value",
    horizons: ["now", "next"],
    strategicFunction: "ECOSYSTEM",
    executionLikelihood: "probable",
    timing: openTiming,
    gate: "Kapasitet + periode → samarbeidsavtale → DOGA-søknad",
    significance: "critical",
    sourceIssues: [383, 355],
  },
  {
    id: "clinic-value",
    projectionOrder: 3,
    title: "Klinikkverdi + første betalende-kunde-hypotese",
    summary: "Teste konkret arbeidsflyt, nytte og betalingsvilje uten å gjøre hypoteser til fakta.",
    track: "field-value",
    horizons: ["now"],
    strategicFunction: "ECOSYSTEM",
    executionLikelihood: "committed",
    timing: openTiming,
    gate: "Kontrollerte prospect-/klinikkintervjuer + Markedsklar-læring",
    significance: "critical",
    sourceIssues: [355, 375, 383],
  },
  {
    id: "user-relationships",
    projectionOrder: 4,
    title: "Brukerrelasjoner + feltlæring før beta",
    summary: "Lære fra interesserte brukere, Hørselsforbundet og kvalitative samtaler uten å forveksle researchintervju med produktbeta.",
    track: "field-value",
    horizons: ["now", "next"],
    strategicFunction: "ECOSYSTEM",
    executionLikelihood: "probable",
    timing: openTiming,
    gate: "Relasjoner og research kan bygges nå; produktbeta venter på eksplisitt #361 GO",
    significance: "high",
    sourceIssues: [406, 407, 415, 361, 363],
  },
  {
    id: "external-presence",
    projectionOrder: 5,
    title: "External Presence — gjør Viddel tydelig utad",
    summary: "Offentlig web, LinkedIn og partner-/introduksjonsmateriell utvikles som et parallelt NOW-spor, uten å vente på produkt- eller AI-gater.",
    track: "field-value",
    horizons: ["now"],
    strategicFunction: "ECOSYSTEM",
    executionLikelihood: "committed",
    timing: openTiming,
    gate: "Påstander og presentasjon må være sanne mot faktisk Viddel-state",
    significance: "high",
    sourceIssues: [409, 410, 411],
  },
  {
    id: "delivery-partner",
    projectionOrder: 6,
    title: "Velg + onboard utviklingspartner",
    summary: "Aktiver ekstern teknisk levering først når det konkrete finansierte scope-et, leverandørvalget, kontrakten og tilgangene er avklart.",
    track: "funding-delivery",
    horizons: ["next"],
    strategicFunction: "LEASE",
    executionLikelihood: "conditional",
    timing: openTiming,
    gate: "Avgrenset leveransescope → leverandørvalg → kontrakt / access GO",
    significance: "high",
    sourceIssues: [355, 364, 362, 313],
  },
  {
    id: "funded-round-one",
    projectionOrder: 7,
    title: "Finansiert teknisk baseline + MVP Round 1",
    summary: "Avgrens første finansierte produktløft etter at leveranseomfang og læringsmål faktisk er kjent.",
    track: "product-beta",
    horizons: ["next"],
    strategicFunction: "OWN",
    executionLikelihood: "conditional",
    timing: openTiming,
    gate: "Startklart finansiert scope + External Delivery GO",
    significance: "critical",
    sourceIssues: [379, 355],
  },
  {
    id: "beta-gate",
    projectionOrder: 8,
    title: "Limited-beta gate + gjenværende AI QA",
    summary: "Dagens state/policy-baseline er god nok til at annet arbeid kan fortsette. Gjenværende AI-kvalitet, fallback og sikkerhet tas opp igjen når #361 faktisk skal avgjøres.",
    track: "product-beta",
    horizons: ["next"],
    strategicFunction: "OWN",
    executionLikelihood: "conditional",
    timing: openTiming,
    gate: "#361 GO/NO-GO krever ny owner-QA og eksplisitt vurdering av kjent gjeld / #370",
    significance: "critical",
    sourceIssues: [384, 370, 361],
  },
  {
    id: "first-user-loop",
    projectionOrder: 9,
    title: "Første begrensede ekte brukerloop",
    summary: "Teste om Viddel forstår situasjonen og gir nyttige neste steg uten alvorlige feil.",
    track: "product-beta",
    horizons: ["next"],
    strategicFunction: "ECOSYSTEM",
    executionLikelihood: "conditional",
    timing: openTiming,
    gate: "BETA GO i #361",
    significance: "critical",
    sourceIssues: [361, 363],
  },
  {
    id: "round-two",
    projectionOrder: 10,
    title: "Round 2 — evidens → fixes → regression",
    summary: "La faktisk brukerevidens styre neste avgrensede feilretting og regresjonstest.",
    track: "product-beta",
    horizons: ["next"],
    strategicFunction: "OWN",
    executionLikelihood: "conditional",
    timing: openTiming,
    gate: "Faktisk evidens fra brukerloop",
    significance: "high",
    sourceIssues: [361, 363],
  },
  {
    id: "retrieval-benchmark",
    projectionOrder: 11,
    title: "Viddel Retrieval Benchmark + evalueringskapabilitet",
    summary: "Mål komponenter mot Viddel-eid evalueringsgrunnlag fremfor leverandøromdømme.",
    track: "knowledge-advantage",
    horizons: ["next"],
    strategicFunction: "OWN",
    executionLikelihood: "probable",
    timing: openTiming,
    gate: "Beta-arkitekturen er stabil nok til at benchmark-resultater kan brukes",
    significance: "high",
    sourceIssues: [372],
  },
  {
    id: "research-collaboration",
    projectionOrder: 12,
    title: "Research & Ecosystem Partnerships",
    summary: "Bygge en liten læringsallianse med brukerorganisasjon, audiologisk/forskningsfaglig miljø og klinisk feltpartner.",
    track: "field-value",
    horizons: ["next"],
    strategicFunction: "ECOSYSTEM",
    executionLikelihood: "probable",
    timing: openTiming,
    gate: "Konkret partner + tidsnær aktivitet, relevant finansieringsvindu eller beta-/klinikkfunn med tydelig forskningsspørsmål",
    significance: "potentially-high",
    sourceIssues: [389],
  },
  {
    id: "inventory",
    projectionOrder: 13,
    title: "Inventory / varig brukereid kontekst",
    summary: "Bevart konsept for synlig og varig utstyrs-/situasjonskontekst — ikke planlagt implementering.",
    track: "product-beta",
    horizons: ["later"],
    strategicFunction: "OWN",
    executionLikelihood: "option",
    timing: openTiming,
    gate: "Beta-evidens viser at synlig, varig kontekst forbedrer relevans eller tillit",
    significance: "potentially-high",
    sourceIssues: [385],
  },
];

export const roadmapWatchSignals: RoadmapWatchSignal[] = [
  {
    id: "doga-path",
    title: "NoA / DOGA: kapasitet, periode og formell vei",
    note: "Kan flytte tidspunkt og rekkefølge, men IN-beslutningen er ikke lenger en åpen gate.",
  },
  {
    id: "clinic-evidence",
    title: "Klinikkverdi / arbeidsflyt / betalingsvilje",
    note: "Faktisk evidens kan styrke, endre eller stoppe hypotesen.",
  },
  {
    id: "beta-evidence",
    title: "Beta-nytte / alvorlige feil / sikkerhet",
    note: "Observerte funn styrer gate, fixes og neste testloop når beta-sporet aktiveres igjen.",
  },
  {
    id: "capability-cost",
    title: "Modell-, retrieval- og agentkapabilitet / kost",
    note: "Følges bare når endringer påvirker en Viddel-gate eller OWN-antakelse.",
  },
  {
    id: "research-partners",
    title: "Forsknings- og akademiasamarbeid",
    note: "Aktiveres ved konkret problem, partner og evidensbehov.",
  },
  {
    id: "later-funding",
    title: "Senere finansieringsvinduer",
    note: "Tas inn når et reelt vindu blir materielt for roadmapet.",
  },
];

export const roadmapDecisionForks = [
  {
    title: "Når kommer første brukerloop?",
    body: "#361 / #363 kan komme før finansiert Round 1 eller etter den. Gate og faktisk readiness avgjør — roadmapet låser ikke sekvensen nå.",
  },
  {
    title: "Markedsklar og finansiert utvikling",
    body: "Markedsklar-læringen og teknisk levering kan bli iterative eller parallelle. Vi låser ikke et lineært fossefall før kapasitet, periode og leveransescope faktisk er kjent.",
  },
] as const;

export const roadmapProgramFrame =
  "Oppstartstilskudd 1 er godkjent. Nå ligger tyngden på Markedsklar, klinikkverdi, direkte feltlæring og External Presence, mens beta-hardening er parkert til #361 faktisk trenger den.";

export const roadmapFrontPreview = {
  now: ["doga-markedsklar", "clinic-value", "external-presence"],
  next: ["funded-round-one", "retrieval-benchmark"],
  later: ["inventory"],
  watch: ["doga-path", "clinic-evidence", "beta-evidence"],
} satisfies Record<RoadmapHorizon | "watch", string[]>;

export const roadmapFrontPreviewLabels: Record<string, string> = {
  "doga-markedsklar": "Få Markedsklar med NoA / Kristine formelt på plass",
  "clinic-value": "Finn ut hvilken verdi Viddel kan skape for klinikker",
  "external-presence": "Gjør Viddel tydelig utad",
  "funded-round-one": "Avgrens første finansierte MVP-runde",
  "retrieval-benchmark": "Bygg Viddels evaluerings- og benchmarkkapabilitet",
  inventory: "Utforsk varig bruker-eid kontekst",
};

export const executionLikelihoodLabels: Record<ExecutionLikelihood, string> = {
  committed: "Besluttet",
  probable: "Sannsynlig",
  conditional: "Avhenger av",
  option: "Mulighet",
};

export const strategicFunctionLabels: Record<StrategicFunction, string> = {
  LEASE: "Leid standardkapabilitet / levering",
  OWN: "Viddel-eid relevans, kontroll eller læring",
  ECOSYSTEM: "Ekstern relasjon, partner eller markedslæring",
};

export const significanceLabels: Record<RoadmapInitiative["significance"], string> = {
  critical: "Kritisk for gjeldende port eller retning",
  high: "Høy strategisk betydning",
  "potentially-high": "Potensielt høy — krever evidens",
};

export function githubIssueHref(issueNumber: number): string {
  return `https://github.com/THUNDERPLUNDER/vox-web/issues/${issueNumber}`;
}

export function validateRoadmapProjection(
  initiatives: RoadmapInitiative[] = roadmapInitiatives,
  watchSignals: RoadmapWatchSignal[] = roadmapWatchSignals,
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const watchIds = new Set(watchSignals.map((signal) => signal.id));
  const horizonOrder: RoadmapHorizon[] = ["now", "next", "later"];
  const validTracks = new Set(roadmapTracks.map((track) => track.id));

  if (initiatives.length !== 13) errors.push(`Expected 13 initiatives, received ${initiatives.length}.`);

  for (const item of initiatives) {
    if (ids.has(item.id)) errors.push(`Duplicate initiative id: ${item.id}.`);
    ids.add(item.id);
    if (watchIds.has(item.id)) errors.push(`WATCH signal collides with initiative: ${item.id}.`);
    if (!validTracks.has(item.track)) errors.push(`Unknown track on ${item.id}: ${item.track}.`);
    if (item.horizons.length < 1) errors.push(`Missing horizon on ${item.id}.`);
    if (item.horizons.some((horizon) => !horizonOrder.includes(horizon))) {
      errors.push(`Invalid horizon on ${item.id}.`);
    }
    const indexes = item.horizons.map((horizon) => horizonOrder.indexOf(horizon));
    if (indexes.some((index, position) => position > 0 && index !== indexes[position - 1]! + 1)) {
      errors.push(`Non-contiguous horizons on ${item.id}.`);
    }
    if (item.sourceIssues.length < 1 || item.sourceIssues.some((issue) => !Number.isInteger(issue) || issue <= 0)) {
      errors.push(`Invalid GitHub drill-down on ${item.id}.`);
    }
    if (item.timing.confidence === "open" && (item.timing.start || item.timing.end)) {
      errors.push(`Open timing must not have date anchors on ${item.id}.`);
    }
    if (item.timing.confidence === "fixed" && (!item.timing.start || item.timing.end)) {
      errors.push(`Fixed timing requires one explicit date on ${item.id}.`);
    }
    if (item.timing.confidence === "bounded" && (!item.timing.start || !item.timing.end)) {
      errors.push(`Bounded timing requires explicit start and end on ${item.id}.`);
    }
    if ("probability" in item || "percentage" in item) {
      errors.push(`Numeric probability field is not allowed on ${item.id}.`);
    }
  }

  return errors;
}
