/* CONTRACT: Les-only plan for Viddel MVP Storyblok-import — ingen token, ingen nettverk, ingen skriving. */

/**
 * Usage: npm run storyblok:import:viddel-mvp:dry-run
 */

import viddelMvpContentPack from "../content/viddel/articles/viddel-mvp-content-pack-v0-1.mjs";
import { allPublishingStories } from "./map-viddel-mvp-pack-to-storyblok.mjs";

function isBlank(s) {
  return typeof s !== "string" || !s.trim();
}

function main() {
  const stories = allPublishingStories();
  let hubCount = 0;
  let articleCount = 0;
  let seedCount = 0;
  const hubSlugs = [];
  const articleSlugs = [];
  const slugHistogram = new Map();
  const seedsByArticle = new Map();

  for (const s of stories) {
    slugHistogram.set(s.slug, (slugHistogram.get(s.slug) ?? 0) + 1);
    const comp = s.content?.component;
    if (comp === "hub_page") {
      hubCount += 1;
      hubSlugs.push(s.slug);
    } else if (comp === "article_page") {
      articleCount += 1;
      articleSlugs.push(s.slug);
    } else if (comp === "ai_seed_question") {
      seedCount += 1;
      const art = s.content?.related_article;
      if (art) {
        if (!seedsByArticle.has(art)) seedsByArticle.set(art, []);
        seedsByArticle.get(art).push(s.slug);
      }
    }
  }

  const duplicateSlugs = [...slugHistogram.entries()].filter(([, n]) => n > 1).map(([slug]) => slug);

  const warnings = [];

  for (const s of stories) {
    const comp = s.content?.component;
    if (isBlank(s.slug)) warnings.push({ kind: "empty_story_slug", story: s.name, component: comp });
    if (isBlank(s.name)) warnings.push({ kind: "empty_story_name", slug: s.slug, component: comp });

    if (comp === "hub_page" || comp === "article_page") {
      if (isBlank(s.content?.title)) {
        warnings.push({ kind: "empty_content_title", slug: s.slug, component: comp });
      }
      if (isBlank(s.content?.slug)) {
        warnings.push({ kind: "empty_content_slug", slug: s.slug, component: comp });
      }
    }
    if (comp === "article_page") {
      const secs = s.content?.sections;
      if (!Array.isArray(secs) || secs.length === 0) {
        warnings.push({ kind: "empty_sections", slug: s.slug });
      }
    }
    if (comp === "ai_seed_question") {
      if (isBlank(s.content?.question)) warnings.push({ kind: "empty_seed_question", slug: s.slug });
      if (isBlank(s.content?.related_article)) warnings.push({ kind: "empty_related_article", slug: s.slug });
    }
  }

  const articles = viddelMvpContentPack.articles ?? [];
  for (const a of articles) {
    const q = a.ai_seed_questions;
    if (!Array.isArray(q) || q.length === 0) {
      warnings.push({ kind: "empty_ai_seed_questions_in_pack", article_slug: a.slug });
    } else {
      q.forEach((line, i) => {
        if (isBlank(String(line))) {
          warnings.push({ kind: "blank_seed_line_in_pack", article_slug: a.slug, index: i });
        }
      });
    }
  }

  console.log("=== Viddel MVP — Storyblok import dry-run (plan) ===\n");
  console.log("Kilde: content/viddel/articles/viddel-mvp-content-pack-v0-1.mjs → map-viddel-mvp-pack-to-storyblok.mjs\n");

  console.log("Antall hub_page stories:     ", hubCount);
  console.log("Antall article_page stories: ", articleCount);
  console.log("Antall ai_seed_question:     ", seedCount);
  console.log("Total stories:               ", stories.length);
  console.log("");

  console.log("Hub-slugs:");
  hubSlugs.forEach((slug) => console.log(`  - ${slug}`));
  console.log("");

  console.log("Artikkel-slugs:");
  articleSlugs.forEach((slug) => console.log(`  - ${slug}`));
  console.log("");

  console.log("AI-seed-slugs per artikkel (related_article):");
  const sortedArticles = [...seedsByArticle.keys()].sort();
  for (const artSlug of sortedArticles) {
    const seeds = seedsByArticle.get(artSlug) ?? [];
    console.log(`  ${artSlug} (${seeds.length}):`);
    seeds.forEach((slug) => console.log(`    - ${slug}`));
  }
  const articlesWithNoSeeds = articleSlugs.filter((slug) => !seedsByArticle.has(slug) || seedsByArticle.get(slug).length === 0);
  if (articlesWithNoSeeds.length > 0) {
    console.log("  (Artikler uten genererte seeds fra mapperen:)");
    articlesWithNoSeeds.forEach((slug) => console.log(`    - ${slug}`));
  }
  console.log("");

  if (duplicateSlugs.length === 0) {
    console.log("Duplikate slugs: ingen");
  } else {
    console.log("Duplikate slugs:");
    duplicateSlugs.forEach((slug) => console.log(`  - ${slug} (×${slugHistogram.get(slug)})`));
  }
  console.log("");

  if (warnings.length === 0) {
    console.log("Tomme/obligatoriske felt: ingen funnet");
  } else {
    console.log("Advarsler (tomme felt / manglende seeds i pack):");
    for (const w of warnings) console.log(`  - ${JSON.stringify(w)}`);
  }
  console.log("");

  const fatal = duplicateSlugs.length > 0 || warnings.some((w) => w.kind === "empty_story_slug" || w.kind === "empty_content_slug");
  if (fatal) {
    console.error("Dry-run: FEIL — duplikate slugs eller kritiske tomme slug-felt.");
    process.exit(1);
  }

  console.log("Dry-run: OK (ingen blokkerende feil).");
}

main();
