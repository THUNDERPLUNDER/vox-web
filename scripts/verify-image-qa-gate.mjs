/* CONTRACT: Build-time check — image QA gated by IMAGE_QA_DEV_ENABLED; blocked on Vercel Production. */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const gatePath = join(process.cwd(), "src/lib/image-qa-dev-gate.ts");
const source = readFileSync(gatePath, "utf8");
const errors = [];

if (source.includes("import.meta.env.DEV")) {
  errors.push("image-qa-dev-gate must not auto-enable via import.meta.env.DEV — use IMAGE_QA_DEV_ENABLED only");
}

if (!source.includes('readEnv("VERCEL_ENV") === "production"')) {
  errors.push("image-qa-dev-gate must block when VERCEL_ENV is production");
}

if (!source.includes("IMAGE_QA_DEV_ENABLED")) {
  errors.push("image-qa-dev-gate must require IMAGE_QA_DEV_ENABLED");
}

const pagePath = join(process.cwd(), "src/pages/dev/image-qa.astro");
const pageSource = readFileSync(pagePath, "utf8");
if (!pageSource.includes("isImageQaDevEnabled")) {
  errors.push("/dev/image-qa must call isImageQaDevEnabled()");
}

const apiPath = join(process.cwd(), "src/pages/api/dev/image-vision.ts");
const apiSource = readFileSync(apiPath, "utf8");
if (!apiSource.includes("isImageQaDevEnabled")) {
  errors.push("/api/dev/image-vision must call isImageQaDevEnabled()");
}

if (errors.length > 0) {
  console.error("Image QA gate verify failed:\n");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("Image QA gate OK");
