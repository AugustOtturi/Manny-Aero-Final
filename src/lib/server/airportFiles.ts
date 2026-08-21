// PDF handling for map airports. New PDFs uploaded from /admin/map live in
// UPLOADS_DIR/airport-files and are served at /uploads/airport-files/*.
// Legacy PDFs under /files/airports/* are shared by several pins and are
// never deleted — only URLs under AIRPORT_FILES_URL_PREFIX get unlinked.
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { uploadsPath } from "./uploads";

export const AIRPORT_FILES_URL_PREFIX = "/uploads/airport-files/";
export const PDF_MAX_SIZE = 15 * 1024 * 1024; // 15MB

const AIRPORT_FILES_DIR = uploadsPath("airport-files");
const COMBINING_MARKS = /[\u0300-\u036f]/g;

export function isPdfBuffer(buf: Buffer): boolean {
  return buf.length >= 5 && buf.subarray(0, 5).toString("latin1") === "%PDF-";
}

export function safeBaseName(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");
  const base = lastDot === -1 ? fileName : fileName.slice(0, lastDot);
  const sanitized = base
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return sanitized || "file";
}

export function isManagedAirportPdf(url: string | null | undefined): boolean {
  return typeof url === "string" && url.startsWith(AIRPORT_FILES_URL_PREFIX);
}

export async function readPdfUpload(
  file: File
): Promise<{ ok: true; buffer: Buffer } | { ok: false; error: string }> {
  if (path.extname(file.name).toLowerCase() !== ".pdf") {
    return { ok: false, error: "El archivo debe ser PDF" };
  }
  if (file.size > PDF_MAX_SIZE) {
    return { ok: false, error: "El PDF debe pesar menos de 15MB" };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!isPdfBuffer(buffer)) {
    return { ok: false, error: "El contenido no corresponde a un PDF" };
  }
  return { ok: true, buffer };
}

export async function storeAirportPdf(buffer: Buffer, originalName: string): Promise<string> {
  await mkdir(AIRPORT_FILES_DIR, { recursive: true });
  const fileName = `${Date.now()}-${safeBaseName(originalName)}.pdf`;
  await writeFile(path.join(AIRPORT_FILES_DIR, fileName), buffer);
  return `${AIRPORT_FILES_URL_PREFIX}${fileName}`;
}

export async function removeAirportPdf(url: string | null | undefined): Promise<void> {
  if (!isManagedAirportPdf(url)) return;
  const fileName = path.basename(url as string);
  await unlink(path.join(AIRPORT_FILES_DIR, fileName)).catch(() => {});
}
