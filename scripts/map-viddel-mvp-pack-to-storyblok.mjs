/* CONTRACT: Mapper `viddelMvpContentPack` til Storyblok story-objekter (hub_page / article_page / ai_seed_question) uten å endre tekstinnhold — kun struktur (felt, join av lister, komponent-tagger). */

import viddelMvpContentPack from "../content/viddel/articles/viddel-mvp-content-pack-v0-1.mjs";

function hubToStory(hub) {
  return {
    name: hub.name,
    slug: hub.slug,
    content: {
      component: "hub_page",
      title: hub.title,
      slug: hub.slug,
      intro: hub.intro,
      help_points: Array.isArray(hub.help_points) ? hub.help_points.join("\n") : String(hub.help_points ?? ""),
      primary_cta_label: hub.primary_cta_label,
      primary_cta_target: hub.primary_cta_target,
      secondary_links: (hub.secondary_links ?? []).map((link) => ({
        component: "related_link",
        label: link.label,
        href: link.href,
        coming_soon: link.coming_soon === true,
      })),
      status: hub.status ?? "published",
    },
  };
}

function articleToStory(article) {
  const ragNotes = article.rag_notes;
  const methodNote =
    Array.isArray(ragNotes) && ragNotes.length > 0 ? ragNotes.join("\n") : undefined;

  return {
    name: article.name,
    slug: article.slug,
    content: {
      component: "article_page",
      title: article.title,
      slug: article.slug,
      category_label: article.category_label,
      parent_hub: article.parent_hub,
      ingress: article.ingress,
      sections: (article.sections ?? []).map((s) => ({
        component: "article_section",
        heading: s.heading,
        body: s.body,
      })),
      module_blocks: [],
      next_steps: Array.isArray(article.next_steps)
        ? article.next_steps.join("\n")
        : String(article.next_steps ?? ""),
      method_note: methodNote,
      status: article.status ?? "published",
    },
  };
}

function articleToSeedStories(article) {
  const questions = article.ai_seed_questions;
  if (!Array.isArray(questions) || questions.length === 0) return [];

  return questions.map((question, i) => {
    const n = i + 1;
    return {
      name: `AI-seed ${article.slug} ${n}`,
      slug: `${article.slug}-ai-seed-${n}`,
      content: {
        component: "ai_seed_question",
        question,
        related_article: article.slug,
        status: article.status ?? "published",
      },
    };
  });
}

/** Rekkefølge: hubber → artikler → seeds (koblet via related_article). */
export function allPublishingStories() {
  const pack = viddelMvpContentPack;
  const hubStories = (pack.hubs ?? []).map(hubToStory);
  const articleStories = (pack.articles ?? []).map(articleToStory);
  const seedStories = (pack.articles ?? []).flatMap(articleToSeedStories);
  return [...hubStories, ...articleStories, ...seedStories];
}
