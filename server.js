// Hostinger's Node.js panel expects a `server.js` entry file.
// The real entry point is server.mjs — this shim loads it and logs
// loudly so a startup crash is always visible in the runtime logs.
//
// Hostinger's Express preset copies the repo + node_modules into the
// runtime dir but never runs (or ships) the Astro build, so if no
// build output exists yet we build right here on first boot. The
// output persists in the runtime dir, so this only runs once per
// deploy.
import { chmodSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

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

// Hostinger copies node_modules into the runtime dir with the execute
// bit stripped, so esbuild's native binary fails with EACCES when the
// build spawns it. Restore +x on every @esbuild platform binary
// (top-level and nested copies) before building.
function chmodEsbuildBins(nmDir) {
  if (!existsSync(nmDir)) return;
  let entries;
  try {
    entries = readdirSync(nmDir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const pkgPath = join(nmDir, entry.name);
    if (entry.name === "@esbuild") {
      for (const plat of readdirSync(pkgPath)) {
        const bin = join(pkgPath, plat, "bin", "esbuild");
        if (existsSync(bin)) {
          try {
            chmodSync(bin, 0o755);
            console.log(`[boot] chmod +x ${bin}`);
          } catch (err) {
            console.warn(`[boot] could not chmod ${bin}: ${err.message}`);
          }
        }
      }
    } else if (entry.name.startsWith("@")) {
      for (const sub of readdirSync(pkgPath)) {
        chmodEsbuildBins(join(pkgPath, sub, "node_modules"));
      }
    } else {
      chmodEsbuildBins(join(pkgPath, "node_modules"));
    }
  }
}

const hasBuild =
  existsSync("./dist/server/entry.mjs") || existsSync("./server/entry.mjs");
if (!hasBuild) {
  chmodEsbuildBins("node_modules");
  // Invoke astro's CLI entry directly with the running node binary —
  // Hostinger's runtime environment has no npx/PATH we can rely on.
  console.log("[boot] no Astro build output found — running astro build...");
  execFileSync(process.execPath, ["node_modules/astro/astro.js", "build"], {
    stdio: "inherit",
  });
  console.log("[boot] astro build finished.");
}

import("./server.mjs").catch((err) => {
  console.error("[boot] failed to start server.mjs:", err);
  process.exit(1);
});
