/* CONTRACT: Build-time check — Lab routes gated by password auth; Production needs VIDDEL_LAB_PUBLIC_ENABLED. */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const errors = [];

const authPath = join(process.cwd(), "src/lib/lab-auth-v01.ts");
if (!existsSync(authPath)) {
  errors.push("Missing src/lib/lab-auth-v01.ts");
} else {
  const source = readFileSync(authPath, "utf8");
  if (!source.includes("VIDDEL_LAB_PUBLIC_ENABLED")) {
    errors.push("lab-auth must gate Production with VIDDEL_LAB_PUBLIC_ENABLED");
  }
  if (!source.includes("VIDDEL_LAB_PASSWORD")) {
    errors.push("lab-auth must use VIDDEL_LAB_PASSWORD");
  }
  if (!source.includes("VIDDEL_LAB_COOKIE_SECRET")) {
    errors.push("lab-auth must use VIDDEL_LAB_COOKIE_SECRET");
  }
  if (!source.includes("isVercelProduction()")) {
    errors.push("lab-auth must check VERCEL_ENV production for public gate");
  }
  if (!source.includes("HttpOnly")) {
    errors.push("lab-auth cookies must be HttpOnly");
  }
  if (!source.includes("SameSite=Lax")) {
    errors.push("lab-auth cookies must use SameSite=Lax");
  }
}

const labPage = join(process.cwd(), "src/pages/lab/image-qa.astro");
if (!existsSync(labPage)) {
  errors.push("Missing /lab/image-qa page");
} else {
  const page = readFileSync(labPage, "utf8");
  if (!page.includes("hasValidLabSession")) {
    errors.push("/lab/image-qa must call hasValidLabSession()");
  }
  if (!page.includes("/api/lab/image-vision")) {
    errors.push("/lab/image-qa must POST to /api/lab/image-vision");
  }
}

const labApi = join(process.cwd(), "src/pages/api/lab/image-vision.ts");
if (!existsSync(labApi)) {
  errors.push("Missing /api/lab/image-vision route");
}

const knowledgeUxPage = join(process.cwd(), "src/pages/lab/knowledge-ux.astro");
if (!existsSync(knowledgeUxPage)) {
  errors.push("Missing /lab/knowledge-ux page");
} else {
  const page = readFileSync(knowledgeUxPage, "utf8");
  if (!page.includes("hasValidLabSession")) {
    errors.push("/lab/knowledge-ux must call hasValidLabSession()");
  }
  if (!page.includes("CLM-SIT-001-OTI-001")) {
    errors.push("/lab/knowledge-ux must identify its verified claim");
  }
  if (!page.includes("V3_EDITORIAL_APPROVED")) {
    errors.push("/lab/knowledge-ux must expose the claim verification status");
  }
  if (!page.includes('releaseLabel: "BETA"')) {
    errors.push("/lab/knowledge-ux must expose a release label separately from verification status");
  }
  if (!page.includes('Astro.response.headers.set("X-Robots-Tag", "noindex, nofollow")')) {
    errors.push("/lab/knowledge-ux must be noindex, nofollow");
  }
}

const legacyDevPage = join(process.cwd(), "src/pages/dev/image-qa.astro");
const legacyDevApi = join(process.cwd(), "src/pages/api/dev/image-vision.ts");
if (existsSync(legacyDevPage)) {
  errors.push("Legacy /dev/image-qa must be removed — canonical route is /lab/image-qa");
}
if (existsSync(legacyDevApi)) {
  errors.push("Legacy /api/dev/image-vision must be removed — canonical route is /api/lab/image-vision");
}

if (errors.length > 0) {
  console.error("Lab gate verify failed:\n");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("Lab gate OK");
