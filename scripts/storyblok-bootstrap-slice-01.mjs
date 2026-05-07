/* CONTRACT: One-off Storyblok bootstrap for Publishing Slice 01 (components + stories + publish), idempotent by upsert. */
/**
 * Usage:
 *   STORYBLOK_SPACE_ID=12345 STORYBLOK_PERSONAL_TOKEN=xxx node scripts/storyblok-bootstrap-slice-01.mjs
 *
 * Stories bygges via `scripts/map-viddel-mvp-pack-to-storyblok.mjs` fra `content/viddel/articles/viddel-mvp-content-pack-v0-1.mjs`.
 *
 * Required env:
 * - STORYBLOK_SPACE_ID
 * - STORYBLOK_PERSONAL_TOKEN or STORYBLOK_OAUTH_TOKEN
 *
 * Optional env:
 * - STORYBLOK_MANAGEMENT_BASE_URL (default: https://mapi.storyblok.com/v1)
 */

import { allPublishingStories } from "./map-viddel-mvp-pack-to-storyblok.mjs";
import { createStoryblokManagementClient } from "./storyblok-management-client.mjs";

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_TOKEN || process.env.STORYBLOK_OAUTH_TOKEN;
const BASE_URL = process.env.STORYBLOK_MANAGEMENT_BASE_URL || "https://mapi.storyblok.com/v1";

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

function textField(pos) {
  return { type: "text", pos };
}
function textareaField(pos) {
  return { type: "textarea", pos };
}
function optionField(pos, options = []) {
  return { type: "option", pos, options };
}
function bloksField(pos, componentWhitelist = []) {
  return {
    type: "bloks",
    pos,
    restrict_components: componentWhitelist.length > 0,
    component_whitelist: componentWhitelist,
  };
}
function linkField(pos) {
  return { type: "text", pos };
}
function booleanField(pos) {
  return { type: "boolean", pos };
}

const componentSpecs = [
  {
    name: "hub_page",
    display_name: "Hub Page",
    is_root: true,
    is_nestable: false,
    schema: {
      title: textField(0),
      slug: textField(1),
      kjerne: textareaField(2),
      intro: textareaField(3),
      help_points: textareaField(4),
      primary_cta_label: textField(5),
      primary_cta_target: linkField(6),
      secondary_links: bloksField(7, ["related_link"]),
      trust_note: textareaField(8),
      status: optionField(9, [
        { name: "draft", value: "draft" },
        { name: "ready", value: "ready" },
        { name: "published", value: "published" },
      ]),
    },
  },
  {
    name: "article_page",
    display_name: "Article Page",
    is_root: true,
    is_nestable: false,
    schema: {
      title: textField(0),
      slug: textField(1),
      category_label: textField(2),
      parent_hub: textField(3),
      ingress: textareaField(4),
      sections: bloksField(5, ["article_section"]),
      module_blocks: bloksField(6, [
        "module_observation_box",
        "module_friction_box",
        "module_phrase_cards",
        "module_response_block",
        "module_reassurance_block",
        "related_link",
      ]),
      next_steps: textareaField(7),
      author_name: textField(8),
      author_role: textField(9),
      reviewer_name: textField(10),
      reviewer_role: textField(11),
      updated_at: textField(12),
      ai_note: textareaField(13),
      method_note: textareaField(14),
      status: optionField(15, [
        { name: "draft", value: "draft" },
        { name: "ready", value: "ready" },
        { name: "published", value: "published" },
      ]),
    },
  },
  {
    name: "ai_seed_question",
    display_name: "AI Seed Question",
    is_root: true,
    is_nestable: false,
    schema: {
      question: textareaField(0),
      short_answer: textareaField(1),
      followup_question: textareaField(2),
      related_article: textField(3),
      status: optionField(4, [
        { name: "draft", value: "draft" },
        { name: "ready", value: "ready" },
        { name: "published", value: "published" },
      ]),
    },
  },
  {
    name: "article_section",
    display_name: "Article Section",
    is_root: false,
    is_nestable: true,
    schema: {
      heading: textField(0),
      body: textareaField(1),
    },
  },
  {
    name: "module_observation_box",
    display_name: "Module Observation Box",
    is_root: false,
    is_nestable: true,
    schema: {
      title: textField(0),
      body: textareaField(1),
      points: textareaField(2),
    },
  },
  {
    name: "module_friction_box",
    display_name: "Module Friction Box",
    is_root: false,
    is_nestable: true,
    schema: {
      title: textField(0),
      body: textareaField(1),
      points: textareaField(2),
    },
  },
  {
    name: "module_phrase_cards",
    display_name: "Module Phrase Cards",
    is_root: false,
    is_nestable: true,
    schema: {
      title: textField(0),
      cards: textareaField(1),
    },
  },
  {
    name: "module_response_block",
    display_name: "Module Response Block",
    is_root: false,
    is_nestable: true,
    schema: {
      title: textField(0),
      body: textareaField(1),
      points: textareaField(2),
    },
  },
  {
    name: "module_reassurance_block",
    display_name: "Module Reassurance Block",
    is_root: false,
    is_nestable: true,
    schema: {
      title: textField(0),
      body: textareaField(1),
      points: textareaField(2),
    },
  },
  {
    name: "related_link",
    display_name: "Related Link",
    is_root: false,
    is_nestable: true,
    schema: {
      label: textField(0),
      href: linkField(1),
      coming_soon: booleanField(2),
    },
  },
];

async function listAllComponents() {
  const data = await sb("/components");
  return Array.isArray(data?.components) ? data.components : [];
}

async function upsertComponent(spec, existingMap) {
  const existing = existingMap.get(spec.name);
  const payload = {
    component: {
      name: spec.name,
      display_name: spec.display_name,
      is_root: spec.is_root,
      is_nestable: spec.is_nestable,
      schema: spec.schema,
    },
  };

  if (existing?.id) {
    await sb(`/components/${existing.id}`, { method: "PUT", body: payload });
    return { action: "updated", name: spec.name, id: existing.id };
  }

  const created = await sb("/components", { method: "POST", body: payload });
  return { action: "created", name: spec.name, id: created?.component?.id };
}

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
  console.log(`Storyblok Slice 01 bootstrap for space ${SPACE_ID}`);
  console.log(`Using API base: ${BASE_URL}`);

  const componentResults = [];
  const existingComponents = await listAllComponents();
  const componentMap = new Map(existingComponents.map((c) => [c.name, c]));
  for (const spec of componentSpecs) {
    const result = await upsertComponent(spec, componentMap);
    componentResults.push(result);
  }

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

  console.log("\nComponents:");
  for (const r of componentResults) {
    console.log(`- ${r.action.toUpperCase()}: ${r.name} (id: ${r.id ?? "n/a"})`);
  }

  console.log("\nStories:");
  for (const r of storyResults) {
    const slug = r.story?.slug || "unknown";
    console.log(`- ${r.action.toUpperCase()}: ${slug} (id: ${r.id ?? "n/a"}) + published`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("\nBootstrap failed:", err.message);
  process.exit(1);
});
