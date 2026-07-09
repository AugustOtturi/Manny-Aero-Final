// Hostinger's Node.js panel expects a `server.js` entry file.
// The real entry point is server.mjs — this shim loads it and logs
// loudly so a startup crash is always visible in the runtime logs.
console.log(
  `[boot] node ${process.version} | NODE_ENV=${process.env.NODE_ENV ?? "(unset)"} | PORT=${process.env.PORT ?? "(unset)"} | cwd=${process.cwd()}`
);

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
