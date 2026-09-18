import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

process.env.VIDDEL_ADMIN_EMAILS = "thomas@example.com, admin@example.com";
process.env.VIDDEL_PARTNER_EMAILS = "partner@example.com, thomas@example.com";

const roles = await import("../src/lib/access-roles-v01.ts");

assert.equal(roles.resolveAccessRole("THOMAS@example.com"), "admin");
assert.equal(roles.resolveAccessRole("partner@example.com"), "partner");
assert.equal(roles.resolveAccessRole("unknown@example.com"), null);
assert.equal(roles.canAccessRole("admin", "partner"), true);
assert.equal(roles.canAccessRole("admin", "admin"), true);
assert.equal(roles.canAccessRole("partner", "partner"), true);
assert.equal(roles.canAccessRole("partner", "admin"), false);

const requiredFiles = [
  "src/lib/access-auth-v01.ts",
  "src/pages/api/auth/[...all].ts",
  "src/pages/api/access/me.ts",
  "src/pages/login.astro",
  "src/pages/admin/index.astro",
  "src/pages/partner/index.astro",
  "src/components/access/AccountMenu.astro",
];

for (const file of requiredFiles) {
  if (!existsSync(join(process.cwd(), file))) {
    throw new Error(`Missing Viddel Access file: ${file}`);
  }
}

const authSource = readFileSync(join(process.cwd(), "src/lib/access-auth-v01.ts"), "utf8");
for (const required of [
  "VIDDEL_ADMIN_EMAILS",
  "VIDDEL_PARTNER_EMAILS",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "BETTER_AUTH_SECRET",
  "VIDDEL_OAUTH_PROXY_SECRET",
  "validateUserInfo",
  "email_not_allowed",
]) {
  assert.match(authSource, new RegExp(required));
}

const adminPage = readFileSync(join(process.cwd(), "src/pages/admin/index.astro"), "utf8");
const partnerPage = readFileSync(join(process.cwd(), "src/pages/partner/index.astro"), "utf8");
assert.match(adminPage, /requireViddelRole\(Astro\.request, "admin"\)/);
assert.match(partnerPage, /requireViddelRole\(Astro\.request, "partner"\)/);
assert.match(adminPage, /noindex,nofollow/);
assert.match(partnerPage, /noindex,nofollow/);

console.log("Viddel Access contract OK");
