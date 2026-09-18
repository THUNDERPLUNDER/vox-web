/* CONTRACT: public_interest_signup table in the shared Neon input resource. No chat, feedback or health linkage. #453 */
import { neon } from "@neondatabase/serverless";
import type { InterestSignupInput } from "./interest-signup-v01.ts";

type InputSql = ReturnType<typeof neon>;

let schemaReady: Promise<void> | null = null;

function readInputDatabaseUrl(): string {
  return (
    process.env.FEEDBACK_DATABASE_DATABASE_URL ??
    process.env.FEEDBACK_DATABASE_URL ??
    import.meta.env.FEEDBACK_DATABASE_DATABASE_URL ??
    import.meta.env.FEEDBACK_DATABASE_URL ??
    ""
  ).trim();
}

function getInputSql(): InputSql {
  const url = readInputDatabaseUrl();
  if (!url) throw new Error("interest_store_unavailable");
  return neon(url);
}

async function ensureInterestSchema(sql: InputSql): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS public_interest_signup (
          id BIGSERIAL PRIMARY KEY,
          email VARCHAR(254) NOT NULL UNIQUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          consent_version VARCHAR(80) NOT NULL,
          source VARCHAR(40) NOT NULL CHECK (source = 'public_home'),
          environment VARCHAR(20) NOT NULL
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS public_interest_signup_created_at_idx
        ON public_interest_signup (created_at)
      `;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }

  await schemaReady;
}

export async function saveInterestSignup(
  input: InterestSignupInput,
  environment: string,
): Promise<void> {
  const sql = getInputSql();
  await ensureInterestSchema(sql);

  await sql`
    INSERT INTO public_interest_signup (
      email,
      consent_version,
      source,
      environment
    ) VALUES (
      ${input.email},
      ${input.consentVersion},
      ${input.source},
      ${environment}
    )
    ON CONFLICT (email) DO UPDATE SET
      consent_at = NOW(),
      consent_version = EXCLUDED.consent_version,
      source = EXCLUDED.source,
      environment = EXCLUDED.environment
  `;
}
