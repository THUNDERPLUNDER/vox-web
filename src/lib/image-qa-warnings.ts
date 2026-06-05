/* CONTRACT: Dev-only warnings for image QA — corpus gaps, confidence, safety (INT-009 / #236). */

import type { ImageVisionBridgeResult } from "./image-vision-bridge-v01.ts";

const BODY_REJECTION = /øre|hud|kropp|ansikt|medisin|sår/i;

/** Build operator-facing warnings for the dev QA UI — no image bytes. */
export function buildImageQaWarnings(
  vision: ImageVisionBridgeResult,
  scenario?: string,
): string[] {
  const warnings: string[] = [];
  const rag = vision.rag_query_text.toLowerCase();
  const device = vision.visible_device_type.toLowerCase();
  const component = vision.visible_component.toLowerCase();

  if (
    scenario === "A" ||
    /lade|lader|charg|statuslys|led/.test(rag + device + component) ||
    vision.visible_status_light.trim()
  ) {
    warnings.push(
      "Corpus-gap: lader/statuslys er svakt dekket i HearingNorwaystore — RAG-svar kan være tynt selv med god vision.",
    );
  }

  if (vision.confidence === "low") {
    warnings.push("Lav confidence — be brukeren ta nytt, klart bilde av utstyr alene (ikke øre/hud/kropp).");
  }

  if (vision.possible_brand && vision.confidence === "high" && !vision.readable_text.trim()) {
    warnings.push("Merke/modell satt med high confidence uten lesbar tekst — verifiser mot faktisk bilde.");
  }

  for (const note of vision.safety_notes) {
    if (note.trim()) warnings.push(note.trim());
  }

  const combined = [
    vision.likely_user_problem,
    vision.rag_query_text,
    ...vision.safety_notes,
  ].join(" ");
  if (BODY_REJECTION.test(combined)) {
    warnings.push("Mulig avvisning av kropp/øre/hud-innhold — sjekk at kun utstyr analyseres.");
  }

  return [...new Set(warnings)];
}
