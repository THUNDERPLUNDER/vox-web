/* CONTRACT: Storyblok spike — glossary path convention + version helper (no CMS schema beyond title/description). */

/** Stories for /no/ordbok/[term] use full_slug under this prefix (e.g. no/ordbok/tilkobling). */
export const STORYBLOK_GLOSSARY_STARTS_WITH = "no/ordbok/";

export function getStoryblokVersion(): "draft" | "published" {
  return import.meta.env.DEV ? "draft" : "published";
}

export function termSlugFromFullSlug(fullSlug: string): string | null {
  if (!fullSlug.startsWith(STORYBLOK_GLOSSARY_STARTS_WITH)) return null;
  const rest = fullSlug.slice(STORYBLOK_GLOSSARY_STARTS_WITH.length).replace(/\/$/, "");
  return rest || null;
}
