import assert from "node:assert/strict";

process.env.VIDDEL_OWNER_PIN = "2468";
process.env.VIDDEL_OWNER_SESSION_TOKEN = "owner-session-token-with-more-than-32-characters";

const owner = await import("../src/lib/owner-access-v01.ts");
const access = await import("../src/lib/public-ai-access-v01.ts");

assert.equal(owner.isOwnerAccessConfigured(), true);
assert.equal(owner.verifyOwnerPin("2468"), true);
assert.equal(owner.verifyOwnerPin("2469"), false);
assert.equal(owner.verifyOwnerPin("12345"), false);

const setCookie = owner.buildOwnerSessionSetCookie();
assert.match(setCookie, /^viddel_owner_session=/);
assert.match(setCookie, /HttpOnly/);
assert.match(setCookie, /SameSite=Strict/);

const cookieValue = setCookie.split(";")[0];
const ownerRequest = new Request("https://www.viddel.no/api/chat", {
  headers: { cookie: cookieValue },
});
assert.equal(owner.hasOwnerSession(ownerRequest), true);
assert.equal(await access.canUsePublicAi(ownerRequest), true);
assert.equal(owner.hasOwnerSession(new Request("https://www.viddel.no/api/chat")), false);
assert.equal(owner.hasOwnerSession(new Request("https://www.viddel.no/api/chat", {
  headers: { cookie: "viddel_owner_session=%ZZ" },
})), false);

const publicRequest = new Request("https://www.viddel.no/api/chat");
assert.deepEqual(await access.getPublicAiState(async () => true), { enabled: true, available: true });
assert.equal(await access.canUsePublicAi(publicRequest, async () => true), true);
assert.deepEqual(await access.getPublicAiState(async () => false), { enabled: false, available: true });
assert.equal(await access.canUsePublicAi(publicRequest, async () => false), false);

const originalConsoleError = console.error;
console.error = () => {};
assert.deepEqual(await access.getPublicAiState(async () => { throw new Error("offline"); }), {
  enabled: false,
  available: false,
});
console.error = originalConsoleError;

console.log("Owner access guard OK");
