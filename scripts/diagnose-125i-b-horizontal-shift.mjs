/**
 * #125I-B-R2 — horizontal layout shift diagnosis.
 * Usage: node scripts/diagnose-125i-b-horizontal-shift.mjs [baseUrl] [--mobile] [--nav-clicks]
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const baseUrl = process.argv.find((a) => a.startsWith("http")) ?? "http://127.0.0.1:4321";
const mobile = process.argv.includes("--mobile");
const navClicks = process.argv.includes("--nav-clicks");
const delayCssMs = Number(process.argv.find((a) => a.startsWith("--delay-css="))?.split("=")[1] ?? 0);
const label = mobile ? "mobile" : "desktop";
const outDir = join(process.cwd(), "tmp/nav-jump-125i-b-r2", label);
const joinUrl = (path) => `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
const routes = ["/no/", "/no/hub/", "/no/lyd-i-hverdagen/", "/no/chat/"];
const viewport = mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 };

const MEASURE_INIT = () => {
  window.__voxHShift = { samples: [], markers: [] };

  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      left: +r.left.toFixed(2),
      width: +r.width.toFixed(2),
      right: +r.right.toFixed(2),
      marginLeft: cs.marginLeft,
      marginRight: cs.marginRight,
      paddingLeft: cs.paddingLeft,
      paddingRight: cs.paddingRight,
      transform: cs.transform,
    };
  };

  const measure = (marker) => {
    try {
      const html = document.documentElement;
      const body = document.body;
      if (!body) {
        return {
          marker,
          t: +performance.now().toFixed(1),
          route: location.pathname,
          note: "body-not-ready",
        };
      }
    const outerHeader =
      document.querySelector("body > header.fixed") ?? document.querySelector("body > header");
    const headerInner = outerHeader?.querySelector(":scope > div > div.mx-auto");
    const headerComponent = outerHeader?.querySelector("header");
    const nav = headerComponent?.querySelector("nav");
    const wordmark =
      headerComponent?.querySelector(".font-display") ??
      headerComponent?.querySelector('a[aria-label="Viddel"]');
    const cta =
      headerComponent?.querySelector("a.sonic-pulse-cta") ??
      headerComponent?.querySelector('a[href*="/no/chat"]');
    const contentWrapper = document.querySelector(
      "body > header.fixed ~ div.mx-auto, body > header ~ div.mx-auto",
    );
    const firstContent =
      contentWrapper?.querySelector("main h1, main, section h1, h1") ??
      contentWrapper?.firstElementChild;

    const scrollbarW = window.innerWidth - html.clientWidth;
    const htmlCs = getComputedStyle(html);
    const bodyCs = getComputedStyle(body);

    const vwEls = [...document.querySelectorAll("*")]
      .filter((el) => {
        try {
          const w = getComputedStyle(el).width;
          const cls = typeof el.className === "string" ? el.className : "";
          return w.includes("vw") || cls.includes("w-screen");
        } catch {
          return false;
        }
      })
      .slice(0, 8)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        cls: (el.className?.toString?.() ?? "").slice(0, 80),
        width: getComputedStyle(el).width,
        left: +el.getBoundingClientRect().left.toFixed(2),
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
      }));

    return {
      marker,
      t: +performance.now().toFixed(1),
      route: location.pathname,
      innerWidth: window.innerWidth,
      htmlClientW: html.clientWidth,
      htmlScrollW: html.scrollWidth,
      bodyClientW: body.clientWidth,
      bodyScrollW: body.scrollWidth,
      scrollbarW,
      hasHOverflow: html.scrollWidth > html.clientWidth || body.scrollWidth > body.clientWidth,
      htmlOverflowX: htmlCs.overflowX,
      bodyOverflowX: bodyCs.overflowX,
      htmlScrollbarGutter: htmlCs.scrollbarGutter,
      bodyMargin: bodyCs.margin,
      htmlMargin: htmlCs.margin,
      outerHeader: box(outerHeader),
      headerInner: box(headerInner),
      headerComponent: box(headerComponent),
      nav: box(nav),
      wordmark: box(wordmark),
      cta: box(cta),
      contentWrapper: box(contentWrapper),
      firstContent: box(firstContent),
      fonts: document.fonts?.status ?? "n/a",
      astroCss: [...document.querySelectorAll('link[rel="stylesheet"]')].some((l) =>
        l.href.includes("/_astro/"),
      ),
      vwCandidates: vwEls,
    };
    } catch (err) {
      return { marker, t: +performance.now().toFixed(1), error: String(err) };
    }
  };

  const push = (marker) => {
    window.__voxHShift.samples.push(measure(marker));
  };

  push("sync-init");
  requestAnimationFrame(() => push("raf-1"));
  setTimeout(() => push("t-16ms"), 16);
  setTimeout(() => push("t-50ms"), 50);
  setTimeout(() => push("t-100ms"), 100);
  setTimeout(() => push("t-250ms"), 250);
  document.addEventListener("DOMContentLoaded", () => push("DOMContentLoaded"), { once: true });
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => push("fonts.ready"));
  }
  window.addEventListener("load", () => {
    push("load");
    setTimeout(() => push("load+500ms"), 500);
  });
};

function deltaSummary(samples) {
  const first = samples[0];
  const last = samples[samples.length - 1];
  if (!first || !last) return null;

  const d = (a, b, key) => {
    const fa = a?.[key];
    const la = b?.[key];
    if (!fa || !la) return null;
    return {
      left: +(la.left - fa.left).toFixed(2),
      width: +(la.width - fa.width).toFixed(2),
    };
  };

  return {
    from: first.marker,
    to: last.marker,
    innerWidth: last.innerWidth - first.innerWidth,
    htmlClientW: last.htmlClientW - first.htmlClientW,
    scrollbarW: last.scrollbarW - first.scrollbarW,
    hasHOverflow: { from: first.hasHOverflow, to: last.hasHOverflow },
    outerHeader: d(first, last, "outerHeader"),
    headerInner: d(first, last, "headerInner"),
    contentWrapper: d(first, last, "contentWrapper"),
    firstContent: d(first, last, "firstContent"),
    wordmark: d(first, last, "wordmark"),
    nav: d(first, last, "nav"),
    cta: d(first, last, "cta"),
  };
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const summary = [];

for (const route of routes) {
  const ctx = await browser.newContext({ viewport, colorScheme: "light" });
  await ctx.addInitScript(() => localStorage.setItem("vox-theme", "light"));
  await ctx.addInitScript(MEASURE_INIT);
  if (delayCssMs > 0) {
    await ctx.route("**/_astro/**", async (r) => {
      await new Promise((res) => setTimeout(res, delayCssMs));
      await r.continue();
    });
  }
  const page = await ctx.newPage();
  await page.goto(joinUrl(route), { waitUntil: "load" });
  await page.waitForTimeout(700);

  const samples = await page.evaluate(() => window.__voxHShift?.samples ?? []);
  const entry = { route, phase: "hard-refresh", samples, delta: deltaSummary(samples) };
  summary.push(entry);
  await writeFile(join(outDir, `${route.replace(/\//g, "_") || "root"}-refresh.json`), JSON.stringify(entry, null, 2));
  await ctx.close();
}

if (navClicks) {
  const ctx = await browser.newContext({ viewport, colorScheme: "light" });
  await ctx.addInitScript(() => localStorage.setItem("vox-theme", "light"));
  const page = await ctx.newPage();
  const chain = ["/no/", "/no/hub/", "/no/lyd-i-hverdagen/", "/no/chat/", "/no/"];
  const navHrefs = mobile
    ? null
    : [
        "/no",
        "/no/hub",
        "/no/lyd-i-hverdagen",
        "/no/chat",
        "/no",
      ];

  for (let i = 0; i < chain.length - 1; i++) {
    await ctx.addInitScript(MEASURE_INIT);
    await page.goto(joinUrl(chain[i]), { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);
    const target = chain[i + 1];
    const link = mobile
      ? page.locator(`footer a[href="${target.replace(/\/$/, "")}"], footer a[href="${target}"]`).first()
      : page.locator(`header nav a[href="${target.replace(/\/$/, "")}"], header nav a[href="${target}"]`).first();
    if ((await link.count()) === 0) continue;
    await link.click();
    await page.waitForLoadState("load");
    await page.waitForTimeout(700);
    const samples = await page.evaluate(() => window.__voxHShift?.samples ?? []);
    const entry = {
      route: `${chain[i]} -> ${chain[i + 1]}`,
      phase: "nav-click",
      samples,
      delta: deltaSummary(samples),
    };
    summary.push(entry);
  }
  await ctx.close();
}

const report = {
  baseUrl,
  viewport,
  label,
  generatedAt: new Date().toISOString(),
  summary: summary.map(({ route, phase, delta, samples }) => ({
    route,
    phase,
    delta,
    keyFrames: samples.filter((s) =>
      ["sync-init", "t-16ms", "DOMContentLoaded", "fonts.ready", "load", "load+500ms"].includes(s.marker),
    ),
  })),
};

await writeFile(join(outDir, "summary.json"), JSON.stringify(report, null, 2));

console.log(JSON.stringify(report.summary, null, 2));
await browser.close();
