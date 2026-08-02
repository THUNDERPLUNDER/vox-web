import assert from "node:assert/strict";
import { conversationPrototypeData } from "../src/data/conversation-prototype-v01.ts";
import {
  countStatusPointsInRange,
  getStatusPeriodRange,
  getStatusPointSources,
  statusDraftGroups,
} from "../src/data/status-audiologist-prototype-v01.ts";

const conversationsById = new Map(conversationPrototypeData.map((conversation) => [conversation.id, conversation]));
const points = statusDraftGroups.flatMap((group) => group.points);

for (const point of points) {
  assert.ok(point.sourceConversationIds.length, `${point.id} mangler kildesamtale`);
  for (const sourceId of point.sourceConversationIds) {
    assert.ok(conversationsById.has(sourceId), `${point.id} peker til ukjent samtale ${sourceId}`);
  }
}

const defaultRange = getStatusPeriodRange("30-days");
assert.equal(countStatusPointsInRange(defaultRange), 6, "Standardperioden skal gi seks statuspunkter");

const narrowRange = getStatusPeriodRange("custom", "2026-07-24", "2026-07-31");
assert.equal(countStatusPointsInRange(narrowRange), 5, "Smal periode skal filtrere bort musikkpunktet");

const settings = points.find((point) => point.id === "settings");
assert.ok(settings, "Innstillingspunktet mangler");
assert.deepEqual(
  getStatusPointSources(settings, narrowRange).map((source) => source.id),
  ["sharp-sound"],
  "Et punkt med flere kilder skal bare vise kilder innenfor valgt periode",
);

console.log("Status til audiograf datakontrakt OK");
