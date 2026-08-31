/**
 * #125H-R4 visual jump diagnosis — screenshots + timeline metrics.
 * Usage: node scripts/diagnose-nav-jump-visual.mjs [baseUrl] [--mobile] [--nav-click]
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const baseUrl = process.argv.find((a) => a.startsWith("http")) ?? "https://vox.raddum.no";
const mobile = process.argv.includes("--mobile");
const navClick = process.argv.includes("--nav-click");
const outDir = join(process.cwd(), "tmp/nav-jump-r4", baseUrl.includes("127.0.0.1") ? "local" : "prod");

const routes = ["/no/", "/no/hub/", "/no/lyd-i-hverdagen/", "/no/chat/"];
const viewport = mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 };

const measureFn = () => {
  const fixed = document.querySelector("body > header.fixed");
  const backdrop = fixed?.firstElementChild;
  const inner = document.querySelector("body > header.fixed header");
  const nav = document.querySelector("body > header.fixed nav");
  const active = [...document.querySelectorAll("body > header.fixed nav a")].find((a) => {
    const bg = getComputedStyle(a).backgroundColor;
    return bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
  });
  const content = document.querySelector(".vox-shell-content");
  const firstBlock = content?.querySelector("main, section, .land-page, .hub-page, h1");
  const wordmark = document.querySelector("body > header.fixed header .font-display");
  const criticalStyle = [...document.querySelectorAll("style")].some((s) =>
    s.textContent?.includes("125H-R5") || s.textContent?.includes("vox-shell-content"),
  );

  function box(el) {
    if (!el || !(el instanceof Element)) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      top: +r.top.toFixed(2),
      height: +r.height.toFixed(2),
      bottom: +r.bottom.toFixed(2),
      pt: cs.paddingTop,
      mt: cs.marginTop,
      ff: cs.fontFamily.split(",")[0].replace(/"/g, ""),
      lh: cs.lineHeight,
    };
  }

  const fixedCs = fixed instanceof Element ? getComputedStyle(fixed) : null;
  const bodyCs = document.body ? getComputedStyle(document.body) : null;
  const htmlCs = getComputedStyle(document.documentElement);

  return {
    t: +performance.now().toFixed(1),
    rs: document.readyState,
    fonts: document.fonts?.status ?? "n/a",
    theme: document.documentElement.getAttribute("data-theme"),
    criticalCssInDom: criticalStyle,
    bodyMargin: bodyCs?.margin ?? null,
    bodyPadding: bodyCs?.padding ?? null,
    htmlMargin: htmlCs.margin,
    scrollbarW: window.innerWidth - document.documentElement.clientWidth,
    fixedShell: box(fixed),
    backdrop: box(backdrop),
    headerInner: box(inner),
    nav: box(nav),
    activeNav: box(active),
    wordmark: box(wordmark),
    contentWrap: content
      ? {
          ...box(content),
          className: content.className,
        }
      : null,
    firstContent: box(firstBlock),
  };
};

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = [];

for (const route of routes) {
  const slug = route.replace(/\//g, "_").replace(/^_/, "").replace(/_$/, "") || "root";
  const dir = join(outDir, `${slug}${mobile ? "-mobile" : "-desktop"}${navClick ? "-nav" : "-refresh"}`);
  await mkdir(dir, { recursive: true });

  const context = await browser.newContext({
    viewport,
    colorScheme: "light",
    deviceScaleFactor: 2,
  });
  await context.addInitScript(() => {
    try {
      localStorage.setItem("vox-theme", "light");
    } catch (_) {}
  });

  const page = await context.newPage();
  const timeline = [];
  let shotIdx = 0;

  const snap = async (label) => {
    if (label === "commit") {
      await page.waitForSelector("body > header.fixed header", { timeout: 15000 }).catch(() => {});
    }
    const m = await page.evaluate(measureFn);
    m.label = label;
    timeline.push(m);
    const file = join(dir, `${String(shotIdx++).padStart(3, "0")}-${label.replace(/[^a-z0-9]+/gi, "-")}.png`);
    await page.screenshot({ path: file, fullPage: false });
    return m;
  };

  if (navClick && route !== "/no/") {
    await page.goto(`${baseUrl}/no/`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(500);
    const linkText =
      route.includes("hub") ? "Hjelp" : route.includes("lyd") ? "Lyd i hverdagen" : route.includes("chat") ? null : "Forside";
    if (linkText) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "commit", timeout: 30000 }),
        page.click(`header nav a:has-text("${linkText}")`),
      ]);
    } else {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "commit", timeout: 30000 });
    }
  } else {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "commit", timeout: 30000 });
  }

  await snap("commit");
  for (const ms of [16, 50, 100, 250]) {
    await page.waitForTimeout(16);
    await snap(`~${ms}ms`);
  }
  await page.waitForEvent("domcontentloaded", { timeout: 15000 }).catch(() => {});
  await snap("domcontentloaded");
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  }).catch(() => {});
  await snap("fonts.ready");
  await page.waitForLoadState("load").catch(() => {});
  await snap("load");
  await page.waitForTimeout(500);
  await snap("load+500ms");

  const deltas = {
    headerTop: delta(timeline, (m) => m.headerInner?.top),
    headerH: delta(timeline, (m) => m.headerInner?.height),
    backdropH: delta(timeline, (m) => m.backdrop?.height),
    navTop: delta(timeline, (m) => m.nav?.top),
    contentTop: delta(timeline, (m) => m.contentWrap?.top),
    firstContentTop: delta(timeline, (m) => m.firstContent?.top),
    bodyMarginChanged: timeline[0]?.bodyMargin !== timeline.at(-1)?.bodyMargin,
    contentPtChanged: timeline[0]?.contentWrap?.pt !== timeline.at(-1)?.contentWrap?.pt,
  };

  report.push({ route, dir, timeline: timeline.map(summarize), deltas, visualJumpLikely: Object.values(deltas).some((v) => typeof v === "number" && v > 1) || deltas.bodyMarginChanged || deltas.contentPtChanged });

  await context.close();
}

await browser.close();
await writeFile(join(outDir, "report.json"), JSON.stringify({ baseUrl, mobile, navClick, report }, null, 2));

console.log(JSON.stringify(report.map((r) => ({ route: r.route, deltas: r.deltas, visualJumpLikely: r.visualJumpLikely, shots: r.dir })), null, 2));

function delta(arr, pick) {
  const vals = arr.map(pick).filter((v) => v != null);
  if (!vals.length) return 0;
  return +(Math.max(...vals) - Math.min(...vals)).toFixed(2);
}

function summarize(m) {
  return {
    label: m.label,
    t: m.t,
    theme: m.theme,
    fonts: m.fonts,
    criticalCssInDom: m.criticalCssInDom,
    bodyMargin: m.bodyMargin,
    headerTop: m.headerInner?.top,
    headerH: m.headerInner?.height,
    backdropH: m.backdrop?.height,
    navTop: m.nav?.top,
    contentTop: m.contentWrap?.top,
    contentPt: m.contentWrap?.pt,
    firstContentTop: m.firstContent?.top,
    wmH: m.wordmark?.height,
    wmFF: m.wordmark?.ff,
  };
}
