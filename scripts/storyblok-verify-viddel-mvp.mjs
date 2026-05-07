/* CONTRACT: Read-only verifisering av Viddel MVP-innhold i Storyblok (Management API GET). Skriver aldri. */

/**
 * Usage:
 *   STORYBLOK_SPACE_ID=… STORYBLOK_PERSONAL_TOKEN=… npm run storyblok:verify:viddel-mvp
 *
 * Sammenligner forventede stories (fra map-viddel-mvp-pack-to-storyblok) med det som ligger i space.
 */

import { allPublishingStories } from "./map-viddel-mvp-pack-to-storyblok.mjs";
import { createStoryblokManagementClient } from "./storyblok-management-client.mjs";

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_TOKEN || process.env.STORYBLOK_OAUTH_TOKEN;
const BASE_URL = process.env.STORYBLOK_MANAGEMENT_BASE_URL || "https://mapi.storyblok.com/v1";

const REQUIRED_ROOT_COMPONENTS = ["hub_page", "article_page", "ai_seed_question"];

if (!SPACE_ID || !TOKEN) {
  console.error("Mangler env: STORYBLOK_SPACE_ID og STORYBLOK_PERSONAL_TOKEN eller STORYBLOK_OAUTH_TOKEN");
  process.exit(1);
}

const { sb, apiBase } = createStoryblokManagementClient({
  spaceId: SPACE_ID,
  token: TOKEN,
  baseUrl: BASE_URL,
});

function storyHasPublishedVersion(story) {
  if (story?.published === true) return true;
  const at = story?.published_at;
  if (at != null && String(at).trim() !== "") return true;
  return false;
}

async function listAllStories() {
  const stories = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const data = await sb(`/stories?page=${page}&per_page=${perPage}&story_only=1`);
    const batch = Array.isArray(data?.stories) ? data.stories : [];
    stories.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
  }

  return stories;
}

/** Liste-kall returnerer noen ganger tynn `content`; hent enkeltstory ved behov (read-only). */
async function getStoryContent(story) {
  if (story?.content?.component) {
    return story.content;
  }
  if (!story?.id) return null;
  const data = await sb(`/stories/${story.id}`);
  return data?.story?.content ?? null;
}

async function main() {
  console.log(`=== Viddel MVP — Storyblok verify (read-only) ===\n`);
  console.log(`Space: ${SPACE_ID}`);
  console.log(`API: ${apiBase}\n`);

  const expectedSpecs = allPublishingStories();
  const expectedBySlug = new Map(expectedSpecs.map((s) => [s.slug, s]));
  const expectedArticleSlugs = new Set(
    expectedSpecs.filter((s) => s.content?.component === "article_page").map((s) => s.slug),
  );
  const expectedSeedSlugs = new Set(
    expectedSpecs.filter((s) => s.content?.component === "ai_seed_question").map((s) => s.slug),
  );

  const componentsData = await sb("/components");
  const components = Array.isArray(componentsData?.components) ? componentsData.components : [];
  const componentNames = new Set(components.map((c) => c.name));

  console.log("Root-komponenter (forventet at hub_page, article_page, ai_seed_question finnes):");
  for (const name of REQUIRED_ROOT_COMPONENTS) {
    const ok = componentNames.has(name);
    console.log(`  ${ok ? "OK" : "MANGLER"}  ${name}`);
  }
  console.log("");

  const remoteStories = await listAllStories();
  const bySlug = new Map(remoteStories.map((story) => [story.slug, story]));

  let remoteHub = 0;
  let remoteArticle = 0;
  let remoteSeed = 0;

  for (const story of remoteStories) {
    const content = story.content?.component ? story.content : await getStoryContent(story);
    const comp = content?.component;
    if (comp === "hub_page") remoteHub += 1;
    else if (comp === "article_page") remoteArticle += 1;
    else if (comp === "ai_seed_question") remoteSeed += 1;
  }

  console.log("Antall stories i space (alle typer, via content.component):");
  console.log(`  hub_page:          ${remoteHub}`);
  console.log(`  article_page:      ${remoteArticle}`);
  console.log(`  ai_seed_question:  ${remoteSeed}`);
  console.log(`  (stories totalt i liste: ${remoteStories.length})`);
  console.log("");

  const missingSlugs = [...expectedBySlug.keys()].filter((slug) => !bySlug.has(slug));
  console.log("Forventede slugs som MANGLER i Storyblok:");
  if (missingSlugs.length === 0) console.log("  (ingen)");
  else missingSlugs.sort().forEach((slug) => console.log(`  - ${slug}`));
  console.log("");

  const expectedButNotPublished = [];
  for (const slug of expectedBySlug.keys()) {
    const story = bySlug.get(slug);
    if (story && !storyHasPublishedVersion(story)) {
      expectedButNotPublished.push(slug);
    }
  }
  console.log("Forventede stories som finnes men ser UPUBLISERT ut (published/published_at):");
  if (expectedButNotPublished.length === 0) console.log("  (ingen)");
  else expectedButNotPublished.sort().forEach((slug) => console.log(`  - ${slug}`));
  console.log("");

  const seedsMissingRelated = [];
  const relatedOrphans = [];

  for (const slug of expectedSeedSlugs) {
    const story = bySlug.get(slug);
    if (!story) continue;
    const content = story.content?.component ? story.content : await getStoryContent(story);
    const ra = content?.related_article;
    if (typeof ra !== "string" || !ra.trim()) {
      seedsMissingRelated.push(slug);
    } else if (!expectedArticleSlugs.has(ra.trim())) {
      relatedOrphans.push({ slug, related_article: ra.trim() });
    }
  }

  console.log("ai_seed_question (forventede seeds) uten related_article:");
  if (seedsMissingRelated.length === 0) console.log("  (ingen)");
  else seedsMissingRelated.sort().forEach((s) => console.log(`  - ${s}`));
  console.log("");

  console.log("related_article som ikke matcher noen forventet article_page-slug:");
  if (relatedOrphans.length === 0) console.log("  (ingen)");
  else
    relatedOrphans
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .forEach((o) => console.log(`  - seed ${o.slug} → "${o.related_article}"`));
  console.log("");

  const failed =
    REQUIRED_ROOT_COMPONENTS.some((n) => !componentNames.has(n)) ||
    missingSlugs.length > 0 ||
    expectedButNotPublished.length > 0 ||
    seedsMissingRelated.length > 0 ||
    relatedOrphans.length > 0;

  if (failed) {
    console.error("Verify: FEIL — se punktene over.");
    process.exit(1);
  }

  console.log("Verify: OK — forventet innhold er til stede og publisert (per Management API).");
}

main().catch((err) => {
  console.error("Verify failed:", err.message);
  process.exit(1);
});
