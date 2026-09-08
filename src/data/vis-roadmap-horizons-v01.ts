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
    "ANLCKQky9jMeCTdUWNxfFl3GkxGJcMQWvVFfHa3Y0CCCjo4rhqVb2XhRyBOhHrYjCfomJ2G4-UW-Y4Qer1-28x41DPMc7zHKqPNyw3pNcYY",
  operatingModelRevision:
    "ANLCKQksoDTdByzhOiblhA2EJ2B08dXmzelQzI4PzwN7QCmjgIEWlkU56EuXr4i4DHqQ2NfN0BeGxXNHIvcg_G7T_HKp__hZHMZYhQtPKoQ",
  projectionDate: "2026-09-08",
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
    id: "beta-gate",
    projectionOrder: 1,
    title: "Minimum state + policy + security → beta gate",
    summary: "Avklar og verifiser minste Viddel-eide state-/policygrense før begrenset beta.",
    track: "product-beta",
    horizons: ["now"],
    strategicFunction: "OWN",
    executionLikelihood: "committed",
    timing: openTiming,
    gate: "Thomas’ arkitekturbeslutning → eventuell avgrenset implementering → sikkerhet / owner-QA / GO",
    significance: "critical",
    sourceIssues: [384, 370, 361],
  },
  {
    id: "funding-scope",
    projectionOrder: 2,
    title: "Avklar IN / DOGA-finansiert scope",
    summary: "Få faktisk beslutning, ramme og vilkår før finansiert scope eller sekvens låses.",
    track: "funding-delivery",
    horizons: ["now"],
    strategicFunction: "ECOSYSTEM",
    executionLikelihood: "committed",
    timing: openTiming,
    gate: "Faktisk IN-beslutning og vilkår",
    significance: "critical",
    sourceIssues: [355],
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
    gate: "Første kontrollerte intervju- og outreach-læring",
    significance: "critical",
    sourceIssues: [355, 375],
  },
  {
    id: "user-relationships",
    projectionOrder: 4,
    title: "Brukerrelasjoner + feltlæring før beta",
    summary: "Lære fra interesserte brukere, Hørselsforbundet og kvalitative samtaler uten å starte #363 før GO.",
    track: "field-value",
    horizons: ["now", "next"],
    strategicFunction: "ECOSYSTEM",
    executionLikelihood: "probable",
    timing: openTiming,
    gate: "Relasjoner kan bygges nå; beta-rekruttering venter på eksplisitt GO",
    significance: "high",
    sourceIssues: [361, 363],
  },
  {
    id: "delivery-partner",
    projectionOrder: 5,
    title: "Velg + onboard utviklingspartner",
    summary: "Aktiver ekstern levering først når scope, leverandørvalg, kontrakt og tilgang er avklart.",
    track: "funding-delivery",
    horizons: ["next"],
    strategicFunction: "LEASE",
    executionLikelihood: "conditional",
    timing: openTiming,
    gate: "Finansiert scope → leverandørvalg → kontrakt / access GO",
    significance: "high",
    sourceIssues: [355, 364, 362, 313],
  },
  {
    id: "doga-markedsklar",
    projectionOrder: 6,
    title: "DOGA-partner + Markedsklar",
    summary: "Et mulig iterativt eller parallelt designløp — ikke et påstått lineært fossefall.",
    track: "field-value",
    horizons: ["now", "next"],
    strategicFunction: "ECOSYSTEM",
    executionLikelihood: "conditional",
    timing: openTiming,
    gate: "Positiv IN-retning + designpartner + formell DOGA-vei",
    significance: "high",
    sourceIssues: [383, 355],
  },
  {
    id: "funded-round-one",
    projectionOrder: 7,
    title: "Finansiert teknisk baseline + MVP Round 1",
    summary: "Avgrens første finansierte produktløft etter at leveranseomfanget faktisk er kjent.",
    track: "product-beta",
    horizons: ["next"],
    strategicFunction: "OWN",
    executionLikelihood: "conditional",
    timing: openTiming,
    gate: "Finansiert scope + External Delivery GO",
    significance: "critical",
    sourceIssues: [379],
  },
  {
    id: "first-user-loop",
    projectionOrder: 8,
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
    projectionOrder: 9,
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
    projectionOrder: 10,
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
    id: "inventory",
    projectionOrder: 11,
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
];

export const roadmapWatchSignals: RoadmapWatchSignal[] = [
  {
    id: "funding-terms",
    title: "IN-beslutning / budsjett / vilkår",
    note: "Kan endre finansiert scope og rekkefølge.",
  },
  {
    id: "doga-path",
    title: "DOGA-opptak / prosess / partnertilgang",
    note: "Kan åpne eller flytte et avgrenset designløp.",
  },
  {
    id: "clinic-evidence",
    title: "Klinikkverdi / arbeidsflyt / betalingsvilje",
    note: "Faktisk evidens kan styrke, endre eller stoppe hypotesen.",
  },
  {
    id: "beta-evidence",
    title: "Beta-nytte / alvorlige feil / sikkerhet",
    note: "Observerte funn styrer gate, fixes og neste testloop.",
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
    title: "DOGA og finansiert utvikling",
    body: "Løpene kan bli iterative eller parallelle. De vises ikke som et lineært fossefall før vilkår og partnervei er kjent.",
  },
] as const;

export const roadmapProgramFrame =
  "Arbeidsrammen er foreløpig og lett: IN / DOGA og mulig ekstern levering påvirker sekvensen, men roadmapet er større enn én finansieringsordning.";

export const roadmapFrontPreview = {
  now: ["beta-gate", "funding-scope", "clinic-value"],
  next: ["funded-round-one", "first-user-loop"],
  later: ["inventory"],
  watch: ["funding-terms", "clinic-evidence", "beta-evidence"],
} satisfies Record<RoadmapHorizon | "watch", string[]>;

export const roadmapFrontPreviewLabels: Record<string, string> = {
  "beta-gate": "Gjør AI-hjelpen klar for begrenset beta",
  "funding-scope": "Avklar finansiering og rammer med IN/DOGA",
  "clinic-value": "Finn ut hvilken verdi Viddel kan skape for klinikker",
  "funded-round-one": "Bygg første finansierte MVP-runde",
  "first-user-loop": "Test med de første brukerne",
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

  if (initiatives.length !== 12) errors.push(`Expected 12 initiatives, received ${initiatives.length}.`);

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
