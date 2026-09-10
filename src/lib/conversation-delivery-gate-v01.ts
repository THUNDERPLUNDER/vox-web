/* CONTRACT: Explicit semantic PASS only; one bounded repair; then fixed non-specific fallback. */

import {
  activeScopedCorrections,
  effectiveEstablishedContext,
  type ConversationPolicy,
} from "./conversation-policy-v01.ts";
import type { ConversationState } from "./conversation-state-token-v01.ts";
import {
  runConversationVertexJson,
  type ConversationVertexConfig,
} from "./conversation-vertex-json-v01.ts";

export const CONVERSATION_SAFE_FALLBACK =
  "Jeg vil holde meg til det du faktisk har fortalt, uten å gjette på utstyr eller deler. Hva er viktigst å få hjelp med akkurat nå?";

export type DeliveryEvaluation = {
  decision: "PASS" | "FAIL";
  activeSituationPreserved: boolean;
  correctionHonored: boolean;
  noUnsupportedProductContext: boolean;
  policyScopeMatched: boolean;
  usefulAndSafe: boolean;
};

export type DeliveryPipelineResult = {
  text: string;
  outcome: "candidate" | "repaired" | "fallback";
  repairAttempts: 0 | 1;
};

export type DeliveryEvaluator = (text: string) => Promise<unknown>;
export type DeliveryRepairer = (text: string) => Promise<string>;

const ACTIVE_SITUATION_RECALL_PATTERN =
  /\b(?:hva\s+(?:var|er)\s+det\s+jeg\s+(?:slet|sliter)\s+med|hva\s+(?:slet|sliter)\s+jeg\s+med|minn\s+meg\s+på\s+hva\s+jeg\s+(?:slet|sliter)\s+med)\b/iu;
const SOCIAL_LISTENING_SITUATION_PATTERN =
  /\b(?:flere\s+(?:som\s+)?snakker|flere\s+stemm(?:er|ene)|stemm(?:e|en|er|ene)|samtale(?:n|r)?|rundt\s+bordet|mister\s+tråden)\b/iu;
const COMPONENT_TROUBLESHOOTING_PATTERN =
  /\b(?:voksfilter(?:et|e|ne)?|ørevoks|voks|filter(?:et|e|ne)?|dome(?:n|r|ne)?|lydutgang(?:en)?|rengjør(?:e|ing|es)?|blokkering(?:en)?|blokkert|smuss|komponent(?:en|er|ene)?)\b/iu;

export function buildActiveSituationRecallResponse(
  state: ConversationState,
  currentMessage: string,
): string | null {
  if (!ACTIVE_SITUATION_RECALL_PATTERN.test(currentMessage)) return null;
  const summary = state.activeSituation?.summary.trim().replace(/[.!?]+$/u, "");
  if (!summary) return null;
  const naturalSummary = `${summary.charAt(0).toLocaleLowerCase("nb-NO")}${summary.slice(1)}`;
  return `Du fortalte at ${naturalSummary}.`;
}

export function introducesUnestablishedComponentTroubleshooting(
  state: ConversationState,
  currentMessage: string,
  candidate: string,
): boolean {
  const activeSituation = [
    state.activeSituation?.summary ?? "",
    state.activeSituation?.provenance.quote ?? "",
  ].join(" ");
  return (
    SOCIAL_LISTENING_SITUATION_PATTERN.test(activeSituation) &&
    !COMPONENT_TROUBLESHOOTING_PATTERN.test(currentMessage) &&
    COMPONENT_TROUBLESHOOTING_PATTERN.test(candidate)
  );
}

export function parseDeliveryEvaluation(raw: unknown): DeliveryEvaluation {
  const value = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  const explicitPass =
    value.decision === "PASS" &&
    value.activeSituationPreserved === true &&
    value.correctionHonored === true &&
    value.noUnsupportedProductContext === true &&
    value.policyScopeMatched === true &&
    value.usefulAndSafe === true;
  return {
    decision: explicitPass ? "PASS" : "FAIL",
    activeSituationPreserved: value.activeSituationPreserved === true,
    correctionHonored: value.correctionHonored === true,
    noUnsupportedProductContext: value.noUnsupportedProductContext === true,
    policyScopeMatched: value.policyScopeMatched === true,
    usefulAndSafe: value.usefulAndSafe === true,
  };
}

export async function runDeliveryPipeline(
  candidate: string,
  evaluate: DeliveryEvaluator,
  repair: DeliveryRepairer,
): Promise<DeliveryPipelineResult> {
  let first: DeliveryEvaluation;
  try {
    first = parseDeliveryEvaluation(await evaluate(candidate));
  } catch {
    first = parseDeliveryEvaluation(null);
  }
  if (first.decision === "PASS") {
    return { text: candidate, outcome: "candidate", repairAttempts: 0 };
  }

  let repaired = "";
  try {
    repaired = (await repair(candidate)).trim();
  } catch {
    repaired = "";
  }
  if (!repaired) return { text: CONVERSATION_SAFE_FALLBACK, outcome: "fallback", repairAttempts: 1 };

  try {
    const second = parseDeliveryEvaluation(await evaluate(repaired));
    if (second.decision === "PASS") {
      return { text: repaired, outcome: "repaired", repairAttempts: 1 };
    }
  } catch {
    // Fail closed to the fixed fallback.
  }
  return { text: CONVERSATION_SAFE_FALLBACK, outcome: "fallback", repairAttempts: 1 };
}

function deliveryContext(
  state: ConversationState,
  policy: ConversationPolicy,
  currentMessage: string,
): string {
  return JSON.stringify({
    currentMessage,
    activeSituation: state.activeSituation,
    establishedContext: effectiveEstablishedContext(state),
    corrections: activeScopedCorrections(state),
    policy,
  });
}

function evaluationPrompt(
  state: ConversationState,
  policy: ConversationPolicy,
  currentMessage: string,
  candidate: string,
): string {
  return [
    "Du er Viddels pre-delivery policy gate. Evaluer semantisk og svar KUN med JSON.",
    "PASS er bare tillatt når alle fem kriterier er eksplisitt sanne. Ved tvil: FAIL.",
    "Kriterier: aktiv situasjon bevares; verifiserte korreksjoner respekteres; ingen uetablert bruker-, utstyrs- eller produktpremiss introduseres; policy-scope følges; svaret er nyttig og trygt.",
    "JSON-format:",
    JSON.stringify({
      decision: "PASS|FAIL",
      activeSituationPreserved: false,
      correctionHonored: false,
      noUnsupportedProductContext: false,
      policyScopeMatched: false,
      usefulAndSafe: false,
    }),
    `STATE OG POLICY: ${deliveryContext(state, policy, currentMessage)}`,
    `SVARKANDIDAT: ${JSON.stringify(candidate)}`,
  ].join("\n");
}

function repairPrompt(
  state: ConversationState,
  policy: ConversationPolicy,
  currentMessage: string,
  candidate: string,
): string {
  return [
    "Du gjør NØYAKTIG ÉN avgrenset reparasjon av en Viddel-svarkandidat. Svar KUN med JSON {\"text\":\"...\"}.",
    "Bevar nyttig generell hjelp og aktiv situasjon. Respekter korreksjoner.",
    policy.productSpecificAllowed
      ? "Behold bare produktdetaljer som matcher eksplisitt etablert og relevant merke/modell."
      : "Fjern all uetablert utstyrs- og produktspesifisitet.",
    ...(!policy.productSpecificAllowed && introducesUnestablishedComponentTroubleshooting(state, currentMessage, candidate)
      ? ["Fjern filter-, voks-, rengjørings-, lydutgang- og annen komponentfeilsøking. Den er ikke etablert av brukeren; hjelpen skal styres av den aktive tale-/samtalesituasjonen."]
      : []),
    "Ikke legg til nye antakelser. Maks ett nøytralt oppklaringsspørsmål dersom nødvendig.",
    `STATE OG POLICY: ${deliveryContext(state, policy, currentMessage)}`,
    `ORIGINAL SVARKANDIDAT: ${JSON.stringify(candidate)}`,
  ].join("\n");
}

function extractRepairText(raw: unknown): string {
  if (!raw || typeof raw !== "object") return "";
  return typeof (raw as Record<string, unknown>).text === "string"
    ? ((raw as Record<string, string>).text || "").trim()
    : "";
}

export async function enforceConversationDeliveryPolicy(
  config: ConversationVertexConfig,
  state: ConversationState,
  policy: ConversationPolicy,
  currentMessage: string,
  candidate: string,
): Promise<DeliveryPipelineResult> {
  const activeSituationRecall = buildActiveSituationRecallResponse(state, currentMessage);
  if (activeSituationRecall) {
    return { text: activeSituationRecall, outcome: "candidate", repairAttempts: 0 };
  }

  return runDeliveryPipeline(
    candidate,
    (text) => {
      if (
        !policy.productSpecificAllowed &&
        introducesUnestablishedComponentTroubleshooting(state, currentMessage, text)
      ) {
        return Promise.resolve({
          decision: "FAIL",
          activeSituationPreserved: false,
          correctionHonored: true,
          noUnsupportedProductContext: false,
          policyScopeMatched: false,
          usefulAndSafe: false,
        });
      }
      return runConversationVertexJson(config, evaluationPrompt(state, policy, currentMessage, text));
    },
    async (text) => extractRepairText(
      await runConversationVertexJson(config, repairPrompt(state, policy, currentMessage, text)),
    ),
  );
}
