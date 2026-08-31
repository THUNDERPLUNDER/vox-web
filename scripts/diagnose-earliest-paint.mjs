/** Earliest-paint capture with delayed CSS — video + timeline */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const baseUrl = process.argv[2] ?? "https://vox.raddum.no";
const outDir = join(process.cwd(), "tmp/nav-jump-r4/earliest-paint");
await mkdir(outDir, { recursive: true });

const measureFn = () => {
  const inner = document.querySelector("body > header.fixed header");
  const nav = document.querySelector("body > header.fixed nav");
  const content = document.querySelector(".vox-shell-content");
  const r = (el) => (el ? +el.getBoundingClientRect().top.toFixed(2) : null);
  const h = (el) => (el ? +el.getBoundingClientRect().height.toFixed(2) : null);
  return {
    t: +performance.now().toFixed(1),
    hasHeader: !!inner,
    headerTop: r(inner),
    headerH: h(inner),
    navTop: r(nav),
    contentPt: content ? getComputedStyle(content).paddingTop : null,
    bodyMargin: document.body ? getComputedStyle(document.body).margin : null,
    critical: [...document.querySelectorAll("style")].some((s) => s.textContent?.includes("125H-R5")),
  };
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  recordVideo: { dir: outDir, size: { width: 1280, height: 800 } },
  colorScheme: "light",
});
await context.addInitScript(() => localStorage.setItem("vox-theme", "light"));
await context.route("**/_astro/**", async (route) => {
  await new Promise((r) => setTimeout(r, 600));
  await route.continue();
});

const page = await context.newPage();
const timeline = [];

await page.goto(`${baseUrl}/no/hub/`, { waitUntil: "commit", timeout: 60000 });

for (let i = 0; i < 40; i++) {
  timeline.push({ frame: i, ...(await page.evaluate(measureFn)) });
  await page.screenshot({ path: join(outDir, `frame-${String(i).padStart(2, "0")}.png`) });
  await page.waitForTimeout(32);
}

await page.waitForLoadState("networkidle").catch(() => {});
timeline.push({ event: "networkidle", ...(await page.evaluate(measureFn)) });

const video = await page.video()?.path();
await context.close();
await browser.close();

await writeFile(join(outDir, "timeline.json"), JSON.stringify(timeline, null, 2));

const headerTops = timeline.map((t) => t.headerTop).filter((v) => v != null);
const navTops = timeline.map((t) => t.navTop).filter((v) => v != null);
console.log(
  JSON.stringify(
    {
      video,
      headerTopDelta: Math.max(...headerTops) - Math.min(...headerTops),
      navTopDelta: Math.max(...navTops) - Math.min(...navTops),
      first3: timeline.slice(0, 3),
      mid: timeline.slice(18, 22),
      last: timeline.at(-1),
    },
    null,
    2,
  ),
);
