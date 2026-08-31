/** Cross-route header position compare at stable load */
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "https://vox.raddum.no";
const routes = ["/no/", "/no/hub/", "/no/lyd-i-hverdagen/", "/no/chat/"];

const measure = () => {
  const inner = document.querySelector("body > header.fixed header");
  const nav = document.querySelector("body > header.fixed nav");
  const content = document.querySelector(".vox-shell-content");
  const first = content?.querySelector("main, section, .land-page, .hub-page, h1");
  const r = (el) => el ? +el.getBoundingClientRect().top.toFixed(2) : null;
  return {
    headerTop: r(inner),
    headerH: inner ? +inner.getBoundingClientRect().height.toFixed(2) : null,
    navTop: r(nav),
    contentTop: r(content),
    firstContentTop: r(first),
    contentPt: content ? getComputedStyle(content).paddingTop : null,
  };
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.addInitScript(() => localStorage.setItem("vox-theme", "light"));

const rows = [];
for (const route of routes) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  rows.push({ route, ...(await page.evaluate(measure)) });
}
await browser.close();
console.log(JSON.stringify(rows, null, 2));
const tops = rows.map((r) => r.headerTop);
const navTops = rows.map((r) => r.navTop);
console.log("headerTop unique:", [...new Set(tops)], "navTop unique:", [...new Set(navTops)]);
