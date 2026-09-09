/* CONTRACT: Preview AI is open; every other environment fails closed behind the Production flag. */

import { flagsClient } from "@vercel/flags-core";
import { isVercelPreview } from "./vercel-environment.ts";

export const PUBLIC_AI_FLAG = "public-ai-enabled";

export type PublicAiState = {
  enabled: boolean;
  available: boolean;
};

/** Missing/unavailable flag state fails closed for public traffic. */
export async function getPublicAiState(
  evaluateFlag: () => Promise<boolean> = async () => {
    const result = await flagsClient.evaluate<boolean>(PUBLIC_AI_FLAG, false);
    return result.value === true;
  },
): Promise<PublicAiState> {
  try {
    return { enabled: (await evaluateFlag()) === true, available: true };
  } catch {
    console.error("[public-ai-access] vercel_flag_read_failed", { flag: PUBLIC_AI_FLAG });
    return { enabled: false, available: false };
  }
}

export async function canUsePublicAi(
  evaluateFlag?: () => Promise<boolean>,
  environment = process.env.VERCEL_ENV,
): Promise<boolean> {
  if (isVercelPreview(environment)) return true;
  const state = await getPublicAiState(evaluateFlag);
  return state.enabled;
}
