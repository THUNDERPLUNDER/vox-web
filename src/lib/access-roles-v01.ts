/* CONTRACT: Viddel Access v0.1 roles come from explicit server-side email allowlists. #457 */

export type AccessRole = "admin" | "partner";

function readEnv(name: string): string {
  return (process.env[name] ?? import.meta.env?.[name] ?? "").trim();
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function readEmailSet(name: string): Set<string> {
  return new Set(
    readEnv(name)
      .split(",")
      .map(normalizeEmail)
      .filter(Boolean),
  );
}

export function resolveAccessRole(email: string | null | undefined): AccessRole | null {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return null;

  const admins = readEmailSet("VIDDEL_ADMIN_EMAILS");
  if (admins.has(normalized)) return "admin";

  const partners = readEmailSet("VIDDEL_PARTNER_EMAILS");
  if (partners.has(normalized)) return "partner";

  return null;
}

export function canAccessRole(actual: AccessRole | null, required: AccessRole): boolean {
  if (!actual) return false;
  if (actual === "admin") return true;
  return required === "partner" && actual === "partner";
}
