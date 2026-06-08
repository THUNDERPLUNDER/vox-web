/* CONTRACT: Lab-only — compose rich /api/chat message from vision JSON + user text (#242). Not used in /no/chat. */
import type { ImageVisionBridgeResult } from "./image-vision-bridge-v01.ts";

const CHAT_INSTRUCTION =
  "Svar brukeren direkte. Skill mellom det som kan ses i bildet og det som ikke kan fastslås. Ikke påstå eksakt modell uten lesbar tekst.";

function formatScalar(value: string): string {
  const trimmed = value.trim();
  return trimmed || "ikke oppgitt / ukjent";
}

function formatList(items: string[]): string {
  const filtered = items.map((item) => item.trim()).filter(Boolean);
  if (filtered.length === 0) return "ingen";
  return filtered.map((item) => `  • ${item}`).join("\n");
}

/** Build Lab image-QA message for POST /api/chat — vision context + user question, contract unchanged. */
export function composeLabImageQaChatMessage(
  vision: ImageVisionBridgeResult,
  userProblem: string,
): string {
  const lines: string[] = [
    "[Lab bildeanalyse — svar brukeren basert på disse observasjonene]",
    "",
    "INSTRUKS TIL VIDEL:",
    CHAT_INSTRUCTION,
    "",
  ];

  const problem = userProblem.trim();
  if (problem) {
    lines.push("BRUKERENS SPØRSMÅL / PROBLEM:", problem, "");
  }

  lines.push(
    "OBSERVASJONER FRA BILDET:",
    `- Synlig utstyrstype: ${formatScalar(vision.visible_device_type)}`,
    `- Mulig merke: ${formatScalar(vision.possible_brand)}`,
    `- Lesbar tekst i bildet: ${formatScalar(vision.readable_text)}`,
    `- Synlig komponent/del: ${formatScalar(vision.visible_component)}`,
    `- Synlig statuslys: ${formatScalar(vision.visible_status_light)}`,
    `- Confidence (vision): ${vision.confidence}`,
    "",
    "FORESLÅTTE OPPFØLGINGSSPØRSMÅL (fra vision):",
    formatList(vision.suggested_followup_questions),
    "",
    "SIKKERHETS-/AVGRENSNINGSMERKNADER:",
    formatList(vision.safety_notes),
  );

  const rag = vision.rag_query_text.trim();
  if (rag) {
    lines.push("", "RAG-SPØRRING (til oppslag i manualer):", rag);
  }

  lines.push(
    "",
    "OPPGAVE:",
    problem
      ? `Svar brukeren på spørsmålet/problemet over, med utgangspunkt i observasjonene. Si tydelig hva som kan sees, hva som er usikkert, og be om nærbilde av tekst/merking eller bedre vinkel hvis modell ikke kan fastslås.`
      : "Svar brukeren basert på observasjonene. Si tydelig hva som kan sees, hva som er usikkert, og be om nærbilde av tekst/merking eller bedre vinkel hvis modell ikke kan fastslås.",
  );

  return lines.join("\n");
}
