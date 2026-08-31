/**
 * #125I-B FOUC diagnosis — timeline metrics with delayed _astro/ CSS.
 * Usage: node scripts/diagnose-125i-b-fouc.mjs [baseUrl] [--mobile]
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const baseUrl = process.argv.find((a) => a.startsWith("http")) ?? "http://127.0.0.1:4321";
const mobile = process.argv.includes("--mobile");
const label = mobile ? "mobile" : "desktop";
const outDir = join(process.cwd(), "tmp/nav-jump-125i-b", label);
const routes = ["/no/", "/no/hub/", "/no/lyd-i-hverdagen/", "/no/chat/"];
const viewport = mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 };

const measureFn = () => {
  const html = document.documentElement;
  const body = document.body;
  const fixed = document.querySelector("body > header.fixed");
  const inner = document.querySelector("body > header.fixed header");
  const nav = document.querySelector("body > header.fixed nav");
  const content = document.querySelector("[data-vox-shell-main]") ?? document.querySelector("body > header.fixed ~ div.mx-auto");
  const first = content?.querySelector("main, section, h1");
  const astroCss = [...document.querySelectorAll('link[rel="stylesheet"]')].some((l) =>
    l.href.includes("/_astro/"),
  );
  const shellCss = [...document.querySelectorAll('link[rel="stylesheet"]')].some((l) =>
    l.href.includes("shell-first-paint"),
  );

  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      top: +r.top.toFixed(2),
      h: +r.height.toFixed(2),
      pt: cs.paddingTop,
      mt: cs.marginTop,
    };
  };

  const cs = (el) => (el ? getComputedStyle(el) : null);

  return {
    t: +performance.now().toFixed(1),
    theme: html.getAttribute("data-theme"),
    fonts: document.fonts?.status ?? "n/a",
    astroCssLoaded: astroCss,
    shellCssLink: shellCss,
    htmlMargin: cs(html)?.margin,
    bodyMargin: cs(body)?.margin,
    bodyPt: cs(body)?.paddingTop,
    fixedPos: cs(fixed)?.position,
    header: box(inner),
    nav: box(nav),
    content: box(content),
    first: box(first),
    wm: (() => {
      const w = document.querySelector("body > header.fixed header .font-display");
      if (!w) return null;
      const c = getComputedStyle(w);
      return { ff: c.fontFamily.split(",")[0], fw: c.fontWeight, lh: c.lineHeight, h: box(w)?.h };
    })(),
  };
};

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const summary = [];

for (const route of routes) {
  const ctx = await browser.newContext({ viewport, colorScheme: "light" });
  await ctx.addInitScript(() => localStorage.setItem("vox-theme", "light"));
  await ctx.route("**/_astro/**", async (r) => {
    await new Promise((res) => setTimeout(res, 800));
    await r.continue();
  });
  const page = await ctx.newPage();
  const timeline = [];

  const snap = async (lbl) => {
    if (lbl === "commit") await page.waitForSelector("body", { timeout: 15000 }).catch(() => {});
    const m = await page.evaluate(measureFn);
    m.label = lbl;
    timeline.push(m);
    return m;
  };

  await page.goto(`${baseUrl}${route}`, { waitUntil: "commit", timeout: 30000 });
  await snap("commit");
  await page.waitForTimeout(16);
  await snap("16ms");
  await page.waitForTimeout(84);
  await snap("100ms");
  await page.waitForLoadState("networkidle").catch(() => {});
  await snap("idle");

  const d = (pick) => {
    const v = timeline.map(pick).filter((x) => x != null);
    return v.length ? +(Math.max(...v) - Math.min(...v)).toFixed(2) : 0;
  };

  summary.push({
    route,
    commit: timeline[0],
    idle: timeline.at(-1),
    deltas: {
      headerTop: d((m) => m.header?.top),
      headerH: d((m) => m.header?.h),
      navTop: d((m) => m.nav?.top),
      contentTop: d((m) => m.content?.top),
      contentPt: d((m) => parseFloat(m.content?.pt) || 0),
      firstTop: d((m) => m.first?.top),
      bodyMargin: timeline[0]?.bodyMargin !== timeline.at(-1)?.bodyMargin,
    },
  });
  await ctx.close();
}

await browser.close();
await writeFile(join(outDir, "report.json"), JSON.stringify({ baseUrl, mobile, summary }, null, 2));
console.log(JSON.stringify(summary, null, 2));
