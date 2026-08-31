/**
 * #125H-R7 baseline comparison — content/header metrics over time with delayed CSS.
 * Usage: node scripts/diagnose-baseline-compare.mjs <baseUrl> <label> [--mobile] [--nav-click]
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const args = process.argv.slice(2);
const baseUrl = args.find((a) => a.startsWith("http")) ?? "http://127.0.0.1:4321";
const label = args.find((a) => !a.startsWith("http") && !a.startsWith("--")) ?? "baseline";
const mobile = args.includes("--mobile");
const navClick = args.includes("--nav-click");
const outDir = join(process.cwd(), "tmp/nav-jump-r7", label, mobile ? "mobile" : "desktop");
const routes = ["/no/", "/no/hub/", "/no/lyd-i-hverdagen/", "/no/chat/"];
const viewport = mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 };

const measureFn = () => {
  const fixed = document.querySelector("body > header.fixed");
  const inner = document.querySelector("body > header.fixed header");
  const nav = document.querySelector("body > header.fixed nav");
  const content =
    document.querySelector(".vox-shell-content") ??
    document.querySelector("body > header.fixed ~ div.mx-auto");
  const firstBlock = content?.querySelector("main, section, .land-page, .hub-page, h1");

  function box(el) {
    if (!el || !(el instanceof Element)) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      top: +r.top.toFixed(2),
      height: +r.height.toFixed(2),
      pt: cs.paddingTop,
    };
  }

  return {
    t: +performance.now().toFixed(1),
    headerTop: box(inner)?.top ?? null,
    headerH: box(inner)?.height ?? null,
    navTop: box(nav)?.top ?? null,
    contentTop: box(content)?.top ?? null,
    contentPt: box(content)?.pt ?? null,
    firstContentTop: box(firstBlock)?.top ?? null,
    bodyMargin: document.body ? getComputedStyle(document.body).margin : null,
  };
};

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = [];

for (const route of routes) {
  const slug = route.replace(/\//g, "_").replace(/^_/, "").replace(/_$/, "") || "root";
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
  await context.route("**/_astro/**", async (r) => {
    await new Promise((res) => setTimeout(res, 600));
    await r.continue();
  });

  const page = await context.newPage();
  const timeline = [];

  const snap = async (snapLabel) => {
    if (snapLabel === "commit") {
      await page.waitForSelector("body > header.fixed header", { timeout: 15000 }).catch(() => {});
    }
    const m = await page.evaluate(measureFn);
    m.label = snapLabel;
    timeline.push(m);
    return m;
  };

  if (navClick && route !== "/no/") {
    await page.goto(`${baseUrl}/no/`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(300);
    const linkText = route.includes("hub")
      ? null
      : route.includes("lyd")
        ? null
        : route.includes("chat")
          ? null
          : "Forside";
    if (linkText) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "commit", timeout: 30000 }),
        page.click(`header nav a:has-text("${linkText}")`),
      ]);
    } else {
      const navLabels = ["Hjelp", "Lyd i hverdagen", "Emnehuber", "Kom i gang", "Hørehjelpen"];
      let clicked = false;
      for (const text of navLabels) {
        const loc = page.locator(`header nav a:has-text("${text}")`);
        if ((await loc.count()) > 0) {
          await Promise.all([
            page.waitForNavigation({ waitUntil: "commit", timeout: 30000 }),
            loc.first().click(),
          ]);
          clicked = true;
          break;
        }
      }
      if (!clicked) {
        await page.goto(`${baseUrl}${route}`, { waitUntil: "commit", timeout: 30000 });
      }
    }
  } else {
    const res = await page.goto(`${baseUrl}${route}`, { waitUntil: "commit", timeout: 30000 });
    if (res?.status() === 404) {
      report.push({ route, skipped: true, reason: "404" });
      await context.close();
      continue;
    }
  }

  await snap("commit");
  for (const ms of [16, 50, 100, 250]) {
    await page.waitForTimeout(ms === 16 ? 16 : ms - (timeline.at(-1)?.t ?? 0) > 0 ? 16 : 16);
    await snap(`~${ms}ms`);
  }
  await page.waitForLoadState("load").catch(() => {});
  await snap("load");
  await page.waitForTimeout(500);
  await snap("load+500ms");

  const pick = (fn) => timeline.map(fn).filter((v) => v != null);
  const delta = (fn) => {
    const vals = pick(fn);
    return vals.length ? +(Math.max(...vals) - Math.min(...vals)).toFixed(2) : 0;
  };

  const pts = pick((m) => m.contentPt);
  const firstPt = timeline.find((m) => m.contentPt)?.contentPt ?? null;
  const lastPt = timeline.at(-1)?.contentPt ?? null;

  report.push({
    route,
    timeline,
    deltas: {
      headerTop: delta((m) => m.headerTop),
      headerH: delta((m) => m.headerH),
      navTop: delta((m) => m.navTop),
      contentTop: delta((m) => m.contentTop),
      contentPt: delta((m) => parseFloat(m.contentPt) || 0),
      firstContentTop: delta((m) => m.firstContentTop),
    },
    contentPtFirst: firstPt,
    contentPtLast: lastPt,
    contentPtChanged: firstPt !== null && lastPt !== null && firstPt !== lastPt,
    contentPtLateAppear: timeline[0]?.contentPt == null && lastPt != null,
    visualJumpLikely:
      delta((m) => m.contentTop) > 1 ||
      delta((m) => m.firstContentTop) > 1 ||
      (firstPt !== null && lastPt !== null && firstPt !== lastPt) ||
      (timeline[0]?.contentPt == null && lastPt != null),
  });

  await context.close();
}

await browser.close();
await writeFile(join(outDir, "report.json"), JSON.stringify({ label, baseUrl, mobile, navClick, report }, null, 2));
console.log(JSON.stringify({ label, mobile, navClick, summary: report.map((r) => ({ route: r.route, skipped: r.skipped, deltas: r.deltas, contentPtFirst: r.contentPtFirst, contentPtLast: r.contentPtLast, contentPtLateAppear: r.contentPtLateAppear, visualJumpLikely: r.visualJumpLikely })) }, null, 2));
