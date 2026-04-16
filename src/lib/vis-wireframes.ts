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
  visSectionMeta?: string;
  visFeaturedMeta?: string;
  visUpdatedMeta?: string;
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
    const visSectionMeta = readMetaContentByName(head, "vis:section");
    const visFeaturedMeta = readMetaContentByName(head, "vis:featured");
    const visUpdatedMeta = readMetaContentByName(head, "vis:updated");

    return {
      title: title || undefined,
      description: description || undefined,
      visDelta: visDelta || undefined,
      visTypeMeta: visTypeMeta || undefined,
      visSectionMeta: visSectionMeta || undefined,
      visFeaturedMeta: visFeaturedMeta || undefined,
      visUpdatedMeta: visUpdatedMeta || undefined,
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
  /** Valgfri eksplisitt seksjon via `<meta name="vis:section">`. */
  visSectionMeta?: string;
  /** Valgfri markering av fremhevet innhold via `<meta name="vis:featured">`. */
  visFeatured: boolean;
  /** Valgfri oppdateringsdato via `<meta name="vis:updated">`. */
  visUpdatedRaw?: string;
  visUpdatedEpoch?: number;
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
    const featuredRaw = meta.visFeaturedMeta?.trim().toLowerCase();
    const visFeatured = featuredRaw === "true" || featuredRaw === "1" || featuredRaw === "yes";
    const visUpdatedRaw = meta.visUpdatedMeta?.trim();
    const parsedUpdated = visUpdatedRaw ? Date.parse(visUpdatedRaw) : Number.NaN;
    const visUpdatedEpoch = Number.isFinite(parsedUpdated) ? parsedUpdated : undefined;
    return {
      filename,
      slug,
      displayTitle,
      description: meta.description,
      visType,
      visSectionMeta: meta.visSectionMeta,
      visFeatured,
      visUpdatedRaw,
      visUpdatedEpoch,
    };
  });
}

export type VisIndexSection =
  | "Task flow / status"
  | "Sprint / roadmap"
  | "Strategi"
  | "Dokumenter"
  | "Wireframes";

const VIS_SECTION_ORDER: VisIndexSection[] = [
  "Task flow / status",
  "Sprint / roadmap",
  "Strategi",
  "Dokumenter",
  "Wireframes",
];

export function classifyVisEntry(entry: WireframeIndexEntry): VisIndexSection {
  const sectionRaw = entry.visSectionMeta?.trim().toLowerCase();
  if (sectionRaw) {
    if (sectionRaw.includes("task")) return "Task flow / status";
    if (sectionRaw.includes("roadmap") || sectionRaw.includes("sprint")) return "Sprint / roadmap";
    if (sectionRaw.includes("strategi") || sectionRaw.includes("strategy")) return "Strategi";
    if (sectionRaw.includes("wire")) return "Wireframes";
    if (sectionRaw.includes("dokument") || sectionRaw.includes("document")) return "Dokumenter";
  }

  const titleHaystack = `${entry.filename} ${entry.displayTitle} ${entry.description || ""}`.toLowerCase();
  if (entry.visType === "sprint" || titleHaystack.includes("roadmap") || titleHaystack.includes("sprint")) {
    return "Sprint / roadmap";
  }
  if (titleHaystack.includes("task flow") || titleHaystack.includes("board") || titleHaystack.includes("status")) {
    return "Task flow / status";
  }
  if (entry.visType === "strategy" || titleHaystack.includes("strategi")) return "Strategi";
  if (entry.visType === "wireframe") return "Wireframes";
  return "Dokumenter";
}

export function groupedVisEntries(entries: WireframeIndexEntry[]): {
  section: VisIndexSection;
  items: WireframeIndexEntry[];
}[] {
  const buckets = new Map<VisIndexSection, WireframeIndexEntry[]>();
  for (const section of VIS_SECTION_ORDER) buckets.set(section, []);
  for (const entry of entries) buckets.get(classifyVisEntry(entry))?.push(entry);
  return VIS_SECTION_ORDER.map((section) => ({
    section,
    items: (buckets.get(section) || []).sort((a, b) => a.displayTitle.localeCompare(b.displayTitle, "no")),
  })).filter((group) => group.items.length > 0);
}

export function recentVisEntries(entries: WireframeIndexEntry[], limit = 4): WireframeIndexEntry[] {
  return entries
    .filter((e) => Number.isFinite(e.visUpdatedEpoch))
    .sort((a, b) => (b.visUpdatedEpoch || 0) - (a.visUpdatedEpoch || 0))
    .slice(0, limit);
}

export function featuredVisEntries(entries: WireframeIndexEntry[], limit = 4): WireframeIndexEntry[] {
  const explicit = entries.filter((e) => e.visFeatured);
  if (explicit.length > 0) return explicit.slice(0, limit);
  const ranked = [...entries].sort((a, b) => {
    const rank = (x: WireframeIndexEntry) => {
      const section = classifyVisEntry(x);
      if (section === "Sprint / roadmap") return 50;
      if (section === "Task flow / status") return 40;
      if (section === "Strategi") return 30;
      if (section === "Dokumenter") return 20;
      return 10;
    };
    return rank(b) - rank(a);
  });
  return ranked.slice(0, limit);
}
