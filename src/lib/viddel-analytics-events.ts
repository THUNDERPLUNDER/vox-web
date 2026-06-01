/* CONTRACT: Whitelist for PostHog v0.1 — event names and safe properties only. */

export const VIDDEL_ANALYTICS_EVENTS = [
  "chat_opened",
  "ai_entry_clicked",
  "article_ai_seed_clicked",
  "chat_question_sent",
  "chat_answer_success",
  "chat_answer_error",
  "chat_rate_limited",
  "chat_message_too_long",
] as const;

export type ViddelAnalyticsEvent = (typeof VIDDEL_ANALYTICS_EVENTS)[number];

export const VIDDEL_ANALYTICS_PROPERTIES = [
  "route",
  "entry_surface",
  "article_slug",
  "seed_id",
  "error_code",
  "environment",
  "input_type",
] as const;

export type ViddelAnalyticsProperty = (typeof VIDDEL_ANALYTICS_PROPERTIES)[number];

/** Stable id from seed text — never returns the question itself. */
export function seedIdFromLabel(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i += 1) {
    hash = (hash << 5) - hash + label.charCodeAt(i);
    hash |= 0;
  }
  return `s${Math.abs(hash).toString(36).slice(0, 10)}`;
}
