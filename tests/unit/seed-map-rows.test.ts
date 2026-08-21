import { test } from "node:test";
import assert from "node:assert/strict";
import { categoryRows, airportRows, airportKey, planAirportInserts } from "../../src/lib/server/db/scripts/seed-map.rows";

test("categoryRows keeps ids 1-4 and maps priority to sortOrder", () => {
  const rows = categoryRows();
  assert.deepEqual(rows.map((r) => r.id), [1, 2, 3, 4]);
  assert.equal(rows[0].name, "Manny Agent");
  assert.equal(rows[0].short, "Agent");
  assert.equal(rows[0].color, "#ffb900");
  assert.deepEqual(rows.map((r) => r.sortOrder), [1, 2, 3, 4]);
});

test("airportRows maps 99 airports, empty strings become null", () => {
  const rows = airportRows();
  assert.equal(rows.length, 99);
  const cancun = rows.find((r) => r.name.startsWith("CANCÚN"));
  assert.ok(cancun);
  assert.equal(cancun.categoryId, 1);
  assert.equal(cancun.pdfUrl, "/files/airports/MMUN-CUN.pdf");
  assert.equal(cancun.info, null);
  assert.ok(rows.every((r) => r.info === null || r.info!.length > 0));
  assert.ok(rows.every((r) => r.pdfUrl === null || r.pdfUrl!.startsWith("/")));
  assert.equal(new Set(rows.map(airportKey)).size, 99, "(name, categoryId) keys must be unique across all 99 rows");
});

test("planAirportInserts: empty DB inserts all 99 (duplicate names in different categories survive)", () => {
  const rows = airportRows();
  const plan = planAirportInserts(rows, []);
  assert.equal(plan.length, 99);
  const dupNames = new Set(rows.map((r) => r.name).filter((n, i, a) => a.indexOf(n) !== i));
  // Measured against src/data/airports.ts: 17 names repeat across categories
  // (accounting for 24 rows beyond each name's first occurrence — the exact
  // count this fix is guarding against being silently dropped).
  assert.ok(dupNames.size >= 15, `expected many duplicate names, got ${dupNames.size}`);
  assert.equal(plan.filter((r) => r.categoryId === 4).length, 2);
});

test("planAirportInserts: full DB inserts nothing; partial DB inserts only the missing keys", () => {
  const rows = airportRows();
  assert.equal(planAirportInserts(rows, rows.map(airportKey)).length, 0);
  const partial = rows.slice(0, 50).map(airportKey);
  assert.equal(planAirportInserts(rows, partial).length, 49);
});

test("planAirportInserts: dedupes identical (name, categoryId) pairs within the batch", () => {
  const r = airportRows()[0];
  assert.equal(planAirportInserts([r, { ...r }], []).length, 1);
});
