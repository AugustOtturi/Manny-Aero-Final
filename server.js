// Hostinger's Node.js panel expects a `server.js` entry file.
// The real entry point is server.mjs — this shim loads it and logs
// loudly so a startup crash is always visible in the runtime logs.
//
// Hostinger's Express preset copies the repo + node_modules into the
// runtime dir but never runs (or ships) the Astro build, so if no
// build output exists yet we build right here on first boot. The
// output persists in the runtime dir, so this only runs once per
// deploy.
import { existsSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";

console.log(
  `[boot] node ${process.version} | NODE_ENV=${process.env.NODE_ENV ?? "(unset)"} | PORT=${process.env.PORT ?? "(unset)"} | cwd=${process.cwd()}`
);

const ls = (p) => {
  try {
    return readdirSync(p).join(", ") || "(empty)";
  } catch {
    return "(missing)";
  }
};
console.log(`[boot] ls .: ${ls(".")}`);
console.log(`[boot] ls ./dist: ${ls("./dist")}`);

process.on("uncaughtException", (err) => {
  console.error("[boot] uncaughtException:", err);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.error("[boot] unhandledRejection:", err);
  process.exit(1);
});

const hasBuild =
  existsSync("./dist/server/entry.mjs") || existsSync("./server/entry.mjs");
if (!hasBuild) {
  console.log("[boot] no Astro build output found — running `npx astro build`...");
  execSync("npx astro build", { stdio: "inherit" });
  console.log("[boot] astro build finished.");
}

import("./server.mjs").catch((err) => {
  console.error("[boot] failed to start server.mjs:", err);
  process.exit(1);
});
