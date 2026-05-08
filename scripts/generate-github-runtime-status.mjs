#!/usr/bin/env node
/* CONTRACT: Genererer public/vis/runtime/00_GITHUB_RUNTIME_STATUS.md fra GitHub API for @navigator Daily Sync (v0.1). Bruker GITHUB_TOKEN; eksponerer aldri hemmeligheter. */
/**
 * Env:
 *   GITHUB_TOKEN — valgfri lokalt; påkrevd i CI for full data. Uten token skrives stub med advarsler (exit 0).
 *   GITHUB_REPOSITORY — valgfri, default THUNDERPLUNDER/vox-web
 *
 * Usage:
 *   node scripts/generate-github-runtime-status.mjs
 *   npm run vis:github:runtime-status
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const OUTPUT_REL = join("public", "vis", "runtime", "00_GITHUB_RUNTIME_STATUS.md");
const DEFAULT_REPO = "THUNDERPLUNDER/vox-web";
const TIMEZONE = "Europe/Oslo";
const USER_AGENT = "vox-web-generate-github-runtime-status/0.1";

/** @type {string[]} */
const dataWarnings = [];

function repoSlug() {
  return (process.env.GITHUB_REPOSITORY || DEFAULT_REPO).trim();
}

function parseOwnerRepo(slug) {
  const parts = slug.split("/");
  if (parts.length < 2) throw new Error(`Invalid repo slug: ${slug}`);
  return { owner: parts[0], repo: parts[1] };
}

/** @param {string} body */
function extractKlMetaYaml(body) {
  if (!body) return null;
  const start = body.indexOf("<!-- KL-META:START -->");
  const end = body.indexOf("<!-- KL-META:END -->");
  if (start === -1 || end === -1 || end <= start) return null;
  const inner = body.slice(start, end);
  const m = inner.match(/```yaml\s*([\s\S]*?)```/);
  return m?.[1]?.trim() ?? null;
}

/** @param {string} yaml */
function parseSimpleYamlScalarMap(yaml) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const rawLine of yaml.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf(":");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

/** @param {string} body */
function isKlMetaInitiative(body) {
  const yaml = extractKlMetaYaml(body);
  if (!yaml) return false;
  const meta = parseSimpleYamlScalarMap(yaml);
  return meta.type?.toLowerCase() === "initiative";
}

/** @param {{ labels?: Array<{ name?: string } | string> }} issue */
function labelNames(issue) {
  const raw = issue.labels;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((l) => (typeof l === "string" ? l : l?.name))
    .filter((n) => typeof n === "string" && n.length > 0);
}

/** @param {string} name */
function isBlockerLabel(name) {
  const n = name.trim().toLowerCase();
  if (n === "blocker" || n === "p1") return true;
  if (n === "high priority" || n === "high-priority") return true;
  if (/^priority\s*:\s*p1$/i.test(name.trim())) return true;
  if (n.includes("blocker")) return true;
  if (n.includes("high priority")) return true;
  return false;
}

/** @param {{ labels?: Array<{ name?: string } | string> }} issue */
function hasBlockerLabel(issue) {
  return labelNames(issue).some(isBlockerLabel);
}

/** @param {{ labels?: Array<{ name?: string } | string> }} issue */
function hasInitiativeLabel(issue) {
  return labelNames(issue).some((n) => n.toLowerCase() === "initiative");
}

/**
 * @param {string} url
 * @param {{ token?: string, accept?: string }} opts
 */
async function githubFetch(url, opts = {}) {
  const headers = {
    Accept: opts.accept || "application/vnd.github+json",
    "User-Agent": USER_AGENT,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${url} ${text.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * @param {string} url
 * @param {{ token?: string }} opts
 */
async function githubFetchArrayPaged(urlFirst, opts) {
  /** @type {unknown[]} */
  const all = [];
  let url = urlFirst;
  while (url) {
    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": USER_AGENT,
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${url} ${text.slice(0, 200)}`);
    }
    const chunk = await res.json();
    if (Array.isArray(chunk)) all.push(...chunk);
    const next = res.headers.get("link")?.match(/<([^>]+)>;\s*rel="next"/);
    url = next?.[1] ?? null;
  }
  return all;
}

/** @param {any} issue */
function isEpicCandidate(issue) {
  if (!issue || issue.pull_request) return false;
  const title = String(issue.title || "").trim();
  if (/^epic:/i.test(title)) return true;
  if (isKlMetaInitiative(issue.body || "")) return true;
  if (hasInitiativeLabel(issue)) return true;
  return false;
}

/**
 * @param {any} issue
 * @param {string} projectStatus
 */
function formatIssueMd(issue, projectStatus = "ukjent") {
  const labels = labelNames(issue).join(", ") || "(ingen)";
  const st = issue.state || "?";
  const upd = issue.updated_at || "?";
  return [
    `- **#${issue.number}** ${issue.title || ""}`,
    `  - **state:** ${st} · **status (prosjekt):** ${projectStatus}`,
    `  - **labels:** ${labels}`,
    `  - **updated_at:** ${upd}`,
    `  - **url:** ${issue.html_url || ""}`,
  ].join("\n");
}

/**
 * @param {string} token
 * @param {string} owner
 * @param {string} repo
 */
async function fetchOpenIssues(token, owner, repo) {
  const base = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=100&sort=updated&direction=desc`;
  const items = await githubFetchArrayPaged(base, { token });
  return items.filter((i) => i && !i.pull_request);
}

/**
 * @param {string} token
 * @param {string} owner
 * @param {string} repo
 * @param {string} sinceIso
 */
async function fetchClosedSinceSearch(token, owner, repo, sinceIso, sinceMs) {
  /** GitHub `closed:` søk tar dato YYYY-MM-DD; presis filtrering skjer klient-side. */
  const dateOnly = sinceIso.slice(0, 10);
  const q = `repo:${owner}/${repo} is:issue is:closed closed:>=${dateOnly}`;
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=closed&order=desc&per_page=100`;
  try {
    const data = await githubFetch(url, { token });
    const items = data.items || [];
    return items.filter((i) => i.closed_at && Date.parse(i.closed_at) >= sinceMs);
  } catch (e) {
    dataWarnings.push(`Kunne ikke hente lukkede issues (søk): ${/** @type {Error} */ (e).message}`);
    return [];
  }
}

/**
 * @param {string} token
 * @param {string} owner
 * @param {string} repo
 * @param {string} sinceIso
 * @param {number} maxIssues
 */
async function fetchReturnTicketComments(token, owner, repo, sinceIso, maxIssues) {
  /** @type {string[]} */
  const lines = [];
  const sinceMs = Date.parse(sinceIso);
  const listUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=all&since=${encodeURIComponent(sinceIso)}&per_page=100&sort=updated&direction=desc`;
  let issues;
  try {
    issues = await githubFetchArrayPaged(listUrl, { token });
    issues = issues.filter((i) => i && !i.pull_request);
  } catch (e) {
    dataWarnings.push(`Kunne ikke liste nylig oppdaterte issues for kommentarer: ${/** @type {Error} */ (e).message}`);
    return lines;
  }

  const slice = issues.slice(0, maxIssues);
  if (issues.length > maxIssues) {
    dataWarnings.push(`Kommentarhugging: bare de første ${maxIssues} av ${issues.length} nylig oppdaterte issues ble sjekket for Return Ticket.`);
  }

  for (const issue of slice) {
    const num = issue.number;
    const commentsUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${num}/comments?per_page=100&sort=created&direction=desc`;
    try {
      await new Promise((r) => setTimeout(r, 75));
      const comments = await githubFetch(commentsUrl, { token });
      if (!Array.isArray(comments)) continue;
      for (const c of comments) {
        if (!c.body || !c.created_at) continue;
        if (Date.parse(c.created_at) < sinceMs) break;
        if (/return\s+ticket/i.test(c.body)) {
          const snippet = String(c.body).replace(/\s+/g, " ").trim().slice(0, 220);
          lines.push(
            `- **#${num}** kommentar av **${c.user?.login || "?"}** (${c.created_at}): _${snippet}${snippet.length >= 220 ? "…" : ""}_`,
          );
        }
      }
    } catch {
      dataWarnings.push(`Kommentarer for issue #${num} kunne ikke hentes (hopper over).`);
    }
  }
  return lines;
}

/**
 * @param {string} token
 * @param {string} owner
 * @param {string} repo
 * @param {string} sinceIso
 */
async function fetchRecentCommits(token, owner, repo, sinceIso) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${encodeURIComponent(sinceIso)}&per_page=25`;
  try {
    const commits = await githubFetch(url, { token });
    if (!Array.isArray(commits)) return [];
    return commits;
  } catch (e) {
    dataWarnings.push(`Kunne ikke hente commits: ${/** @type {Error} */ (e).message}`);
    return [];
  }
}

async function main() {
  const outPath = join(process.cwd(), OUTPUT_REL);
  await mkdir(dirname(outPath), { recursive: true });

  const token = process.env.GITHUB_TOKEN?.trim();
  const slug = repoSlug();
  const { owner, repo } = parseOwnerRepo(slug);
  const now = new Date();
  const generatedAt = now.toISOString();
  const generatedLocal = now.toLocaleString("nb-NO", { timeZone: TIMEZONE });

  if (!token) {
    dataWarnings.push("GITHUB_TOKEN mangler — API-kall hoppet over. Skriver minimalt stub (lokalt/bygg uten hemmeligheter).");
    const stub = [
      "# GitHub runtime status (stub)",
      "",
      "## Siste sync",
      "",
      `- **generated_at (UTC):** ${generatedAt}`,
      `- **generated_at (${TIMEZONE}):** ${generatedLocal}`,
      `- **timezone:** ${TIMEZONE}`,
      `- **repo:** ${slug}`,
      `- **data_warnings:**`,
      ...dataWarnings.map((w) => `  - ⚠️ ${w}`),
      "",
      "## AKTIVE EPICS",
      "",
      "_Ingen data — kjør workflow eller sett GITHUB_TOKEN og regenerer._",
      "",
      "## SISTE 24T",
      "",
      "_Ingen data._",
      "",
      "## BLOCKERS",
      "",
      "_Ingen data._",
      "",
      "## Neste steg (Google Drive — ikke i v0.1)",
      "",
      "Drive-opplasting er **ikke** implementert. Typiske veier senere: service account + Drive API, Apps Script-webhook, eller rclone. `google-github-actions/upload-cloud-storage` går til **GCS**, ikke Drive.",
      "",
    ].join("\n");
    await writeFile(outPath, stub, "utf8");
    console.log(`Wrote stub: ${outPath}`);
    return;
  }

  const since24 = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sinceIso = since24.toISOString().replace(/\.\d{3}Z$/, "Z");
  const sinceMs = since24.getTime();

  /** @type {string[]} */
  const epicsMd = [];
  /** @type {string[]} */
  const closedMd = [];
  /** @type {string[]} */
  const blockersMd = [];
  /** @type {string[]} */
  const commitsMd = [];

  try {
    const openIssues = await fetchOpenIssues(token, owner, repo);
    const epicSeen = new Set();
    for (const issue of openIssues) {
      if (!isEpicCandidate(issue)) continue;
      if (epicSeen.has(issue.number)) continue;
      epicSeen.add(issue.number);
      epicsMd.push(formatIssueMd(issue, "ukjent"));
    }
    for (const issue of openIssues) {
      if (!hasBlockerLabel(issue)) continue;
      blockersMd.push(formatIssueMd(issue, "ukjent"));
    }
  } catch (e) {
    dataWarnings.push(`Åpne issues: ${/** @type {Error} */ (e).message}`);
  }

  const closed = await fetchClosedSinceSearch(token, owner, repo, sinceIso, sinceMs);
  for (const issue of closed) {
    closedMd.push(
      [
        `- **#${issue.number}** ${issue.title || ""}`,
        `  - **closed_at:** ${issue.closed_at || "?"}`,
        `  - **labels:** ${labelNames(issue).join(", ") || "(ingen)"}`,
        `  - **url:** ${issue.html_url || ""}`,
      ].join("\n"),
    );
  }

  const rtLines = await fetchReturnTicketComments(token, owner, repo, sinceIso, 35);
  const commits = await fetchRecentCommits(token, owner, repo, sinceIso);
  for (const c of commits) {
    const msg = (c.commit?.message || "").split("\n")[0]?.trim() || "(tom)";
    const sha = c.sha?.slice(0, 7) || "?";
    const d = c.commit?.author?.date || "?";
    commitsMd.push(`- **${sha}** (${d}) ${msg}`);
  }

  const md = [
    "# GitHub runtime status",
    "",
    "_Automatisk generert for @navigator / Daily Sync. Ikke rediger manuelt — overskrives av workflow._",
    "",
    "## Siste sync",
    "",
    `- **generated_at (UTC):** ${generatedAt}`,
    `- **generated_at (${TIMEZONE}):** ${generatedLocal}`,
    `- **timezone:** ${TIMEZONE}`,
    `- **repo:** ${slug}`,
    dataWarnings.length
      ? `- **data_warnings:**\n${dataWarnings.map((w) => `  - ⚠️ ${w}`).join("\n")}`
      : `- **data_warnings:** (ingen)`,
    "",
    "## AKTIVE EPICS",
    "",
    "Åpne issues med `Epic:`-tittel, **eller** `type: initiative` i KL-META, **eller** label `initiative`. **status (prosjekt)** er ikke med i v0.1 (må kobles til Projects GraphQL senere) → **ukjent**.",
    "",
    epicsMd.length ? epicsMd.join("\n\n") : "_Ingen matchende epics akkurat nå._",
    "",
    "## SISTE 24T",
    "",
    `Vindu: commits/issues lukket/oppdatert etter **${sinceIso}** (sirket ~24 timer).`,
    "",
    "### Lukkede issues",
    "",
    closedMd.length ? closedMd.join("\n\n") : "_Ingen._",
    "",
    "### Kommentarer (Return Ticket-lignende)",
    "",
    rtLines.length ? rtLines.join("\n") : "_Ingen treff i søkt utsnitt._",
    "",
    "### Commits",
    "",
    commitsMd.length ? commitsMd.join("\n") : "_Ingen eller ikke tilgjengelig._",
    "",
    "## BLOCKERS",
    "",
    "Åpne issues med label som matcher `blocker`, `high priority`, `P1`, `priority: P1` e.l.",
    "",
    blockersMd.length ? blockersMd.join("\n\n") : "_Ingen matchende blockers._",
    "",
    "## Neste steg (Google Drive — ikke i v0.1)",
    "",
    "Drive-synk er **parkert**. Krever avklarte credentials og mappe: f.eks. service account + Drive API (`GOOGLE_*` secrets), Apps Script-webhook, eller rclone. **GCS-upload** (`google-github-actions/upload-cloud-storage`) er ikke det samme som Google Drive.",
    "",
  ].join("\n");

  await writeFile(outPath, md, "utf8");
  console.log(`Wrote: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
