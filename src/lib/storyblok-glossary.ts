/* CONTRACT: Storyblok glossary — path convention, version, shared term mapping + index fetch. */

/** Stories for /no/ordbok/[term] use full_slug under this prefix (e.g. no/ordbok/tilkobling). */
export const STORYBLOK_GLOSSARY_STARTS_WITH = "no/ordbok/";

export type GlossaryTerm = {
  slug: string;
  title: string;
  description: string;
};

export function getStoryblokVersion(): "draft" | "published" {
  return import.meta.env.DEV ? "draft" : "published";
}

export function termSlugFromFullSlug(fullSlug: string): string | null {
  if (!fullSlug.startsWith(STORYBLOK_GLOSSARY_STARTS_WITH)) return null;
  const rest = fullSlug.slice(STORYBLOK_GLOSSARY_STARTS_WITH.length).replace(/\/$/, "");
  return rest || null;
}

/** Map one Delivery API story to a glossary entry; null if slug ikke under no/ordbok/. */
export function glossaryEntryFromStoryblokStory(story: {
  full_slug?: string;
  name?: string;
  content?: unknown;
}): GlossaryTerm | null {
  const slug = story.full_slug ? termSlugFromFullSlug(story.full_slug) : null;
  if (!slug) return null;

  const content =
    story.content && typeof story.content === "object" && story.content !== null
      ? (story.content as Record<string, unknown>)
      : {};
  const rawTitle = content.title;
  const rawDesc = content.description;

  const title =
    typeof rawTitle === "string" && rawTitle.trim()
      ? rawTitle.trim()
      : typeof story.name === "string"
        ? story.name
        : slug;

  const description = typeof rawDesc === "string" && rawDesc.trim() ? rawDesc.trim() : "";

  return { slug, title, description };
}

/** Kort tekst til kort i liste (unngår lange avsnitt i grid). */
export function truncateForCard(text: string, maxLen = 140): string {
  const t = text.trim();
  if (!t.length) return "";
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1).trimEnd()}…`;
}

/**
 * Henter publiserte/draft term-stories (samme filter som [term]-ruten).
 * Tom tabell ved manglende token, API-feil eller 0 stories — aldri throw.
 */
export async function fetchGlossaryTerms(): Promise<GlossaryTerm[]> {
  const token = import.meta.env.STORYBLOK_DELIVERY_API_TOKEN;
  if (typeof token !== "string" || !token.trim()) {
    return [];
  }

  try {
    const { useStoryblokApi } = await import("@storyblok/astro");
    const storyblokApi = useStoryblokApi();
    const { data } = await storyblokApi.get("cdn/stories", {
      version: getStoryblokVersion(),
      starts_with: STORYBLOK_GLOSSARY_STARTS_WITH,
    });

    const stories = data?.stories;
    if (!Array.isArray(stories) || stories.length === 0) {
      return [];
    }

    const terms: GlossaryTerm[] = [];
    for (const story of stories) {
      const entry = glossaryEntryFromStoryblokStory(story);
      if (entry) terms.push(entry);
    }
    terms.sort((a, b) => a.title.localeCompare(b.title, "no"));
    return terms;
  } catch {
    return [];
  }
}
