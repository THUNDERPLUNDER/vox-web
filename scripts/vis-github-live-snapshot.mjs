/**
 * CONTRACT: Build a tiny live GitHub snapshot for VIS dashboard.
 *
 * This script fetches a very small, explicit issue set and writes a JSON snapshot
 * that can be rendered in `public/vis/raw/KlarLyd_Live_Board_Roadmap_v01.html`.
 *
 * Why this exists:
 * - Keep the v1 integration thin and verifiable.
 * - Avoid full GitHub Project auth/setup in this step.
 * - Provide real issue id/title/state/url from GitHub now.
 *
 * Usage:
 *   npm run vis:github:snapshot
 */

import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const OWNER = "THUNDERPLUNDER";
const REPO = "vox-web";
const ISSUE_CASES = [
  { issueId: 2, kind: "track", slot: "roadmap-now" },
  { issueId: 3, kind: "task", slot: "board-done" },
];

async function fetchIssue(issueId) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/issues/${issueId}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "vox-web-vis-live-snapshot",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch issue #${issueId}: ${response.status}`);
  }

  const issue = await response.json();
  return {
    issueId: issue.number,
    title: issue.title,
    status: issue.state,
    url: issue.html_url,
    updatedAt: issue.updated_at,
  };
}

async function main() {
  const rows = [];
  for (const item of ISSUE_CASES) {
    const issue = await fetchIssue(item.issueId);
    rows.push({
      ...item,
      ...issue,
    });
  }

  const payload = {
    version: "v1",
    source: "GitHub Issues REST API",
    note: "Status in this v1 snapshot is GitHub issue state (open/closed). KL Status from Project fields comes later.",
    repository: `${OWNER}/${REPO}`,
    fetchedAt: new Date().toISOString(),
    items: rows,
  };

  const outputPath = join(
    process.cwd(),
    "public/vis/raw/KlarLyd_Live_Board_Roadmap_v01.github-state.json",
  );

  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote snapshot: ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
