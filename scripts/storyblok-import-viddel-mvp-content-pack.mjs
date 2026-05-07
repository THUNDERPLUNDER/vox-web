/* CONTRACT: Importer hub_page, article_page og ai_seed_question fra Viddel MVP content pack til Storyblok (upsert + publish). Tekster kommer kun fra content-pakken. */

/**
 * Usage:
 *   STORYBLOK_SPACE_ID=… STORYBLOK_PERSONAL_TOKEN=… node scripts/storyblok-import-viddel-mvp-content-pack.mjs
 *
 * Innhold mappes fra `content/viddel/articles/viddel-mvp-content-pack-v0-1.mjs` via `map-viddel-mvp-pack-to-storyblok.mjs`.
 *
 * Krever at Slice 01-komponentene allerede finnes i space (kjør `npm run storyblok:bootstrap:slice01` første gang, eller opprett tilsvarende manuelt).
 */

import { allPublishingStories } from "./map-viddel-mvp-pack-to-storyblok.mjs";
import { createStoryblokManagementClient } from "./storyblok-management-client.mjs";

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_TOKEN || process.env.STORYBLOK_OAUTH_TOKEN;
const BASE_URL = process.env.STORYBLOK_MANAGEMENT_BASE_URL || "https://mapi.storyblok.com/v1";

const REQUIRED_ROOT_COMPONENTS = new Set(["hub_page", "article_page", "ai_seed_question"]);

if (!SPACE_ID) {
  console.error("Missing env: STORYBLOK_SPACE_ID");
  process.exit(1);
}
if (!TOKEN) {
  console.error("Missing env: STORYBLOK_PERSONAL_TOKEN or STORYBLOK_OAUTH_TOKEN");
  process.exit(1);
}

const { sb, apiBase } = createStoryblokManagementClient({
  spaceId: SPACE_ID,
  token: TOKEN,
  baseUrl: BASE_URL,
});

async function listAllStories() {
  const stories = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const data = await sb(`/stories?page=${page}&per_page=${perPage}`);
    const batch = Array.isArray(data?.stories) ? data.stories : [];
    stories.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
  }

  return stories;
}

async function assertPublishingComponentsExist() {
  const data = await sb("/components");
  const components = Array.isArray(data?.components) ? data.components : [];
  const names = new Set(components.map((c) => c.name));
  const missing = [...REQUIRED_ROOT_COMPONENTS].filter((n) => !names.has(n));
  if (missing.length > 0) {
    throw new Error(
      `Mangler Storyblok-komponenter: ${missing.join(", ")}. Kjør først: npm run storyblok:bootstrap:slice01`,
    );
  }
}

async function upsertStory(storySpec, existingMap) {
  const existing = existingMap.get(storySpec.slug);
  const payload = {
    story: {
      name: storySpec.name,
      slug: storySpec.slug,
      content: storySpec.content,
      is_startpage: false,
    },
  };

  if (existing?.id) {
    const updated = await sb(`/stories/${existing.id}`, { method: "PUT", body: payload });
    return { action: "updated", id: existing.id, story: updated?.story };
  }

  const created = await sb("/stories", { method: "POST", body: payload });
  return { action: "created", id: created?.story?.id, story: created?.story };
}

async function publishStoryById(storyId) {
  await sb(`/stories/${storyId}/publish`, { method: "GET" });
}

async function main() {
  console.log(`Storyblok import — Viddel MVP content pack v0.1 (space ${SPACE_ID})`);
  console.log(`API base: ${BASE_URL} → ${apiBase}`);

  await assertPublishingComponentsExist();

  const storySpecs = allPublishingStories();
  const existingStories = await listAllStories();
  const storyMap = new Map(existingStories.map((s) => [s.slug, s]));
  const storyResults = [];

  for (const spec of storySpecs) {
    const result = await upsertStory(spec, storyMap);
    storyResults.push(result);
    if (result.id) {
      await publishStoryById(result.id);
    }
  }

  console.log("\nStories:");
  for (const r of storyResults) {
    const slug = r.story?.slug || "unknown";
    console.log(`- ${r.action.toUpperCase()}: ${slug} (id: ${r.id ?? "n/a"}) + published`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("\nImport failed:", err.message);
  process.exit(1);
});
