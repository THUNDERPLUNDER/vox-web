/* CONTRACT: Build-time check — active sprint must not be archived on VIS. */
import { validateVisSprintGuard } from "../src/lib/vis-sprint-guard.ts";

const errors = validateVisSprintGuard();

if (errors.length > 0) {
  console.error("VIS sprint guard failed:\n");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("VIS sprint guard OK");
