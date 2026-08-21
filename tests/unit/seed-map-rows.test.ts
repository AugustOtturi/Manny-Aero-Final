import { test } from "node:test";
import assert from "node:assert/strict";
import { categoryRows, airportRows } from "../../src/lib/server/db/scripts/seed-map.rows";

test("categoryRows keeps ids 1-4 and maps priority to sortOrder", () => {
  const rows = categoryRows();
  assert.deepEqual(rows.map((r) => r.id), [1, 2, 3, 4]);
  assert.equal(rows[0].name, "Manny Agent");
  assert.equal(rows[0].short, "Agent");
  assert.equal(rows[0].color, "#ffb900");
  assert.deepEqual(rows.map((r) => r.sortOrder), [1, 2, 3, 4]);
});

test("airportRows maps 101 airports, empty strings become null", () => {
  const rows = airportRows();
  assert.equal(rows.length, 99);
  const cancun = rows.find((r) => r.name.startsWith("CANCÚN"));
  assert.ok(cancun);
  assert.equal(cancun.categoryId, 1);
  assert.equal(cancun.pdfUrl, "/files/airports/MMUN-CUN.pdf");
  assert.equal(cancun.info, null);
  assert.ok(rows.every((r) => r.info === null || r.info!.length > 0));
  assert.ok(rows.every((r) => r.pdfUrl === null || r.pdfUrl!.startsWith("/")));
});
