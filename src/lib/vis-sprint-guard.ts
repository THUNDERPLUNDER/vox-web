/* CONTRACT: VIS sprint guard — machine-readable rules for active vs closed sprint placement. */

import { mvpCurrentState, type ClosedSprint } from "../data/mvp-current-state.ts";
import { getVisFrontpageHubs } from "../data/vis-frontpage-hubs-v01.ts";

export type VisSprintPlacement = "control-room" | "hub-primary" | "archive";

/** Where an active sprint must appear on VIS — never archive. */
export function getVisSprintPlacement(sprintId: string): VisSprintPlacement {
  const current = mvpCurrentState.currentSprint;
  if (current.id === sprintId && current.status === "active") {
    return "control-room";
  }
  if (mvpCurrentState.closedSprints.some((s) => s.id === sprintId)) {
    return "archive";
  }
  if (current.id === sprintId && current.status === "closed") {
    return "archive";
  }
  return "hub-primary";
}

export function isActiveSprint(sprint: Pick<CurrentSprint, "status">): boolean {
  return sprint.status === "active";
}

/** Fail build if registry breaks sprint guard rules. */
export function validateVisSprintGuard(): string[] {
  const errors: string[] = [];
  const current = mvpCurrentState.currentSprint;

  if (!current.id || !current.route || !current.label) {
    errors.push("currentSprint must have id, route and label");
  }

  if (current.status === "active") {
    if (mvpCurrentState.closedSprints.some((s) => s.id === current.id)) {
      errors.push(`Active sprint "${current.id}" must not also appear in closedSprints`);
    }
    if (getVisSprintPlacement(current.id) === "archive") {
      errors.push(`Active sprint "${current.id}" must not resolve to archive placement`);
    }
  }

  if (current.status === "closed" && getVisSprintPlacement(current.id) !== "archive") {
    errors.push(`Closed currentSprint "${current.id}" must resolve to archive placement`);
  }

  for (const closed of mvpCurrentState.closedSprints) {
    if (closed.id === current.id && current.status === "active") {
      errors.push(`Sprint "${closed.id}" cannot be both active and closed`);
    }
  }

  const sprintHub = getVisFrontpageHubs("/").find((h) => h.id === "sprint");
  if (current.status === "active") {
    if (sprintHub?.availability === "historikk") {
      errors.push(`Active sprint "${current.id}" must not be exposed as historikk hub`);
    }
    if (sprintHub?.tier !== "primary") {
      errors.push(`Active sprint "${current.id}" must be a primary hub`);
    }
  }

  return errors;
}

export function getClosedSprintArchiveLinks(baseUrl: string): Array<{ id: string; label: string; href: string }> {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return mvpCurrentState.closedSprints.map((s: ClosedSprint) => ({
    id: s.id,
    label: s.label,
    href: `${base}${s.route.replace(/^\//, "")}`,
  }));
}
