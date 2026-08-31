/** Pixel-diff first vs last screenshot in diagnosis folder */
import { chromium } from "playwright";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { PNG } from "pngjs";

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: node scripts/compare-shots.mjs <dir>");
  process.exit(1);
}

const files = (await readdir(dir)).filter((f) => f.endsWith(".png")).sort();
const first = PNG.sync.read(await readFile(join(dir, files[0])));
const last = PNG.sync.read(await readFile(join(dir, files.at(-1))));
const w = Math.min(first.width, last.width);
const h = Math.min(first.height, last.height);
let diff = 0;
let maxDy = 0;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = (w * y + x) << 2;
    const d =
      Math.abs(first.data[i] - last.data[i]) +
      Math.abs(first.data[i + 1] - last.data[i + 1]) +
      Math.abs(first.data[i + 2] - last.data[i + 2]);
    if (d > 30) diff++;
  }
}
console.log({ dir, first: files[0], last: files.at(-1), diffPixels: diff, pct: ((diff / (w * h)) * 100).toFixed(3) + "%" });
