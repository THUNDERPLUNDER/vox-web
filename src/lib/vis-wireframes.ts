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

const READ_HEAD_MAX_CHARS = 100_000;

/** Minimal entity decode for title/description snippets from wireframe HTML. */
function decodeBasicEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Reads `<title>` and `<meta name="description">` from the start of a raw HTML file.
 * Best-effort regex parsing only; no full DOM.
 */
export function readWireframeHeadMetadata(filePath: string): { title?: string; description?: string } {
  try {
    if (!fs.existsSync(filePath)) return {};
    const raw = fs.readFileSync(filePath, "utf8");
    const head = raw.slice(0, Math.min(raw.length, READ_HEAD_MAX_CHARS));

    let title: string | undefined;
    const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch?.[1]) {
      title = decodeBasicEntities(titleMatch[1].replace(/<[^>]+>/g, ""));
      if (title.length > 200) title = title.slice(0, 197) + "…";
    }

    let description: string | undefined;
    let descMatch = head.match(
      /<meta\s+[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']*)["'][^>]*\/?>/i,
    );
    if (!descMatch) {
      descMatch = head.match(
        /<meta\s+[^>]*content\s*=\s*["']([^"']*)["'][^>]*name\s*=\s*["']description["'][^>]*\/?>/i,
      );
    }
    if (descMatch?.[1]) {
      description = decodeBasicEntities(descMatch[1]);
      if (description.length > 320) description = description.slice(0, 317) + "…";
    }

    return { title: title || undefined, description: description || undefined };
  } catch {
    return {};
  }
}

export type WireframeIndexEntry = {
  filename: string;
  slug: string;
  /** `<title>` when present and parseable, else `filename`. */
  displayTitle: string;
  /** `<meta name="description">` when present. */
  description?: string;
};

/** Build-time list entries for `/vis` with optional metadata from each HTML file. */
export function wireframeIndexEntries(): WireframeIndexEntry[] {
  const dir = visRawDir();
  return listVisRawHtmlFiles().map((filename) => {
    const slug = slugFromHtmlFilename(filename);
    const meta = readWireframeHeadMetadata(path.join(dir, filename));
    const displayTitle = (meta.title && meta.title.length > 0 ? meta.title : filename) || filename;
    return {
      filename,
      slug,
      displayTitle,
      description: meta.description,
    };
  });
}
