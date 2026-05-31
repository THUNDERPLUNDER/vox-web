/* CONTRACT: Build-time check — VIS Runtime Feed registry and /vis/ wiring. */
import { validateVisRuntimeFeedGuard } from "../src/lib/vis-runtime-feed-guard.ts";

const errors = validateVisRuntimeFeedGuard();

if (errors.length > 0) {
  console.error("VIS runtime feed guard failed:\n");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("VIS runtime feed guard OK");
