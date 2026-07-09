import type { APIRoute } from "astro";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createPermitDownload } from "../../../../lib/server/repositories/permitDownloads";

export const prerender = false;

const ALLOWED_EXTENSIONS: Record<string, string> = {
  ".pdf": "PDF",
  ".doc": "DOC",
  ".docx": "DOCX",
  ".xls": "XLS",
  ".xlsx": "XLSX",
};
const ALLOWED_ICONS = new Set(["check", "star", "send", "shield", "plane", "document"]);
const MAX_SIZE = 15 * 1024 * 1024; // 15MB

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "permit-files");

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function safeBaseName(fileName: string): string {
  const ext = path.extname(fileName);
  const base = path
    .basename(fileName, ext)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return (base || "file") + ext.toLowerCase();
}

// Verify the leading bytes match the claimed extension so a renamed
// executable/script can't slip in as a .pdf/.docx. docx/xlsx are ZIP
// containers (PK…); legacy doc/xls are OLE compound files.
function magicBytesOk(buf: Buffer, ext: string): boolean {
  if (buf.length < 8) return false;
  const isPdf = buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46;
  const isZip =
    buf[0] === 0x50 && buf[1] === 0x4b && (buf[2] === 0x03 || buf[2] === 0x05 || buf[2] === 0x07);
  const isOle =
    buf[0] === 0xd0 && buf[1] === 0xcf && buf[2] === 0x11 && buf[3] === 0xe0 &&
    buf[4] === 0xa1 && buf[5] === 0xb1 && buf[6] === 0x1a && buf[7] === 0xe1;
  switch (ext) {
    case ".pdf":
      return isPdf;
    case ".docx":
    case ".xlsx":
      return isZip;
    case ".doc":
    case ".xls":
      return isOle;
    default:
      return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: "Invalid form data" }, 400);
  }

  const name = String(formData.get("name") ?? "").trim();
  const icon = String(formData.get("icon") ?? "document");
  const file = formData.get("file");

  if (!name) return json({ ok: false, error: "Name is required" }, 400);
  if (!ALLOWED_ICONS.has(icon)) return json({ ok: false, error: "Invalid icon" }, 400);
  if (!(file instanceof File)) return json({ ok: false, error: "No file provided" }, 400);

  const ext = path.extname(file.name).toLowerCase();
  const fileType = ALLOWED_EXTENSIONS[ext];
  if (!fileType) {
    return json({ ok: false, error: "File must be PDF, DOC, DOCX, XLS, or XLSX" }, 400);
  }
  if (file.size > MAX_SIZE) {
    return json({ ok: false, error: "File must be smaller than 15MB" }, 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!magicBytesOk(buffer, ext)) {
    return json({ ok: false, error: "File content doesn't match its extension" }, 400);
  }

  await mkdir(UPLOADS_DIR, { recursive: true });

  const fileName = `${Date.now()}-${safeBaseName(file.name)}`;
  await writeFile(path.join(UPLOADS_DIR, fileName), buffer);

  const created = await createPermitDownload({
    name,
    fileUrl: `/uploads/permit-files/${fileName}`,
    fileType,
    icon: icon as "check" | "star" | "send" | "shield" | "plane" | "document",
    size: buffer.byteLength,
  });

  return json({ ok: true, download: created }, 201);
};
