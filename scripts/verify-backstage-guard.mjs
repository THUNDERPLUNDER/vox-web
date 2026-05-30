/* CONTRACT: Build-time check — Backstage registry, links and guard limit alignment. */
import { validateBackstageGuard } from "../src/lib/backstage-guard.ts";

const errors = validateBackstageGuard();

if (errors.length > 0) {
  console.error("Backstage guard failed:\n");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("Backstage guard OK");
