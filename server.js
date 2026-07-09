// Hostinger's Node.js panel expects a `server.js` entry file.
// The real entry point is server.mjs — this shim just loads it.
// (package.json has "type": "module", so this file is ESM too.)
import "./server.mjs";
