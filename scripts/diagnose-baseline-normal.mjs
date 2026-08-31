/** Normal-load baseline compare (no CSS delay) */
import { chromium } from "playwright";

const baselines = [
  { url: "http://127.0.0.1:4321", label: "pre-125H" },
  { url: "http://127.0.0.1:4322", label: "125H-init" },
];

const measureFn = () => {
  const inner = document.querySelector("body > header.fixed header");
  const nav = document.querySelector("body > header.fixed nav");
  const content = document.querySelector("body > header.fixed ~ div.mx-auto");
  const first = content?.querySelector("main, section, h1");
  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: +r.top.toFixed(2), h: +r.height.toFixed(2), pt: getComputedStyle(el).paddingTop };
  };
  return { header: box(inner), nav: box(nav), content: box(content), first: box(first), navLinks: document.querySelectorAll("header nav a").length };
};

const browser = await chromium.launch({ headless: true });
const out = [];

for (const { url, label } of baselines) {
  for (const mobile of [false, true]) {
    const ctx = await browser.newContext({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 },
      colorScheme: "light",
    });
    await ctx.addInitScript(() => localStorage.setItem("vox-theme", "light"));
    const page = await ctx.newPage();

    const timeline = [];
    page.on("framenavigated", async () => {
      try {
        timeline.push({ event: "frame", ...(await page.evaluate(measureFn)) });
      } catch (_) {}
    });

    await page.goto(`${url}/no/hub/`, { waitUntil: "commit" });
    timeline.push({ event: "commit", ...(await page.evaluate(measureFn)) });
    await page.waitForTimeout(16);
    timeline.push({ event: "16ms", ...(await page.evaluate(measureFn)) });
    await page.waitForTimeout(84);
    timeline.push({ event: "100ms", ...(await page.evaluate(measureFn)) });
    await page.waitForLoadState("networkidle");
    timeline.push({ event: "idle", ...(await page.evaluate(measureFn)) });

    // desktop nav click only
    if (!mobile) {
      await page.goto(`${url}/no/`, { waitUntil: "networkidle" });
      const before = await page.evaluate(measureFn);
      const target =
        label === "pre-125H"
          ? page.locator('header nav a:has-text("Emnehuber")')
          : page.locator('header nav a:has-text("Hjelp")');
      await Promise.all([page.waitForNavigation({ waitUntil: "commit" }), target.first().click()]);
      const clickCommit = await page.evaluate(measureFn);
      await page.waitForLoadState("networkidle");
      const clickIdle = await page.evaluate(measureFn);
      out.push({ label, mobile, refreshTimeline: timeline, navClick: { before, clickCommit, clickIdle } });
    } else {
      out.push({ label, mobile, refreshTimeline: timeline });
    }
    await ctx.close();
  }
}

await browser.close();
console.log(JSON.stringify(out, null, 2));
