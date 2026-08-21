/// <reference lib="dom" />
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isPdfBuffer,
  safeBaseName,
  isManagedAirportPdf,
  readPdfUpload,
  AIRPORT_FILES_URL_PREFIX,
} from "../../src/lib/server/airportFiles";

test("isPdfBuffer accepts %PDF- header and rejects others", () => {
  assert.equal(isPdfBuffer(Buffer.from("%PDF-1.4 rest")), true);
  assert.equal(isPdfBuffer(Buffer.from("PKzip")), false);
  assert.equal(isPdfBuffer(Buffer.from("%PD")), false);
});

test("safeBaseName strips accents, symbols and extension", () => {
  assert.equal(safeBaseName("Cancún  (MMUN/CUN).PDF"), "cancun-mmun-cun");
  assert.equal(safeBaseName("???.pdf"), "file");
  assert.equal(safeBaseName("a".repeat(100) + ".pdf").length, 60);
});

test("isManagedAirportPdf only matches the uploads prefix", () => {
  assert.equal(isManagedAirportPdf(`${AIRPORT_FILES_URL_PREFIX}123-x.pdf`), true);
  assert.equal(isManagedAirportPdf("/files/airports/MMUN-CUN.pdf"), false);
  assert.equal(isManagedAirportPdf("/uploads/permit-files/x.pdf"), false);
  assert.equal(isManagedAirportPdf(null), false);
});

test("readPdfUpload rejects wrong extension, size and content", async () => {
  const notPdf = new File([Buffer.from("%PDF-1.4")], "x.docx");
  assert.deepEqual(await readPdfUpload(notPdf), { ok: false, error: "El archivo debe ser PDF" });

  const fake = new File([Buffer.from("hello")], "x.pdf");
  assert.deepEqual(await readPdfUpload(fake), { ok: false, error: "El contenido no corresponde a un PDF" });

  const good = new File([Buffer.from("%PDF-1.4 ok")], "x.pdf");
  const r = await readPdfUpload(good);
  assert.ok(r.ok);
  assert.equal(r.buffer.toString().startsWith("%PDF-"), true);
});
