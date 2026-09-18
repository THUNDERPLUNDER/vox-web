import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const signup = await import("../src/lib/interest-signup-v01.ts");

const valid = {
  email: " Test.Person+viddel@Example.no ",
  consent_version: signup.INTEREST_SIGNUP_CONSENT_VERSION,
  source: signup.INTEREST_SIGNUP_SOURCE,
  website: "",
};

const normalized = signup.validateInterestSignup(valid);
assert.equal(normalized.ok, true);
assert.equal(normalized.kind, "submit");
if (normalized.ok && normalized.kind === "submit") {
  assert.equal(normalized.value.email, "test.person+viddel@example.no");
}

assert.equal(signup.validateInterestSignup({ ...valid, email: "" }).ok, false);
assert.equal(signup.validateInterestSignup({ ...valid, email: "ikke-epost" }).ok, false);
assert.equal(signup.validateInterestSignup({ ...valid, source: "other" }).ok, false);
assert.equal(signup.validateInterestSignup({ ...valid, consent_version: "old" }).ok, false);
assert.equal(signup.validateInterestSignup({ ...valid, diagnosis: "must-not-exist" }).ok, false);

const honeypot = signup.validateInterestSignup({ ...valid, website: "https://bot.invalid" });
assert.equal(honeypot.ok, true);
assert.equal(honeypot.kind, "spam");

const [apiSource, componentSource, storeSource] = await Promise.all([
  readFile(new URL("../src/pages/api/interest-signup.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/components/public/InterestSignupForm.astro", import.meta.url), "utf8"),
  readFile(new URL("../src/lib/interest-signup-store-v01.ts", import.meta.url), "utf8"),
]);

assert.match(apiSource, /console\.error\("\[api\/interest-signup\] storage_error"\)/);
assert.doesNotMatch(apiSource, /posthog/i);
assert.doesNotMatch(componentSource, /diagnos|høreapparat|telefon|adresse/i);
assert.doesNotMatch(componentSource, /posthog/i);
assert.match(storeSource, /public_interest_signup/);
assert.doesNotMatch(storeSource, /conversation_feedback|session_id|transcript/i);

console.log("Interest signup contract OK");
