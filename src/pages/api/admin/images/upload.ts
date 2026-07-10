import type { APIRoute } from "astro";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getImage, upsertImage } from "../../../../lib/server/repositories/images";
import { UPLOADS_ROOT } from "../../../../lib/server/uploads";

export const prerender = false;

const ALLOWED_CATEGORIES = new Set(["subhero", "service", "logo", "news", "team", "catering", "og"]);
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const LOGO_MAX_WIDTH = 400;
const PHOTO_MAX_WIDTH = 1600;

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
  const title = formData.get("title") ? String(formData.get("title")) : undefined;
  const file = formData.get("file");

  if (!ALLOWED_CATEGORIES.has(category)) {
    return json({ ok: false, error: "Invalid category" }, 400);
  }
  if (!safeSlug(slug)) {
    return json({ ok: false, error: "Invalid slug" }, 400);
  }

  // Title-only update: no file provided, but the image already exists —
  // just rename it without touching the file on disk.
  if (!(file instanceof File)) {
    const existing = await getImage(category, slug);
    if (!existing) {
      return json({ ok: false, error: "No file provided" }, 400);
    }
    if (!title) {
      return json({ ok: false, error: "Nothing to update" }, 400);
    }
    const saved = await upsertImage({ ...existing, title, alt: title });
    return json({ ok: true, image: saved });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return json({ ok: false, error: "File must be JPEG, PNG, or WebP" }, 400);
  }
  if (file.size > MAX_SIZE) {
    return json({ ok: false, error: "File must be smaller than 8MB" }, 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const maxWidth = category === "logo" ? LOGO_MAX_WIDTH : PHOTO_MAX_WIDTH;

  let optimized: Buffer;
  let width: number | undefined;
  let height: number | undefined;
  try {
    const pipeline = sharp(buffer)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 82 });
    optimized = await pipeline.toBuffer();
    const meta = await sharp(optimized).metadata();
    width = meta.width;
    height = meta.height;
  } catch {
    return json({ ok: false, error: "Could not process image" }, 400);
  }

  const categoryDir = path.join(UPLOADS_ROOT, category);
  await mkdir(categoryDir, { recursive: true });

  const fileName = `${slug}-${Date.now()}.webp`;
  const filePath = path.join(categoryDir, fileName);

  await writeFile(filePath, optimized);

  const previous = await getImage(category, slug);
  const saved = await upsertImage({
    category,
    slug,
    fileName,
    width,
    height,
    size: optimized.byteLength,
    title: title ?? previous?.title ?? null,
    alt: title ?? previous?.alt ?? null,
  });

  if (previous && previous.fileName !== fileName) {
    await unlink(path.join(categoryDir, previous.fileName)).catch(() => {});
  }

  return json({ ok: true, image: saved });
};
