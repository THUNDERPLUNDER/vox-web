/* CONTRACT: Build-time helpers for listing raw HTML wireframes under public/vis/raw.
 * Public URLs for raw files and /vis routes must use `import.meta.env.BASE_URL` in .astro files (GitHub Pages base path). */
import fs from "node:fs";
import path from "node:path";

export function visRawDir(): string {
  return path.join(process.cwd(), "public", "vis", "raw");
}

/** Basenames of `.html` files in `public/vis/raw/`, sorted for stable output. */
export function listVisRawHtmlFiles(): string[] {
  const dir = visRawDir();
  try {
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith(".html"))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  } catch {
    return [];
  }
}

export function slugFromHtmlFilename(filename: string): string {
  return filename.replace(/\.html$/i, "");
}

export function htmlFileForSlug(slug: string, files: string[]): string | undefined {
  return files.find((f) => slugFromHtmlFilename(f) === slug);
}
