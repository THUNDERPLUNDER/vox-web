/* CONTRACT: Build-time helpers for listing raw HTML under public/vis/raw (wireframes, strategy, m.m.).
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

/** Minimal entity decode for title/description/delta snippets from wireframe HTML. */
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

/** Best-effort `<meta name="…" content="…">` (either attribute order). `name` is matched literally. */
function readMetaContentByName(head: string, name: string): string | undefined {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let m = head.match(
    new RegExp(
      `<meta\\s+[^>]*name\\s*=\\s*["']${esc}["'][^>]*content\\s*=\\s*["']([^"']*)["'][^>]*\\/?>`,
      "i",
    ),
  );
  if (!m) {
    m = head.match(
      new RegExp(
        `<meta\\s+[^>]*content\\s*=\\s*["']([^"']*)["'][^>]*name\\s*=\\s*["']${esc}["'][^>]*\\/?>`,
        "i",
      ),
    );
  }
  if (!m?.[1]) return undefined;
  let v = decodeBasicEntities(m[1]);
  if (v.length > 400) v = v.slice(0, 397) + "…";
  return v || undefined;
}

/** Normalisert innholdstype for VIS-index; `document` er nøytral fallback. */
export type VisContentType = "wireframe" | "strategy" | "document" | "sprint";

const VIS_TYPE_LABEL_NO: Record<VisContentType, string> = {
  wireframe: "Wireframe",
  strategy: "Strategi",
  document: "Dokument",
  sprint: "Sprint",
};

/**
 * Leser valgfritt `<meta name="vis:type" content="wireframe|strategy|document|sprint">`, ellers faller tilbake til filnavn.
 */
export function resolveVisType(filename: string, metaVisType?: string): VisContentType {
  const raw = metaVisType?.trim().toLowerCase();
  if (raw === "wireframe" || raw === "strategy" || raw === "document" || raw === "sprint") return raw;
  const base = path.basename(filename);
  if (/^wire_/i.test(base)) return "wireframe";
  if (/^KlarLyd_Strategi_/i.test(base)) return "strategy";
  return "document";
}

export function visTypeLabelNo(kind: VisContentType): string {
  return VIS_TYPE_LABEL_NO[kind];
}

/**
 * Reads `<title>`, `<meta name="description">`, `<meta name="vis:delta">`, and `<meta name="vis:type">` from the start of a raw HTML file.
 * Best-effort regex parsing only; no full DOM.
 */
export function readWireframeHeadMetadata(filePath: string): {
  title?: string;
  description?: string;
  visDelta?: string;
  visTypeMeta?: string;
} {
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

    const visDelta = readMetaContentByName(head, "vis:delta");
    const visTypeMeta = readMetaContentByName(head, "vis:type");

    return {
      title: title || undefined,
      description: description || undefined,
      visDelta: visDelta || undefined,
      visTypeMeta: visTypeMeta || undefined,
    };
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
  /** Løst type for badge på `/vis` (meta + filnavn-fallback). */
  visType: VisContentType;
};

/** Same `displayTitle` + `description` + optional `delta` as `/vis` index for a single raw HTML file. */
export function wireframeDisplayMeta(filename: string): {
  displayTitle: string;
  description?: string;
  delta?: string;
} {
  const meta = readWireframeHeadMetadata(path.join(visRawDir(), filename));
  const displayTitle = (meta.title && meta.title.length > 0 ? meta.title : filename) || filename;
  return { displayTitle, description: meta.description, delta: meta.visDelta };
}

/** Build-time list entries for `/vis` with optional metadata from each HTML file. */
export function wireframeIndexEntries(): WireframeIndexEntry[] {
  const dir = visRawDir();
  return listVisRawHtmlFiles().map((filename) => {
    const slug = slugFromHtmlFilename(filename);
    const meta = readWireframeHeadMetadata(path.join(dir, filename));
    const displayTitle = (meta.title && meta.title.length > 0 ? meta.title : filename) || filename;
    const visType = resolveVisType(filename, meta.visTypeMeta);
    return {
      filename,
      slug,
      displayTitle,
      description: meta.description,
      visType,
    };
  });
}
