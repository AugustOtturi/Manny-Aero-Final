import type { APIRoute } from "astro";
import { z } from "zod";
import { getEnv } from "../../lib/server/env";
import { isAllowedOrigin } from "../../lib/server/originCheck";
import { checkRateLimit, getClientIp } from "../../lib/server/rateLimit";
import { createLead } from "../../lib/server/repositories/leads";
import { sendGateEmail } from "../../lib/server/mail";

export const prerender = false;

const gateSchema = z.object({
  type: z.literal("gate"),
  website: z.string().optional().default(""),
  email: z.string().trim().email("Valid email is required"),
  fileName: z.string().trim().max(255).optional().default("Unknown file"),
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  if (!isAllowedOrigin(request)) {
    return json({ ok: false, error: "Forbidden" }, 403);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid payload" }, 400);
  }

  if (typeof raw !== "object" || raw === null) {
    return json({ ok: false, error: "Invalid payload" }, 400);
  }

  const honeypot = (raw as Record<string, unknown>).website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return json({ ok: true, message: "ok" });
  }

  const parsed = gateSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid payload" }, 400);
  }

  const env = getEnv();
  const ip = getClientIp(request);
  if (!checkRateLimit(`gate:${ip}`, env.RATE_LIMIT_MAX, env.RATE_LIMIT_WINDOW)) {
    return json({ ok: false, error: "Too many requests. Please wait a few minutes and try again." }, 429);
  }

  const { email, fileName } = parsed.data;

  try {
    await createLead({ type: "gate", email, fileName });
  } catch (err) {
    console.error("[api/gate] Failed to store lead:", err);
  }

  try {
    await sendGateEmail(email, fileName);
  } catch (err) {
    console.error("[api/gate] SMTP error:", err);
    return json({ ok: false, error: "Could not record this request." }, 500);
  }

  return json({ ok: true, message: "Recorded" });
};
