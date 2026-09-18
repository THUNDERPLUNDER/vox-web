import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  githubIssueHref,
  roadmapInitiatives,
  roadmapTemporalTimeline,
  roadmapWatchSignals,
  validateRoadmapProjection,
} from "../src/data/vis-roadmap-horizons-v01.ts";
import {
  ROADMAP_PROJECTION_V02_URL,
  loadVisRoadmapProjectionV02,
  validateRoadmapProjectionV02,
} from "../src/data/load-vis-roadmap-projection-v02.ts";

assert.deepEqual(validateRoadmapProjection(), [], "the curated 13-object projection must be valid");
assert.equal(roadmapInitiatives.length, 13, "the projection must contain exactly 13 roadmap objects");
assert.ok(
  roadmapInitiatives.every((item) => item.timing.confidence === "open" && !item.timing.start && !item.timing.end),
  "undated open initiatives must not gain date anchors",
);
assert.ok(
  roadmapWatchSignals.every((signal) => !roadmapInitiatives.some((item) => item.id === signal.id)),
  "WATCH must remain a distinct signal layer",
);
assert.equal(
  githubIssueHref(374),
  "https://github.com/THUNDERPLUNDER/vox-web/issues/374",
  "GitHub drill-down must resolve canonically",
);
assert.ok(
  roadmapInitiatives.some((item) => item.id === "external-presence" && item.horizons.includes("now")),
  "External Presence must be represented as an approved NOW initiative",
);
assert.ok(
  !roadmapWatchSignals.some((signal) => signal.id === "funding-terms"),
  "the resolved IN decision must not remain an open WATCH signal",
);

assert.equal(roadmapTemporalTimeline.lanes.length, 4, "temporal fallback must expose four orientation lanes");
assert.equal(roadmapTemporalTimeline.startMonth, "2026-09");
assert.equal(roadmapTemporalTimeline.endMonth, "2027-01");
assert.ok(
  roadmapTemporalTimeline.items.every((item) => item.sourceInitiativeIds.length > 0),
  "every temporal item must retain roadmap provenance",
);

const baseline = roadmapInitiatives[0];
assert.ok(baseline, "baseline roadmap object must exist");

const openWithInventedDate = {
  ...baseline,
  id: "invalid-open-date",
  timing: { confidence: "open", label: "invalid", start: "2026-09-08" },
};
assert.ok(
  validateRoadmapProjection([...roadmapInitiatives.slice(1), openWithInventedDate], roadmapWatchSignals).some((error) =>
    error.includes("Open timing must not have date anchors"),
  ),
  "open timing with an invented date must fail",
);

const fixedWithoutDate = {
  ...baseline,
  id: "invalid-fixed-date",
  timing: { confidence: "fixed", label: "invalid" },
};
assert.ok(
  validateRoadmapProjection([...roadmapInitiatives.slice(1), fixedWithoutDate], roadmapWatchSignals).some((error) =>
    error.includes("Fixed timing requires one explicit date"),
  ),
  "fixed timing without an explicit anchor must fail",
);

const watchCollision = { ...roadmapWatchSignals[0], id: baseline.id };
assert.ok(
  validateRoadmapProjection(roadmapInitiatives, [watchCollision, ...roadmapWatchSignals.slice(1)]).some((error) =>
    error.includes("WATCH signal collides with initiative"),
  ),
  "WATCH must not be accepted as a roadmap initiative",
);

const invalidDrillDown = { ...baseline, id: "invalid-drilldown", sourceIssues: [] };
assert.ok(
  validateRoadmapProjection([...roadmapInitiatives.slice(1), invalidDrillDown], roadmapWatchSignals).some((error) =>
    error.includes("Invalid GitHub drill-down"),
  ),
  "every initiative must keep a GitHub drill-down",
);

const temporalSource = await readFile(
  new URL("../src/components/vis/RoadmapTemporalTimeline.astro", import.meta.url),
  "utf8",
);
assert.ok(temporalSource.includes("I DAG"), "temporal timeline must expose a visible today marker");
assert.ok(temporalSource.includes("overflow-x: auto"), "temporal timeline must preserve horizontal orientation on narrow screens");
assert.ok(temporalSource.includes("timingLabels"), "temporal timing confidence must be available as text, not color alone");

const cardSource = await readFile(
  new URL("../src/components/vis/RoadmapInitiativeCard.astro", import.meta.url),
  "utf8",
);
const introPosition = cardSource.indexOf("Hva dette handler om");
const metadataPosition = cardSource.indexOf("<dl>");
assert.ok(introPosition >= 0, "expanded roadmap cards must introduce the initiative in human language");
assert.ok(
  cardSource.indexOf("<strong>GitHub:</strong>", introPosition) > introPosition,
  "expanded roadmap cards must show linked source issues with the human-facing intro",
);
assert.ok(
  metadataPosition > introPosition,
  "the human-facing initiative intro must appear before roadmap metadata",
);

const remoteResponse = await fetch(ROADMAP_PROJECTION_V02_URL, { cache: "no-store" });
assert.ok(remoteResponse.ok, `approved v0.2 state source must be reachable (${remoteResponse.status})`);
const remoteProjection = await remoteResponse.json();
assert.deepEqual(validateRoadmapProjectionV02(remoteProjection), [], "approved v0.2 projection must validate");
assert.equal(remoteProjection.temporalTimeline.startMonth, "2026-09", "approved temporal projection must start in September");
assert.equal(remoteProjection.temporalTimeline.endMonth, "2027-01", "approved temporal projection must end in January");
assert.equal(remoteProjection.temporalTimeline.lanes.length, 4, "approved temporal projection must expose four lanes");
const invalidTemporalFixture = structuredClone(remoteProjection);
invalidTemporalFixture.temporalTimeline.items[0].sourceInitiativeIds = ["missing-initiative"];
assert.ok(
  validateRoadmapProjectionV02(invalidTemporalFixture).some((error) => error.includes("Unknown temporal source initiative")),
  "temporal items must not reference unknown roadmap initiatives",
);

const richWatchFixture = structuredClone(remoteProjection);
richWatchFixture.watchSignals = [
  ...richWatchFixture.watchSignals,
  {
    id: "watch-contract-fixture",
    title: "WATCH contract fixture",
    note: "Compact signal",
    evidenceLabel: "Verified direction · implications open",
    lastVerified: "2026-09-13",
    sourceIssues: [404],
    sourceLinks: [{ label: "Primary source", href: "https://example.com/source" }],
    detail: { verified: "Verified fact", open: "Open implication", trigger: "Concrete trigger" },
  },
];
richWatchFixture.frontPreview.watch = [...richWatchFixture.frontPreview.watch, "watch-contract-fixture"];
assert.deepEqual(validateRoadmapProjectionV02(richWatchFixture), [], "rich WATCH metadata must validate generically");
const invalidRichWatchFixture = structuredClone(richWatchFixture);
invalidRichWatchFixture.watchSignals.at(-1).sourceIssues = [];
assert.ok(
  validateRoadmapProjectionV02(invalidRichWatchFixture).some((error) => error.includes("Invalid WATCH sourceIssues")),
  "rich WATCH provenance must remain contract-validated",
);
assert.ok(
  remoteProjection.initiatives.some(
    (item) => item.id === "lived-hearing" && item.horizons.includes("next") && item.sourceIssues.includes(428) && item.sourceIssues.includes(429),
  ),
  "approved v0.2 state must project #428 and expose #429 through drill-down",
);
assert.ok(
  remoteProjection.frontPreview.next.includes("lived-hearing"),
  "compact preview must expose the approved lived-hearing competence area",
);

const freshLoad = await loadVisRoadmapProjectionV02();
assert.equal(freshLoad.sourceState, "fresh", "reachable valid approved source must load as fresh");
assert.equal(freshLoad.projection.projectionRevision, remoteProjection.projectionRevision);

const realFetch = globalThis.fetch;
globalThis.fetch = async () => new Response("unavailable", { status: 503 });
try {
  const fallbackLoad = await loadVisRoadmapProjectionV02();
  assert.equal(fallbackLoad.sourceState, "fallback", "fetch failure must select explicit fallback");
  assert.ok(fallbackLoad.projection.initiatives.length > 0, "fallback must never render an empty roadmap");
} finally {
  globalThis.fetch = realFetch;
}

console.log(
  `VIS Horizon Roadmap guard passed (13-object bundled fallback + ${remoteProjection.initiatives.length}-object approved v0.2 source verified).`,
);
