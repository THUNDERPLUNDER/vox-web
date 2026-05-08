/* CONTRACT: Minimal Storyblok publishing helpers for Slice 01 hub/article/AI seeds. */
import { getStoryblokVersion } from "./storyblok-glossary";

type AnyRecord = Record<string, unknown>;

export type RelatedLink = {
  label: string;
  href: string;
  comingSoon: boolean;
};

export type HubPageContent = {
  title: string;
  slug: string;
  kjerne?: string;
  intro?: string;
  helpPoints: string[];
  primaryCtaLabel?: string;
  primaryCtaTarget?: string;
  secondaryLinks: RelatedLink[];
  trustNote?: string;
  status?: string;
};

export type ArticleSection = {
  heading?: string;
  body?: string;
};

export type ArticleModule =
  | {
      component:
        | "module_observation_box"
        | "module_friction_box"
        | "module_response_block"
        | "module_reassurance_block";
      title?: string;
      body?: string;
      points: string[];
    }
  | {
      component: "module_phrase_cards";
      title?: string;
      cards: string[];
    }
  | {
      component: "related_link";
      label: string;
      href: string;
      comingSoon: boolean;
    };

export type ArticlePageContent = {
  title: string;
  slug: string;
  categoryLabel?: string;
  parentHub?: string;
  ingress?: string;
  sections: ArticleSection[];
  moduleBlocks: ArticleModule[];
  nextSteps: string[];
  authorName?: string;
  authorRole?: string;
  reviewerName?: string;
  reviewerRole?: string;
  publishedAt?: string;
  updatedAt?: string;
  aiNote?: string;
  methodNote?: string;
  mandate?: ArticleMandateMetadata;
  status?: string;
};

export type ArticleMandateMetadata = {
  needTopTask?: string;
  primarySegment?: string;
  secondarySegment?: string;
  stadium?: string;
  mode?: string;
  aiRole?: string;
  onward?: string;
};

export type AiSeedQuestion = {
  question: string;
  shortAnswer?: string;
  followupQuestion?: string;
  relatedArticle?: string;
  status?: string;
};

function toRecord(value: unknown): AnyRecord {
  return value && typeof value === "object" ? (value as AnyRecord) : {};
}

function asString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    if (typeof item === "string" && item.trim()) out.push(item.trim());
  }
  return out;
}

function asLineList(value: unknown): string[] {
  if (Array.isArray(value)) return asStringArray(value);
  if (typeof value !== "string") return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseRelatedLink(raw: unknown): RelatedLink | null {
  const rec = toRecord(raw);
  const label = asString(rec.label) || asString(rec.title);
  const href = asString(rec.href) || asString(rec.url) || asString(rec.link);
  if (!label || !href) return null;
  const comingSoon = rec.coming_soon === true || rec.comingSoon === true;
  return { label, href, comingSoon };
}

function parseSecondaryLinks(value: unknown): RelatedLink[] {
  if (!Array.isArray(value)) return [];
  const out: RelatedLink[] = [];
  for (const item of value) {
    const link = parseRelatedLink(item);
    if (link) out.push(link);
  }
  return out;
}

function parseArticleSection(raw: unknown): ArticleSection | null {
  const rec = toRecord(raw);
  const heading = asString(rec.heading) || asString(rec.title);
  const body = asString(rec.body) || asString(rec.text) || asString(rec.content);
  if (!heading && !body) return null;
  return { heading, body };
}

function parseArticleSections(value: unknown): ArticleSection[] {
  if (!Array.isArray(value)) return [];
  const out: ArticleSection[] = [];
  for (const item of value) {
    const section = parseArticleSection(item);
    if (section) out.push(section);
  }
  return out;
}

function parsePoints(rec: AnyRecord): string[] {
  return asLineList(rec.points).concat(asLineList(rec.items));
}

function parseArticleModule(raw: unknown): ArticleModule | null {
  const rec = toRecord(raw);
  const component = asString(rec.component);
  if (!component) return null;

  if (
    component === "module_observation_box" ||
    component === "module_friction_box" ||
    component === "module_response_block" ||
    component === "module_reassurance_block"
  ) {
    return {
      component,
      title: asString(rec.title) || asString(rec.heading),
      body: asString(rec.body) || asString(rec.text),
      points: parsePoints(rec),
    };
  }

  if (component === "module_phrase_cards") {
    return {
      component,
      title: asString(rec.title) || asString(rec.heading),
      cards: asLineList(rec.cards).concat(asLineList(rec.phrases)),
    };
  }

  if (component === "related_link") {
    const label = asString(rec.label) || asString(rec.title);
    const href = asString(rec.href) || asString(rec.url) || asString(rec.link);
    if (!label || !href) return null;
    return {
      component,
      label,
      href,
      comingSoon: rec.coming_soon === true || rec.comingSoon === true,
    };
  }

  return null;
}

function parseArticleModules(value: unknown): ArticleModule[] {
  if (!Array.isArray(value)) return [];
  const out: ArticleModule[] = [];
  for (const item of value) {
    const module = parseArticleModule(item);
    if (module) out.push(module);
  }
  return out;
}

function normalizeHubStory(story: AnyRecord): HubPageContent {
  const content = toRecord(story.content);
  const slug = asString(story.slug) || asString(story.full_slug) || "hub";
  return {
    title: asString(content.title) || asString(story.name) || "Hub",
    slug,
    kjerne: asString(content.kjerne),
    intro: asString(content.intro),
    helpPoints: asLineList(content.help_points),
    primaryCtaLabel: asString(content.primary_cta_label),
    primaryCtaTarget: asString(content.primary_cta_target),
    secondaryLinks: parseSecondaryLinks(content.secondary_links),
    trustNote: asString(content.trust_note),
    status: asString(content.status),
  };
}

function normalizeArticleStory(story: AnyRecord): ArticlePageContent {
  const content = toRecord(story.content);
  const slug = asString(story.slug) || asString(story.full_slug) || "artikkel";
  const mandate: ArticleMandateMetadata = {
    needTopTask: asString(content.need_top_task) || asString(content.top_task) || asString(content.behov_top_task),
    primarySegment: asString(content.primary_segment) || asString(content.primaersegment),
    secondarySegment: asString(content.secondary_segment) || asString(content.sekundaersegment),
    stadium: asString(content.stadium),
    mode: asString(content.mode) || asString(content.modus),
    aiRole: asString(content.ai_role) || asString(content.ai_rolle),
    onward: asString(content.onward) || asString(content.videre) || asString(content.next_destination),
  };
  return {
    title: asString(content.title) || asString(story.name) || "Artikkel",
    slug,
    categoryLabel: asString(content.category_label),
    parentHub: asString(content.parent_hub),
    ingress: asString(content.ingress),
    sections: parseArticleSections(content.sections),
    moduleBlocks: parseArticleModules(content.module_blocks),
    nextSteps: asLineList(content.next_steps),
    authorName: asString(content.author_name),
    authorRole: asString(content.author_role),
    reviewerName: asString(content.reviewer_name),
    reviewerRole: asString(content.reviewer_role),
    publishedAt: asString(content.published_at) || asString(story.first_published_at) || asString(story.published_at),
    updatedAt: asString(content.updated_at) || asString(story.published_at) || asString(story.updated_at),
    aiNote: asString(content.ai_note),
    methodNote: asString(content.method_note),
    mandate,
    status: asString(content.status),
  };
}

function normalizeAiSeedStory(story: AnyRecord): AiSeedQuestion | null {
  const content = toRecord(story.content);
  const question = asString(content.question);
  if (!question) return null;
  return {
    question,
    shortAnswer: asString(content.short_answer),
    followupQuestion: asString(content.followup_question),
    relatedArticle: asString(content.related_article),
    status: asString(content.status),
  };
}

async function getStoryblokApiSafe() {
  const token = import.meta.env.STORYBLOK_DELIVERY_API_TOKEN;
  if (typeof token !== "string" || !token.trim()) return null;
  try {
    const { useStoryblokApi } = await import("@storyblok/astro");
    return useStoryblokApi();
  } catch {
    return null;
  }
}

/** Når flere `hub_page`-stories finnes, hent denne først (slug fra Viddel MVP content pack). Ellers faller vi tilbake til første treff. */
const PRIMARY_HUB_SLUG = "bedre-lyd-i-hverdagen";

export async function fetchPublishingHub(): Promise<HubPageContent | null> {
  const api = await getStoryblokApiSafe();
  if (!api) return null;
  try {
    const { data: preferredData } = await api.get("cdn/stories", {
      version: getStoryblokVersion(),
      filter_query: { component: { in: "hub_page" } },
      by_slugs: PRIMARY_HUB_SLUG,
      per_page: 1,
    });
    const preferredStory = Array.isArray(preferredData?.stories) ? preferredData.stories[0] : null;
    if (preferredStory) return normalizeHubStory(preferredStory);

    const { data } = await api.get("cdn/stories", {
      version: getStoryblokVersion(),
      filter_query: { component: { in: "hub_page" } },
      per_page: 1,
    });
    const story = Array.isArray(data?.stories) ? data.stories[0] : null;
    if (!story) return null;
    return normalizeHubStory(story);
  } catch {
    return null;
  }
}

export async function fetchPublishingArticleBySlug(slug: string): Promise<ArticlePageContent | null> {
  const api = await getStoryblokApiSafe();
  if (!api) return null;
  try {
    const { data } = await api.get("cdn/stories", {
      version: getStoryblokVersion(),
      filter_query: { component: { in: "article_page" } },
      by_slugs: slug,
      per_page: 1,
    });
    const story = Array.isArray(data?.stories) ? data.stories[0] : null;
    if (!story) return null;
    return normalizeArticleStory(story);
  } catch {
    return null;
  }
}

export async function fetchPublishingArticleSlugs(): Promise<string[]> {
  const api = await getStoryblokApiSafe();
  if (!api) return [];
  try {
    const { data } = await api.get("cdn/stories", {
      version: getStoryblokVersion(),
      filter_query: { component: { in: "article_page" } },
      per_page: 100,
    });
    const stories = Array.isArray(data?.stories) ? data.stories : [];
    const slugs = stories
      .map((story) => asString(story.slug))
      .filter((s): s is string => typeof s === "string" && !!s);
    return Array.from(new Set(slugs));
  } catch {
    return [];
  }
}

export async function fetchAiSeedQuestions(): Promise<AiSeedQuestion[]> {
  const api = await getStoryblokApiSafe();
  if (!api) return [];
  try {
    const { data } = await api.get("cdn/stories", {
      version: getStoryblokVersion(),
      filter_query: { component: { in: "ai_seed_question" } },
      per_page: 100,
    });
    const stories = Array.isArray(data?.stories) ? data.stories : [];
    const out: AiSeedQuestion[] = [];
    for (const story of stories) {
      const parsed = normalizeAiSeedStory(story);
      if (parsed) out.push(parsed);
    }
    return out;
  } catch {
    return [];
  }
}
