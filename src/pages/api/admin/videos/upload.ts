import type { APIRoute } from "astro";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { getImage, upsertImage } from "../../../../lib/server/repositories/images";
import { UPLOADS_ROOT } from "../../../../lib/server/uploads";

export const prerender = false;

// Only the hero background video goes through this endpoint — unlike
// /api/admin/images/upload, the file is stored as-is (no sharp pipeline,
// video isn't processed server-side).
const ALLOWED_CATEGORIES = new Set(["hero"]);
const ALLOWED_TYPES = new Set(["video/mp4"]);
const MAX_SIZE = 15 * 1024 * 1024; // 15MB

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function safeSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}

export const POST: APIRoute = async ({ request }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: "Invalid form data" }, 400);
  }

  const category = String(formData.get("category") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const file = formData.get("file");

  if (!ALLOWED_CATEGORIES.has(category)) {
    return json({ ok: false, error: "Invalid category" }, 400);
  }
  if (!safeSlug(slug)) {
    return json({ ok: false, error: "Invalid slug" }, 400);
  }
  if (!(file instanceof File)) {
    return json({ ok: false, error: "No file provided" }, 400);
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return json({ ok: false, error: "File must be MP4" }, 400);
  }
  if (file.size > MAX_SIZE) {
    return json({ ok: false, error: "File must be smaller than 15MB" }, 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const categoryDir = path.join(UPLOADS_ROOT, category);
  await mkdir(categoryDir, { recursive: true });

  const fileName = `${slug}-${Date.now()}.mp4`;
  const filePath = path.join(categoryDir, fileName);

  await writeFile(filePath, buffer);

  const previous = await getImage(category, slug);
  const saved = await upsertImage({
    category,
    slug,
    fileName,
    width: null,
    height: null,
    size: buffer.byteLength,
    title: previous?.title ?? null,
    alt: previous?.alt ?? null,
  });

  if (previous && previous.fileName !== fileName) {
    await unlink(path.join(categoryDir, previous.fileName)).catch(() => {});
  }

  return json({ ok: true, image: saved });
};
