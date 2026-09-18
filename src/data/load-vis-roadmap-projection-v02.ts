import {
  roadmapDecisionForks as fallbackDecisionForks,
  roadmapFrontPreview as fallbackFrontPreview,
  roadmapFrontPreviewLabels as fallbackFrontPreviewLabels,
  roadmapInitiatives as fallbackInitiatives,
  roadmapProgramFrame as fallbackProgramFrame,
  roadmapProjectionMeta as fallbackMeta,
  roadmapTracks,
  roadmapTemporalTimeline as fallbackTemporalTimeline,
  roadmapWatchSignals as fallbackWatchSignals,
  type ExecutionLikelihood,
  type RoadmapHorizon,
  type RoadmapInitiative,
  type RoadmapTrackId,
  type RoadmapTemporalTimeline,
  type RoadmapWatchSignal,
  type StrategicFunction,
  type TimingConfidence,
} from "./vis-roadmap-horizons-v01.ts";

export const ROADMAP_PROJECTION_V02_URL =
  "https://raw.githubusercontent.com/THUNDERPLUNDER/vox-web/vis-state/docs/state/vis-roadmap-projection-v02.json";

export type RoadmapProjectionV02 = {
  contractVersion: "0.2";
  projectionRevision: string;
  approvedAt: string;
  approvedBy: string;
  title: string;
  sourceDocument: string;
  projectBrainRevision: string;
  provenance: string[];
  initiatives: RoadmapInitiative[];
  watchSignals: RoadmapWatchSignal[];
  frontPreview: Record<RoadmapHorizon | "watch", string[]>;
  frontPreviewLabels: Record<string, string>;
  temporalTimeline: RoadmapTemporalTimeline;
  decisionForks: Array<{ title: string; body: string }>;
  programFrame: string;
};

export type RoadmapProjectionLoadResult = {
  projection: RoadmapProjectionV02;
  sourceState: "fresh" | "fallback";
  sourceUrl: string;
};

const horizons: RoadmapHorizon[] = ["now", "next", "later"];
const strategicFunctions: StrategicFunction[] = ["LEASE", "OWN", "ECOSYSTEM"];
const executionLikelihoods: ExecutionLikelihood[] = ["committed", "probable", "conditional", "option"];
const timingConfidences: TimingConfidence[] = ["fixed", "bounded", "open"];
const trackIds = new Set<RoadmapTrackId>(roadmapTracks.map((track) => track.id));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function fallbackProjection(): RoadmapProjectionV02 {
  return {
    contractVersion: "0.2",
    projectionRevision: `fallback-${fallbackMeta.projectionDate}`,
    approvedAt: fallbackMeta.projectionDate,
    approvedBy: fallbackMeta.projectionOwner,
    title: fallbackMeta.title,
    sourceDocument: fallbackMeta.sourceDocument,
    projectBrainRevision: fallbackMeta.sourceRevision,
    provenance: [`#${fallbackMeta.shapingIssue}`],
    initiatives: fallbackInitiatives,
    watchSignals: fallbackWatchSignals,
    frontPreview: fallbackFrontPreview,
    frontPreviewLabels: fallbackFrontPreviewLabels,
    temporalTimeline: fallbackTemporalTimeline,
    decisionForks: [...fallbackDecisionForks],
    programFrame: fallbackProgramFrame,
  };
}

export function validateRoadmapProjectionV02(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Projection must be a JSON object."];

  if (value.contractVersion !== "0.2") errors.push("contractVersion must be 0.2.");
  for (const field of ["projectionRevision", "approvedAt", "approvedBy", "title", "sourceDocument", "projectBrainRevision"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`${field} must be a non-empty string.`);
  }
  if (!Array.isArray(value.provenance) || value.provenance.some((item) => !isNonEmptyString(item))) {
    errors.push("provenance must be a string array.");
  }
  if (!Array.isArray(value.initiatives) || value.initiatives.length < 1) {
    errors.push("initiatives must be a non-empty array.");
    return errors;
  }
  if (!Array.isArray(value.watchSignals)) errors.push("watchSignals must be an array.");

  const initiativeIds = new Set<string>();
  const watchIds = new Set<string>();

  if (Array.isArray(value.watchSignals)) {
    for (const raw of value.watchSignals) {
      if (!isRecord(raw) || !isNonEmptyString(raw.id) || !isNonEmptyString(raw.title) || !isNonEmptyString(raw.note)) {
        errors.push("Each WATCH signal needs id, title and note.");
        continue;
      }
      if (watchIds.has(raw.id)) errors.push(`Duplicate WATCH id: ${raw.id}.`);
      watchIds.add(raw.id);
      if (raw.evidenceLabel !== undefined && !isNonEmptyString(raw.evidenceLabel)) {
        errors.push(`Invalid WATCH evidenceLabel on ${raw.id}.`);
      }
      if (raw.lastVerified !== undefined && (!isNonEmptyString(raw.lastVerified) || !/^\d{4}-\d{2}-\d{2}$/.test(raw.lastVerified))) {
        errors.push(`Invalid WATCH lastVerified on ${raw.id}.`);
      }
      if (raw.sourceIssues !== undefined && (!Array.isArray(raw.sourceIssues) || raw.sourceIssues.length < 1 || raw.sourceIssues.some((issue) => !Number.isInteger(issue) || Number(issue) <= 0))) {
        errors.push(`Invalid WATCH sourceIssues on ${raw.id}.`);
      }
      if (raw.sourceLinks !== undefined && (!Array.isArray(raw.sourceLinks) || raw.sourceLinks.some((source) => !isRecord(source) || !isNonEmptyString(source.label) || !isNonEmptyString(source.href)))) {
        errors.push(`Invalid WATCH sourceLinks on ${raw.id}.`);
      }
      if (raw.detail !== undefined && (!isRecord(raw.detail) || !isNonEmptyString(raw.detail.verified) || !isNonEmptyString(raw.detail.open) || !isNonEmptyString(raw.detail.trigger))) {
        errors.push(`Invalid WATCH detail on ${raw.id}.`);
      }
    }
  }

  for (const raw of value.initiatives) {
    if (!isRecord(raw)) {
      errors.push("Each initiative must be an object.");
      continue;
    }
    const id = raw.id;
    if (!isNonEmptyString(id)) {
      errors.push("Initiative id must be a non-empty string.");
      continue;
    }
    if (initiativeIds.has(id)) errors.push(`Duplicate initiative id: ${id}.`);
    initiativeIds.add(id);
    if (watchIds.has(id)) errors.push(`WATCH signal collides with initiative: ${id}.`);

    if (!Number.isInteger(raw.projectionOrder)) errors.push(`Invalid projectionOrder on ${id}.`);
    if (!isNonEmptyString(raw.title) || !isNonEmptyString(raw.summary) || !isNonEmptyString(raw.gate)) {
      errors.push(`Missing human-facing text on ${id}.`);
    }
    if (!isNonEmptyString(raw.track) || !trackIds.has(raw.track as RoadmapTrackId)) errors.push(`Unknown track on ${id}.`);
    if (!isNonEmptyString(raw.strategicFunction) || !strategicFunctions.includes(raw.strategicFunction as StrategicFunction)) {
      errors.push(`Invalid strategicFunction on ${id}.`);
    }
    if (!isNonEmptyString(raw.executionLikelihood) || !executionLikelihoods.includes(raw.executionLikelihood as ExecutionLikelihood)) {
      errors.push(`Invalid executionLikelihood on ${id}.`);
    }
    if (!Array.isArray(raw.horizons) || raw.horizons.length < 1 || raw.horizons.some((horizon) => !horizons.includes(horizon as RoadmapHorizon))) {
      errors.push(`Invalid horizon on ${id}.`);
    } else {
      const indexes = raw.horizons.map((horizon) => horizons.indexOf(horizon as RoadmapHorizon));
      if (indexes.some((index, position) => position > 0 && index !== indexes[position - 1]! + 1)) {
        errors.push(`Non-contiguous horizons on ${id}.`);
      }
    }
    if (!Array.isArray(raw.sourceIssues) || raw.sourceIssues.length < 1 || raw.sourceIssues.some((issue) => !Number.isInteger(issue) || Number(issue) <= 0)) {
      errors.push(`Invalid GitHub drill-down on ${id}.`);
    }
    if (!isRecord(raw.timing) || !isNonEmptyString(raw.timing.confidence) || !timingConfidences.includes(raw.timing.confidence as TimingConfidence)) {
      errors.push(`Invalid timing on ${id}.`);
    } else {
      const start = raw.timing.start;
      const end = raw.timing.end;
      if (!isNonEmptyString(raw.timing.label)) errors.push(`Timing label missing on ${id}.`);
      if (raw.timing.confidence === "open" && (start || end)) errors.push(`Open timing must not have date anchors on ${id}.`);
      if (raw.timing.confidence === "fixed" && (!isNonEmptyString(start) || end)) errors.push(`Fixed timing requires one explicit date on ${id}.`);
      if (raw.timing.confidence === "bounded" && (!isNonEmptyString(start) || !isNonEmptyString(end))) errors.push(`Bounded timing requires explicit start and end on ${id}.`);
    }
  }

  const monthPattern = /^\d{4}-\d{2}$/;
  if (!isRecord(value.temporalTimeline)) {
    errors.push("temporalTimeline must be an object.");
  } else {
    const temporal = value.temporalTimeline;
    if (!isNonEmptyString(temporal.startMonth) || !monthPattern.test(temporal.startMonth)) {
      errors.push("temporalTimeline.startMonth must use YYYY-MM.");
    }
    if (!isNonEmptyString(temporal.endMonth) || !monthPattern.test(temporal.endMonth)) {
      errors.push("temporalTimeline.endMonth must use YYYY-MM.");
    }
    if (
      isNonEmptyString(temporal.startMonth) &&
      isNonEmptyString(temporal.endMonth) &&
      monthPattern.test(temporal.startMonth) &&
      monthPattern.test(temporal.endMonth) &&
      temporal.startMonth > temporal.endMonth
    ) {
      errors.push("temporalTimeline startMonth must not be after endMonth.");
    }

    const laneIds = new Set<string>();
    if (!Array.isArray(temporal.lanes) || temporal.lanes.length < 1) {
      errors.push("temporalTimeline.lanes must be a non-empty array.");
    } else {
      for (const lane of temporal.lanes) {
        if (!isRecord(lane) || !isNonEmptyString(lane.id) || !isNonEmptyString(lane.label)) {
          errors.push("Each temporal lane needs id and label.");
          continue;
        }
        if (laneIds.has(lane.id)) errors.push(`Duplicate temporal lane id: ${lane.id}.`);
        laneIds.add(lane.id);
      }
    }

    const itemIds = new Set<string>();
    if (!Array.isArray(temporal.items) || temporal.items.length < 1) {
      errors.push("temporalTimeline.items must be a non-empty array.");
    } else {
      for (const item of temporal.items) {
        if (!isRecord(item) || !isNonEmptyString(item.id)) {
          errors.push("Each temporal item needs an id.");
          continue;
        }
        if (itemIds.has(item.id)) errors.push(`Duplicate temporal item id: ${item.id}.`);
        itemIds.add(item.id);
        if (!isNonEmptyString(item.lane) || !laneIds.has(item.lane)) {
          errors.push(`Unknown temporal lane on ${item.id}.`);
        }
        if (!isNonEmptyString(item.label)) errors.push(`Temporal label missing on ${item.id}.`);
        if (!isNonEmptyString(item.start) || !monthPattern.test(item.start) || !isNonEmptyString(item.end) || !monthPattern.test(item.end)) {
          errors.push(`Temporal item dates must use YYYY-MM on ${item.id}.`);
        } else {
          if (item.start > item.end) errors.push(`Temporal item start must not follow end on ${item.id}.`);
          if (
            isNonEmptyString(temporal.startMonth) &&
            isNonEmptyString(temporal.endMonth) &&
            (item.start < temporal.startMonth || item.end > temporal.endMonth)
          ) {
            errors.push(`Temporal item falls outside timeline on ${item.id}.`);
          }
        }
        if (!isNonEmptyString(item.timing) || !timingConfidences.includes(item.timing as TimingConfidence)) {
          errors.push(`Invalid temporal timing on ${item.id}.`);
        }
        if (item.milestone !== undefined && typeof item.milestone !== "boolean") {
          errors.push(`Temporal milestone must be boolean on ${item.id}.`);
        }
        if (
          !Array.isArray(item.sourceInitiativeIds) ||
          item.sourceInitiativeIds.length < 1 ||
          item.sourceInitiativeIds.some((id) => !isNonEmptyString(id) || !initiativeIds.has(id))
        ) {
          errors.push(`Unknown temporal source initiative on ${item.id}.`);
        }
      }
    }
  }

  if (!isRecord(value.frontPreview)) {
    errors.push("frontPreview must be an object.");
  } else {
    for (const key of ["now", "next", "later"] as const) {
      const refs = value.frontPreview[key];
      if (!Array.isArray(refs) || refs.some((id) => !isNonEmptyString(id) || !initiativeIds.has(id))) {
        errors.push(`frontPreview.${key} contains an unknown initiative.`);
      }
    }
    const watchRefs = value.frontPreview.watch;
    if (!Array.isArray(watchRefs) || watchRefs.some((id) => !isNonEmptyString(id) || !watchIds.has(id))) {
      errors.push("frontPreview.watch contains an unknown WATCH signal.");
    }
  }

  if (!isRecord(value.frontPreviewLabels)) errors.push("frontPreviewLabels must be an object.");
  if (!Array.isArray(value.decisionForks) || value.decisionForks.some((fork) => !isRecord(fork) || !isNonEmptyString(fork.title) || !isNonEmptyString(fork.body))) {
    errors.push("decisionForks must contain title/body objects.");
  }
  if (!isNonEmptyString(value.programFrame)) errors.push("programFrame must be a non-empty string.");

  return errors;
}

export async function loadVisRoadmapProjectionV02(): Promise<RoadmapProjectionLoadResult> {
  try {
    const response = await fetch(ROADMAP_PROJECTION_V02_URL, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Roadmap projection fetch failed: ${response.status}`);
    const candidate: unknown = await response.json();
    const errors = validateRoadmapProjectionV02(candidate);
    if (errors.length > 0) throw new Error(`Roadmap projection invalid: ${errors.join(" | ")}`);
    return {
      projection: candidate as RoadmapProjectionV02,
      sourceState: "fresh",
      sourceUrl: ROADMAP_PROJECTION_V02_URL,
    };
  } catch {
    return {
      projection: fallbackProjection(),
      sourceState: "fallback",
      sourceUrl: ROADMAP_PROJECTION_V02_URL,
    };
  }
}
