/* CONTRACT: VIS frontpage hub definitions v0.1 — delegates to vis-navigation-v01 (single source). */

export type { VisHubAvailability, VisHubTier, VisFrontpageHub } from "./vis-navigation-v01.ts";

export {
  visFrontpageMandate,
  visPrimaryNextWorkIds,
  visSourceOfTruthNotes,
} from "./vis-navigation-v01.ts";

import { getVisHubEntriesFromNav } from "../lib/vis-navigation.ts";

/** Main hubs on VIS frontpage — derived from navigation registry. */
export function getVisFrontpageHubs(baseUrl: string) {
  return getVisHubEntriesFromNav(baseUrl);
}
