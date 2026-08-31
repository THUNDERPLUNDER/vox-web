/** Quick baseline compare without CSS delay — first vs stable metrics */
import { chromium } from "playwright";

const baselines = [
  { url: "http://127.0.0.1:4321", label: "pre-125H" },
  { url: "http://127.0.0.1:4322", label: "125H-init" },
];

const measureFn = () => {
  const inner = document.querySelector("body > header.fixed header");
  const nav = document.querySelector("body > header.fixed nav");
  const content = document.querySelector("body > header.fixed ~ div.mx-auto");
  const chatCta = document.querySelector("body > header.fixed a.rounded-full");
  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: +r.top.toFixed(2), h: +r.height.toFixed(2), pt: getComputedStyle(el).paddingTop };
  };
  return {
    header: box(inner),
    nav: box(nav),
    content: box(content),
    chatCta: box(chatCta),
    navLinkCount: document.querySelectorAll("body > header.fixed nav a").length,
  };
};

const browser = await chromium.launch({ headless: true });
const results = [];

for (const { url, label } of baselines) {
  for (const mobile of [false, true]) {
    const ctx = await browser.newContext({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 },
      colorScheme: "light",
    });
    await ctx.addInitScript(() => localStorage.setItem("vox-theme", "light"));
    const page = await ctx.newPage();

    // refresh test
    await page.goto(`${url}/no/hub/`, { waitUntil: "commit" });
    const atCommit = await page.evaluate(measureFn);
    await page.waitForLoadState("networkidle");
    const atIdle = await page.evaluate(measureFn);

    // nav click test
    await page.goto(`${url}/no/`, { waitUntil: "networkidle" });
    const beforeClick = await page.evaluate(measureFn);
    const navTarget =
      label === "pre-125H"
        ? page.locator('header nav a:has-text("Emnehuber")')
        : page.locator('header nav a:has-text("Hjelp")');
    if ((await navTarget.count()) > 0) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "commit" }),
        navTarget.first().click(),
      ]);
    }
    const afterClickCommit = await page.evaluate(measureFn);
    await page.waitForLoadState("networkidle");
    const afterClickIdle = await page.evaluate(measureFn);

    results.push({ label, mobile, refresh: { atCommit, atIdle }, navClick: { beforeClick, afterClickCommit, afterClickIdle } });
    await ctx.close();
  }
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
