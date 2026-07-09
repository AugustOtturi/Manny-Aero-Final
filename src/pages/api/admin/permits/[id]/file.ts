import type { APIRoute } from "astro";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  getPermitDownloadById,
  updatePermitDownload,
} from "../../../../../lib/server/repositories/permitDownloads";

export const prerender = false;

const ALLOWED_EXTENSIONS: Record<string, string> = {
  ".pdf": "PDF",
  ".doc": "DOC",
  ".docx": "DOCX",
  ".xls": "XLS",
  ".xlsx": "XLSX",
};
const MAX_SIZE = 15 * 1024 * 1024;
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

export const POST: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ ok: false, error: "Invalid id" }, 400);

  const existing = await getPermitDownloadById(id);
  if (!existing) return json({ ok: false, error: "Not found" }, 404);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: "Invalid form data" }, 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) return json({ ok: false, error: "No file provided" }, 400);

  const ext = path.extname(file.name).toLowerCase();
  const fileType = ALLOWED_EXTENSIONS[ext];
  if (!fileType) {
    return json({ ok: false, error: "File must be PDF, DOC, DOCX, XLS, or XLSX" }, 400);
  }
  if (file.size > MAX_SIZE) {
    return json({ ok: false, error: "File must be smaller than 15MB" }, 400);
  }

  await mkdir(UPLOADS_DIR, { recursive: true });

  const fileName = `${Date.now()}-${safeBaseName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOADS_DIR, fileName), buffer);

  const updated = await updatePermitDownload(id, {
    fileUrl: `/uploads/permit-files/${fileName}`,
    fileType,
    size: buffer.byteLength,
  });

  if (existing.fileUrl.startsWith("/uploads/permit-files/")) {
    await unlink(path.join(process.cwd(), "public", existing.fileUrl)).catch(() => {});
  }

  return json({ ok: true, download: updated });
};
