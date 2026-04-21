/* CONTRACT: Minimal KL-META parser and lane merge for VIS roadmap timeline v0.1 read model (GitHub issues + repo lane manifest). */

export interface LaneManifestV01 {
  version: string;
  lanes: Array<{
    id: string;
    label_no: string;
    description_no?: string;
    order: number;
  }>;
}

export interface InitiativeReadModel {
  issueNumber: number;
  title: string;
  summaryNo: string;
  explainerNo: string;
  planStart: string | null;
  planEnd: string | null;
  laneId: string;
  htmlUrl: string;
}

export interface RoadmapLaneGroup {
  laneId: string;
  labelNo: string;
  order: number;
  initiatives: InitiativeReadModel[];
}

/** Extract ```yaml …``` inside KL-META markers. */
export function extractKlMetaYaml(body: string): string | null {
  const start = body.indexOf("<!-- KL-META:START -->");
  const end = body.indexOf("<!-- KL-META:END -->");
  if (start === -1 || end === -1 || end <= start) return null;
  const inner = body.slice(start, end);
  const m = inner.match(/```yaml\s*([\s\S]*?)```/);
  return m?.[1]?.trim() ?? null;
}

/** Parse a small YAML subset: `key: value` per line, quoted or unquoted scalars. */
export function parseSimpleYamlScalarMap(yaml: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rawLine of yaml.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf(":");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

export function parseInitiativeFromIssueBody(body: string): InitiativeReadModel | null {
  const yaml = extractKlMetaYaml(body);
  if (!yaml) return null;
  const meta = parseSimpleYamlScalarMap(yaml);
  if (meta.type?.toLowerCase() !== "initiative") return null;
  const laneId = meta.lane?.trim() ?? "";
  if (!laneId) return null;
  const planEnd = meta.target?.trim() || meta.plan_end?.trim() || null;
  const planStart = meta.plan_start?.trim() || null;
  return {
    issueNumber: 0,
    title: "",
    summaryNo: meta.summary_no?.trim() ?? "",
    explainerNo: meta.explainer_no?.trim() ?? "",
    planStart,
    planEnd,
    laneId,
    htmlUrl: "",
  };
}

export interface GitHubIssueLike {
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  pull_request?: unknown;
}

/** Build initiative read models from GitHub issue list; skips PRs and non-initiative bodies. */
export function initiativesFromGitHubIssues(issues: GitHubIssueLike[]): InitiativeReadModel[] {
  const out: InitiativeReadModel[] = [];
  for (const issue of issues) {
    if (issue.pull_request) continue;
    const body = issue.body ?? "";
    const parsed = parseInitiativeFromIssueBody(body);
    if (!parsed) continue;
    out.push({
      ...parsed,
      issueNumber: issue.number,
      title: issue.title,
      htmlUrl: issue.html_url,
    });
  }
  return out;
}

function laneOrderMap(manifest: LaneManifestV01): Map<string, number> {
  const m = new Map<string, number>();
  for (const lane of manifest.lanes) {
    m.set(lane.id, lane.order);
  }
  return m;
}

function laneLabelMap(manifest: LaneManifestV01): Map<string, string> {
  const m = new Map<string, string>();
  for (const lane of manifest.lanes) {
    m.set(lane.id, lane.label_no);
  }
  return m;
}

/** Group initiatives under manifest lanes; unknown lanes sort last by id. */
export function groupInitiativesByLane(
  manifest: LaneManifestV01,
  initiatives: InitiativeReadModel[],
): RoadmapLaneGroup[] {
  const orderOf = laneOrderMap(manifest);
  const labelOf = laneLabelMap(manifest);
  const byLane = new Map<string, InitiativeReadModel[]>();

  for (const init of initiatives) {
    const list = byLane.get(init.laneId);
    if (list) list.push(init);
    else byLane.set(init.laneId, [init]);
  }

  const sortInLane = (a: InitiativeReadModel, b: InitiativeReadModel) => {
    const da = a.planStart ?? "";
    const db = b.planStart ?? "";
    if (da !== db) return da.localeCompare(db);
    return a.issueNumber - b.issueNumber;
  };

  const laneIds = [...byLane.keys()].sort((a, b) => {
    const oa = orderOf.has(a) ? orderOf.get(a)! : 9999;
    const ob = orderOf.has(b) ? orderOf.get(b)! : 9999;
    if (oa !== ob) return oa - ob;
    return a.localeCompare(b);
  });

  const groups: RoadmapLaneGroup[] = [];
  for (const laneId of laneIds) {
    const items = byLane.get(laneId);
    if (!items) continue;
    items.sort(sortInLane);
    const labelNo = labelOf.get(laneId) ?? laneId;
    const order = orderOf.has(laneId) ? orderOf.get(laneId)! : 9999;
    groups.push({
      laneId,
      labelNo,
      order,
      initiatives: items,
    });
  }
  return groups;
}
