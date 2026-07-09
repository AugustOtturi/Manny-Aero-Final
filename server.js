// Hostinger's Node.js panel expects a `server.js` entry file.
// The real entry point is server.mjs — this shim loads it and logs
// loudly so a startup crash is always visible in the runtime logs.
import { readdirSync } from "node:fs";

console.log(
  `[boot] node ${process.version} | NODE_ENV=${process.env.NODE_ENV ?? "(unset)"} | PORT=${process.env.PORT ?? "(unset)"} | cwd=${process.cwd()}`
);

// Hostinger builds in a separate directory and copies files into the
// runtime dir with a layout we don't control — list what actually
// landed here so path issues are diagnosable from the logs alone.
const ls = (p) => {
  try {
    return readdirSync(p).join(", ") || "(empty)";
  } catch {
    return "(missing)";
  }
};
for (const dir of [".", "./dist", "./dist/server", "./server", "./client", "./public"]) {
  console.log(`[boot] ls ${dir}: ${ls(dir)}`);
}

process.on("uncaughtException", (err) => {
  console.error("[boot] uncaughtException:", err);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.error("[boot] unhandledRejection:", err);
  process.exit(1);
});

import("./server.mjs").catch((err) => {
  console.error("[boot] failed to start server.mjs:", err);
  process.exit(1);
});
