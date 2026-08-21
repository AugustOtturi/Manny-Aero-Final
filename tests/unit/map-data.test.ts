import { test } from "node:test";
import assert from "node:assert/strict";
import { toMapData, serializeMapData } from "../../src/lib/mapData";

const now = new Date();
const categories = [
  { id: 2, name: "FBO", short: "FBO", color: "#e84040", sortOrder: 2, createdAt: now, updatedAt: now },
  { id: 1, name: "Agent", short: "Agent", color: "#ffb900", sortOrder: 1, createdAt: now, updatedAt: now },
];
const airports = [
  { id: 7, name: "X </script>", lat: 1.5, lng: -2.5, categoryId: 1, info: null, pdfUrl: null, createdAt: now, updatedAt: now },
];

test("toMapData keeps only public fields, sorts categories, nulls info to empty string", () => {
  const data = toMapData(categories, airports);
  assert.deepEqual(data.categories.map((c) => c.id), [1, 2]);
  assert.deepEqual(Object.keys(data.categories[0]), ["id", "name", "short", "color", "sortOrder"]);
  assert.deepEqual(data.airports[0], {
    id: 7, name: "X </script>", lat: 1.5, lng: -2.5, categoryId: 1, info: "", pdfUrl: null,
  });
});

test("serializeMapData escapes < so it is safe inside a <script> tag", () => {
  const out = serializeMapData(toMapData(categories, airports));
  assert.equal(out.includes("</script>"), false);
  assert.equal(out.includes("\\u003c/script>"), true);
  assert.equal(JSON.parse(out).airports[0].name, "X </script>");
});
