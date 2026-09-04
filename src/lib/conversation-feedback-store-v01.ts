/* CONTRACT: Dedicated Neon store for Conversation Feedback v0.1 only. No chat/session content. #346 */
import { neon } from "@neondatabase/serverless";
import type { ConversationFeedbackInput } from "./conversation-feedback-v01.ts";
import { CONVERSATION_FEEDBACK_RETENTION_DAYS } from "./conversation-feedback-v01.ts";

type FeedbackSql = ReturnType<typeof neon>;

let schemaReady: Promise<void> | null = null;

function readFeedbackDatabaseUrl(): string {
  return (
    process.env.FEEDBACK_DATABASE_DATABASE_URL ??
    process.env.FEEDBACK_DATABASE_URL ??
    import.meta.env.FEEDBACK_DATABASE_DATABASE_URL ??
    import.meta.env.FEEDBACK_DATABASE_URL ??
    ""
  ).trim();
}

function getFeedbackSql(): FeedbackSql {
  const url = readFeedbackDatabaseUrl();
  if (!url) throw new Error("feedback_store_unavailable");
  return neon(url);
}

async function ensureFeedbackSchema(sql: FeedbackSql): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS conversation_feedback (
          id BIGSERIAL PRIMARY KEY,
          feedback_reference VARCHAR(64) NOT NULL UNIQUE,
          score VARCHAR(16) NOT NULL CHECK (score IN ('helpful', 'partial', 'not_helpful')),
          selected_reasons JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(selected_reasons) = 'array'),
          optional_comment VARCHAR(500),
          submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          route VARCHAR(120) NOT NULL,
          environment VARCHAR(20) NOT NULL
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS conversation_feedback_submitted_at_idx
        ON conversation_feedback (submitted_at)
      `;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

export async function saveConversationFeedback(
  input: ConversationFeedbackInput,
  environment: string,
): Promise<void> {
  const sql = getFeedbackSql();
  await ensureFeedbackSchema(sql);
  const reasons = JSON.stringify(input.selectedReasons);

  await sql`
    INSERT INTO conversation_feedback (
      feedback_reference,
      score,
      selected_reasons,
      optional_comment,
      route,
      environment
    ) VALUES (
      ${input.feedbackReference},
      ${input.score},
      ${reasons}::jsonb,
      ${input.optionalComment},
      ${input.route},
      ${environment}
    )
    ON CONFLICT (feedback_reference) DO UPDATE SET
      score = EXCLUDED.score,
      selected_reasons = EXCLUDED.selected_reasons,
      optional_comment = EXCLUDED.optional_comment,
      submitted_at = NOW(),
      route = EXCLUDED.route,
      environment = EXCLUDED.environment
  `;
}

export async function deleteExpiredConversationFeedback(): Promise<number> {
  const sql = getFeedbackSql();
  await ensureFeedbackSchema(sql);
  const rows = await sql`
    DELETE FROM conversation_feedback
    WHERE submitted_at < NOW() - (${CONVERSATION_FEEDBACK_RETENTION_DAYS} * INTERVAL '1 day')
    RETURNING id
  `;
  return rows.length;
}
