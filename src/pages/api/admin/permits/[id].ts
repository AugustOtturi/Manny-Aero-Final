import type { APIRoute } from "astro";
import { unlink } from "node:fs/promises";
import {
  deletePermitDownload,
  getPermitDownloadById,
  updatePermitDownload,
} from "../../../../lib/server/repositories/permitDownloads";
import { uploadsPath } from "../../../../lib/server/uploads";

export const prerender = false;

const ALLOWED_ICONS = new Set(["check", "star", "send", "shield", "plane", "document"]);

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const PUT: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ ok: false, error: "Invalid id" }, 400);

  const existing = await getPermitDownloadById(id);
  if (!existing) return json({ ok: false, error: "Not found" }, 404);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid payload" }, 400);
  }

  const { name, icon } = (raw ?? {}) as { name?: string; icon?: string };
  const update: { name?: string; icon?: "check" | "star" | "send" | "shield" | "plane" | "document" } = {};

  if (name !== undefined) {
    if (!name.trim()) return json({ ok: false, error: "Name cannot be empty" }, 400);
    update.name = name.trim();
  }
  if (icon !== undefined) {
    if (!ALLOWED_ICONS.has(icon)) return json({ ok: false, error: "Invalid icon" }, 400);
    update.icon = icon as typeof update.icon;
  }

  const updated = await updatePermitDownload(id, update);
  return json({ ok: true, download: updated });
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ ok: false, error: "Invalid id" }, 400);

  const existing = await getPermitDownloadById(id);
  if (!existing) return json({ ok: false, error: "Not found" }, 404);

  await deletePermitDownload(id);

  // Only unlink files we manage — never touch the legacy /files/* assets.
  if (existing.fileUrl.startsWith("/uploads/permit-files/")) {
    const filePath = uploadsPath(existing.fileUrl.replace("/uploads/", ""));
    await unlink(filePath).catch(() => {});
  }

  return json({ ok: true });
};
