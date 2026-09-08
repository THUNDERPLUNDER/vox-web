import assert from "node:assert/strict";
import {
  githubIssueHref,
  roadmapInitiatives,
  roadmapWatchSignals,
  validateRoadmapProjection,
} from "../src/data/vis-roadmap-horizons-v01.ts";

assert.deepEqual(validateRoadmapProjection(), [], "the curated 12-object projection must be valid");
assert.equal(roadmapInitiatives.length, 12, "the projection must contain exactly 12 roadmap objects");
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

console.log("VIS Horizon Roadmap guard passed (12 objects, horizon/WATCH/timing/GitHub contracts verified).");
