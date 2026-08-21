import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mapCategoryInputSchema,
  mapCategoryUpdateSchema,
  airportInputSchema,
  airportUpdateSchema,
  firstIssue,
  stripUndefined,
} from "../../src/lib/server/schemas/map";

test("category: normalizes color to lowercase and trims", () => {
  const r = mapCategoryInputSchema.safeParse({ name: " Manny Agent ", short: "Agent", color: "#FFB900" });
  assert.ok(r.success);
  assert.deepEqual(r.data, { name: "Manny Agent", short: "Agent", color: "#ffb900", sortOrder: 0 });
});

test("category: rejects bad color", () => {
  const r = mapCategoryInputSchema.safeParse({ name: "X", short: "X", color: "red" });
  assert.equal(r.success, false);
  if (!r.success) assert.match(firstIssue(r.error), /Color inválido/);
});

test("category: coerces sortOrder from string", () => {
  const r = mapCategoryInputSchema.safeParse({ name: "X", short: "X", color: "#000000", sortOrder: "3" });
  assert.ok(r.success);
  assert.equal(r.data.sortOrder, 3);
});

test("category update: partial keeps missing keys undefined", () => {
  const r = mapCategoryUpdateSchema.safeParse({ name: "Nuevo" });
  assert.ok(r.success);
  assert.equal(r.data.color, undefined);
  assert.equal(r.data.sortOrder, undefined);
});

test("airport: coerces lat/lng/categoryId and defaults info", () => {
  const r = airportInputSchema.safeParse({ name: "CANCÚN (MMUN/CUN)", lat: "21.4", lng: "-86.87", categoryId: "1" });
  assert.ok(r.success);
  assert.deepEqual(r.data, { name: "CANCÚN (MMUN/CUN)", lat: 21.4, lng: -86.87, categoryId: 1, info: "" });
});

test("airport: rejects out-of-range coordinates", () => {
  const r = airportInputSchema.safeParse({ name: "X", lat: 91, lng: 0, categoryId: 1 });
  assert.equal(r.success, false);
});

test("airport: rejects empty name", () => {
  const r = airportInputSchema.safeParse({ name: "   ", lat: 0, lng: 0, categoryId: 1 });
  assert.equal(r.success, false);
  if (!r.success) assert.match(firstIssue(r.error), /nombre/i);
});

test("airport update: accepts only lat", () => {
  const r = airportUpdateSchema.safeParse({ lat: 10 });
  assert.ok(r.success);
  assert.equal(r.data.name, undefined);
});

test("category update: keeps Spanish message for negative sortOrder", () => {
  const r = mapCategoryUpdateSchema.safeParse({ sortOrder: -1 });
  assert.equal(r.success, false);
  if (!r.success) assert.match(firstIssue(r.error), /negativo/);
});

test("airport update: keeps Spanish message for too-long info", () => {
  const r = airportUpdateSchema.safeParse({ info: "x".repeat(2001) });
  assert.equal(r.success, false);
  if (!r.success) assert.match(firstIssue(r.error), /demasiado larga/);
});

test("stripUndefined removes undefined keys only", () => {
  assert.deepEqual(stripUndefined({ a: 1, b: undefined, c: "" }), { a: 1, c: "" });
});
