/* CONTRACT: Conversation Feedback v0.1 — bounded, transcript-free beta QA payload. #346 */

export const CONVERSATION_FEEDBACK_SCORES = ["helpful", "partial", "not_helpful"] as const;
export const CONVERSATION_FEEDBACK_REASONS = [
  "incorrect",
  "too_long",
  "tone_missed",
  "misunderstood",
  "wrong_next_step",
  "other",
] as const;

export type ConversationFeedbackScore = (typeof CONVERSATION_FEEDBACK_SCORES)[number];
export type ConversationFeedbackReason = (typeof CONVERSATION_FEEDBACK_REASONS)[number];

export const CONVERSATION_FEEDBACK_COMMENT_MAX_LENGTH = 500;
export const CONVERSATION_FEEDBACK_RETENTION_DAYS = 90;
export const CONVERSATION_FEEDBACK_MAX_BODY_BYTES = 5_000;

const FEEDBACK_REFERENCE_PATTERN = /^feedback-[a-f0-9]{32}$/;
const SCORE_SET = new Set<string>(CONVERSATION_FEEDBACK_SCORES);
const REASON_SET = new Set<string>(CONVERSATION_FEEDBACK_REASONS);
const ALLOWED_ROUTES = new Set(["/no/chat", "/no/chat/"]);
const ALLOWED_FIELDS = new Set([
  "feedback_reference",
  "score",
  "selected_reasons",
  "optional_comment",
  "route",
]);

export type ConversationFeedbackInput = {
  feedbackReference: string;
  score: ConversationFeedbackScore;
  selectedReasons: ConversationFeedbackReason[];
  optionalComment: string | null;
  route: "/no/chat/";
};

type ValidationResult =
  | { ok: true; value: ConversationFeedbackInput }
  | { ok: false; error: "invalid_feedback" | "comment_too_long" };

export function validateConversationFeedback(value: unknown): ValidationResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "invalid_feedback" };
  }

  const body = value as Record<string, unknown>;
  if (Object.keys(body).some((field) => !ALLOWED_FIELDS.has(field))) {
    return { ok: false, error: "invalid_feedback" };
  }
  const feedbackReference = typeof body.feedback_reference === "string" ? body.feedback_reference.trim() : "";
  const score = typeof body.score === "string" ? body.score.trim() : "";
  const route = typeof body.route === "string" ? body.route.trim() : "";
  const comment = typeof body.optional_comment === "string" ? body.optional_comment.trim() : "";

  if (!FEEDBACK_REFERENCE_PATTERN.test(feedbackReference) || !SCORE_SET.has(score) || !ALLOWED_ROUTES.has(route)) {
    return { ok: false, error: "invalid_feedback" };
  }

  if (comment.length > CONVERSATION_FEEDBACK_COMMENT_MAX_LENGTH) {
    return { ok: false, error: "comment_too_long" };
  }

  if (!Array.isArray(body.selected_reasons) || body.selected_reasons.length > CONVERSATION_FEEDBACK_REASONS.length) {
    return { ok: false, error: "invalid_feedback" };
  }

  const reasons = body.selected_reasons.map((reason) => (typeof reason === "string" ? reason.trim() : ""));
  if (reasons.some((reason) => !REASON_SET.has(reason)) || new Set(reasons).size !== reasons.length) {
    return { ok: false, error: "invalid_feedback" };
  }

  return {
    ok: true,
    value: {
      feedbackReference,
      score: score as ConversationFeedbackScore,
      selectedReasons: reasons as ConversationFeedbackReason[],
      optionalComment: comment || null,
      route: "/no/chat/",
    },
  };
}

export function resolveFeedbackEnvironment(): string {
  const value = (process.env.VERCEL_ENV ?? import.meta.env.MODE ?? "development").trim();
  return value === "production" || value === "preview" ? value : "development";
}
