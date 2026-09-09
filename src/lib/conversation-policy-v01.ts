/* CONTRACT: Model proposes turn state; deterministic evidence rules own authority and retrieval policy. */

import type {
  ConversationState,
  EstablishedContext,
  ScopedCorrection,
} from "./conversation-state-token-v01.ts";
import {
  runConversationVertexJson,
  type ConversationVertexConfig,
} from "./conversation-vertex-json-v01.ts";

export type ConversationPolicyMode = "general_help" | "clarify" | "product_specific_allowed";
export const GENERAL_KNOWLEDGE_FILTER = 'knowledge_scope: ANY("general")';

export type ConversationPolicy = {
  mode: ConversationPolicyMode;
  productSpecificAllowed: boolean;
  reason: "general_default" | "clarification_needed" | "established_relevant_product";
};

type ProposedEvidence = {
  summary?: unknown;
  evidence?: unknown;
};

type StateUpdateCandidate = {
  activeSituation?: ProposedEvidence & { certainty?: unknown };
  establishedContext?: Array<
    ProposedEvidence & { kind?: unknown; brand?: unknown; model?: unknown }
  >;
  corrections?: Array<
    ProposedEvidence & { target?: unknown; scope?: unknown }
  >;
  requestedMode?: unknown;
  productContextRelevant?: unknown;
  clarificationNeeded?: unknown;
};

export type ConversationTurn = {
  state: ConversationState;
  policy: ConversationPolicy;
  authorityFrame: string;
  stateUpdateSource: "model_validated" | "safe_default";
};

export function conversationRetrievalFilter(productSpecificAllowed: boolean): string | null {
  return productSpecificAllowed ? null : GENERAL_KNOWLEDGE_FILTER;
}

export function activeScopedCorrections(state: ConversationState): ScopedCorrection[] {
  const activeTurnIndex = state.activeSituation?.provenance.turnIndex ?? null;
  return state.corrections.filter((item) => item.scopeTurnIndex === activeTurnIndex);
}

export function effectiveEstablishedContext(state: ConversationState): EstablishedContext[] {
  const corrections = activeScopedCorrections(state);
  return state.establishedContext.filter((item) => !corrections.some((correction) => {
    if (correction.provenance.turnIndex < item.provenance.turnIndex) return false;
    return [item.summary, item.brand ?? "", item.model ?? ""].some((value) =>
      containsLiteral(value, correction.target));
  }));
}

function shortString(value: unknown, maxLength = 320): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function hasExactEvidence(message: string, evidence: string): boolean {
  return Boolean(evidence) && message.includes(evidence);
}

function containsLiteral(haystack: string, needle: string): boolean {
  return Boolean(needle) && haystack.toLocaleLowerCase("nb-NO").includes(needle.toLocaleLowerCase("nb-NO"));
}

function addUniqueContext(
  existing: EstablishedContext[],
  additions: EstablishedContext[],
): EstablishedContext[] {
  const items = [...existing];
  for (const item of additions) {
    const key = `${item.kind}:${item.summary}:${item.brand ?? ""}:${item.model ?? ""}`.toLocaleLowerCase("nb-NO");
    const existingIndex = items.findIndex((current) => `${current.kind}:${current.summary}:${current.brand ?? ""}:${current.model ?? ""}`.toLocaleLowerCase("nb-NO") === key);
    if (existingIndex >= 0) {
      items[existingIndex] = item;
    } else {
      items.push(item);
    }
  }
  return items.slice(-6);
}

export function validateStateUpdateCandidate(
  previous: ConversationState,
  rawCandidate: unknown,
  message: string,
  turnIndex: number,
): { state: ConversationState; policy: ConversationPolicy } {
  const candidate = rawCandidate && typeof rawCandidate === "object"
    ? rawCandidate as StateUpdateCandidate
    : {};
  const provenance = (quote: string) => ({ source: "user" as const, quote, turnIndex });

  let activeSituation = previous.activeSituation;
  const activeSummary = shortString(candidate.activeSituation?.summary);
  const activeEvidence = shortString(candidate.activeSituation?.evidence);
  if (
    candidate.activeSituation?.certainty === "clear" &&
    activeSummary &&
    hasExactEvidence(message, activeEvidence)
  ) {
    activeSituation = { summary: activeSummary, provenance: provenance(activeEvidence) };
  }

  const newContext: EstablishedContext[] = [];
  if (Array.isArray(candidate.establishedContext)) {
    for (const proposed of candidate.establishedContext.slice(0, 4)) {
      const kind = proposed?.kind === "product" ? "product" : proposed?.kind === "general" ? "general" : null;
      const summary = shortString(proposed?.summary);
      const evidence = shortString(proposed?.evidence);
      if (!kind || !summary || !hasExactEvidence(message, evidence)) continue;
      if (kind === "product") {
        const brand = shortString(proposed?.brand, 100);
        const model = shortString(proposed?.model, 140);
        if (!brand || !model || !containsLiteral(evidence, brand) || !containsLiteral(evidence, model)) continue;
        newContext.push({ kind, summary, brand, model, provenance: provenance(evidence) });
      } else {
        newContext.push({ kind, summary, provenance: provenance(evidence) });
      }
    }
  }

  const newCorrections: ScopedCorrection[] = [];
  if (Array.isArray(candidate.corrections)) {
    for (const proposed of candidate.corrections.slice(0, 3)) {
      const summary = shortString(proposed?.summary);
      const evidence = shortString(proposed?.evidence);
      const target = shortString(proposed?.target);
      const targetIsGrounded =
        containsLiteral(evidence, target) ||
        containsLiteral(previous.lastDeliveryContext ?? "", target);
      if (
        !summary ||
        !target ||
        proposed?.scope !== "current_situation" ||
        !hasExactEvidence(message, evidence) ||
        !targetIsGrounded
      ) continue;
      newCorrections.push({
        summary,
        target,
        scope: "current_situation",
        scopeTurnIndex: activeSituation?.provenance.turnIndex ?? null,
        provenance: provenance(evidence),
      });
    }
  }

  const state: ConversationState = {
    activeSituation,
    establishedContext: addUniqueContext(previous.establishedContext, newContext),
    corrections: [...previous.corrections, ...newCorrections].slice(-4),
    lastDeliveryContext: previous.lastDeliveryContext,
  };

  const relevantProduct = effectiveEstablishedContext(state).some(
    (item) => item.kind === "product" && Boolean(item.brand) && Boolean(item.model),
  );
  if (
    candidate.requestedMode === "product_specific" &&
    candidate.productContextRelevant === true &&
    relevantProduct
  ) {
    return {
      state,
      policy: {
        mode: "product_specific_allowed",
        productSpecificAllowed: true,
        reason: "established_relevant_product",
      },
    };
  }
  if (candidate.requestedMode === "clarify" && candidate.clarificationNeeded === true) {
    return {
      state,
      policy: {
        mode: "clarify",
        productSpecificAllowed: false,
        reason: "clarification_needed",
      },
    };
  }
  return {
    state,
    policy: {
      mode: "general_help",
      productSpecificAllowed: false,
      reason: "general_default",
    },
  };
}

function buildStateUpdatePrompt(previous: ConversationState, message: string): string {
  return [
    "Du er et avgrenset state-forslagstrinn for Viddel. Svar KUN med JSON.",
    "Foreslå, men avgjør ikke autoritet. Serveren validerer alle nye fakta mot eksakt sitat fra NÅVÆRENDE brukermelding.",
    "Assistentens forrige svar kan være korreksjonsmål, aldri evidens.",
    "Ikke klassifiser et uklart objekt som et bestemt produkt eller en bestemt komponent.",
    "Produktkontekst krever eksplisitt merke OG modell i nåværende eller verifisert tidligere brukertekst.",
    "Ukjent produkt skal ikke kreve oppklaring dersom generell situasjonshjelp er mulig.",
    "Korreksjoner skal alltid ha scope=current_situation, aldri globalt.",
    "JSON-format:",
    JSON.stringify({
      activeSituation: { summary: "", evidence: "eksakt sitat", certainty: "clear|ambiguous" },
      establishedContext: [{ kind: "general|product", summary: "", brand: "", model: "", evidence: "eksakt sitat" }],
      corrections: [{ summary: "", target: "", scope: "current_situation", evidence: "eksakt sitat" }],
      requestedMode: "general_help|clarify|product_specific",
      productContextRelevant: false,
      clarificationNeeded: false,
    }),
    `FORRIGE VERIFISERTE STATE: ${JSON.stringify(previous)}`,
    `NÅVÆRENDE BRUKERMELDING: ${JSON.stringify(message)}`,
  ].join("\n");
}

export function buildConversationAuthorityFrame(
  state: ConversationState,
  policy: ConversationPolicy,
  currentMessage: string,
): string {
  const active = state.activeSituation
    ? `${state.activeSituation.summary} [brukersitat: ${JSON.stringify(state.activeSituation.provenance.quote)}]`
    : "ikke etablert";
  const establishedContext = effectiveEstablishedContext(state);
  const correctionsForActiveSituation = activeScopedCorrections(state);
  const context = establishedContext.length
    ? establishedContext.map((item) => `${item.kind}: ${item.summary} [brukersitat: ${JSON.stringify(item.provenance.quote)}]`).join("; ")
    : "ingen etablert kontekst";
  const corrections = correctionsForActiveSituation.length
    ? correctionsForActiveSituation.map((item) => `${item.summary} (gjelder bare aktiv situasjon) [brukersitat: ${JSON.stringify(item.provenance.quote)}]`).join("; ")
    : "ingen";
  return [
    "VIDDEL TURN AUTHORITY FRAME (dynamisk, avgrenset; overstyrer ikke Response Contract v0.3):",
    `Nåværende brukermelding er høyeste autoritet: ${JSON.stringify(currentMessage)}`,
    `Aktiv situasjon: ${active}`,
    `Relevant etablert kontekst: ${context}`,
    `Verifiserte korreksjoner: ${corrections}`,
    `Policy: ${policy.mode}.`,
    policy.productSpecificAllowed
      ? "Produktspesifikk hjelp er tillatt bare for eksplisitt etablert og relevant merke/modell."
      : "Gi generell situasjonshjelp. Ikke introduser uetablert utstyrs- eller produktkontekst.",
  ].join("\n");
}

export async function deriveConversationTurn(
  config: ConversationVertexConfig,
  previous: ConversationState,
  message: string,
  turnIndex: number,
): Promise<ConversationTurn> {
  try {
    const candidate = await runConversationVertexJson(config, buildStateUpdatePrompt(previous, message));
    const validated = validateStateUpdateCandidate(previous, candidate, message, turnIndex);
    return {
      ...validated,
      authorityFrame: buildConversationAuthorityFrame(validated.state, validated.policy, message),
      stateUpdateSource: "model_validated",
    };
  } catch {
    const policy: ConversationPolicy = {
      mode: "general_help",
      productSpecificAllowed: false,
      reason: "general_default",
    };
    return {
      state: previous,
      policy,
      authorityFrame: buildConversationAuthorityFrame(previous, policy, message),
      stateUpdateSource: "safe_default",
    };
  }
}
