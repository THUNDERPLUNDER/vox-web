/* CONTRACT: Preview stays open/noindex while Production stays behind one fail-closed flag. */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const access = await import("../src/lib/public-ai-access-v01.ts");

let previewFlagReads = 0;
assert.equal(
  await access.canUsePublicAi(async () => {
    previewFlagReads += 1;
    throw new Error("Preview must not evaluate the Production gate");
  }, "preview"),
  true,
);
assert.equal(previewFlagReads, 0);

assert.deepEqual(await access.getPublicAiState(async () => true), { enabled: true, available: true });
assert.equal(await access.canUsePublicAi(async () => true, "production"), true);
assert.deepEqual(await access.getPublicAiState(async () => false), { enabled: false, available: true });
assert.equal(await access.canUsePublicAi(async () => false, "production"), false);
assert.equal(await access.canUsePublicAi(async () => false, "development"), false);

const previousConsoleError = console.error;
console.error = () => {};
try {
  assert.deepEqual(await access.getPublicAiState(async () => { throw new Error("offline"); }), {
    enabled: false,
    available: false,
  });
  assert.equal(await access.canUsePublicAi(async () => { throw new Error("offline"); }, "production"), false);
} finally {
  console.error = previousConsoleError;
}

const middleware = readFileSync(new URL("../src/middleware.ts", import.meta.url), "utf8");
assert.match(middleware, /isVercelPreview\(\)/);
assert.match(middleware, /X-Robots-Tag/);
assert.match(middleware, /noindex, nofollow/);

const chatPage = readFileSync(new URL("../src/pages/no/chat.astro", import.meta.url), "utf8");
assert.doesNotMatch(chatPage, /owner-access|viddel-owner|ownerGesture|Eierkode|Midlertidig eierkontroll/);
assert.equal(existsSync(new URL("../src/lib/owner-access-v01.ts", import.meta.url)), false);
for (const endpoint of ["unlock.ts", "status.ts", "logout.ts"]) {
  assert.equal(existsSync(new URL(`../src/pages/api/owner-access/${endpoint}`, import.meta.url)), false);
}

console.log("Public AI access guard OK");
