import type { APIRoute } from "astro";
import { z } from "zod";
import { getEnv } from "../../lib/server/env";
import { isAllowedOrigin } from "../../lib/server/originCheck";
import { checkRateLimit, getClientIp } from "../../lib/server/rateLimit";
import { createLead } from "../../lib/server/repositories/leads";
import { sendContactEmail } from "../../lib/server/mail";

export const prerender = false;

const flightSchema = z.record(z.string(), z.string()).default({});

const contactSchema = z.object({
  type: z.literal("contact"),
  website: z.string().optional().default(""), // honeypot
  firstName: z.string().trim().min(1, "Name is required").max(1000),
  lastName: z.string().trim().min(1, "Name is required").max(1000),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().max(1000).optional().default(""),
  company: z.string().trim().max(1000).optional().default(""),
  service: z.string().trim().max(1000).optional().default(""),
  aircraft: z.string().trim().max(1000).optional().default(""),
  notes: z.string().trim().max(5000).optional().default(""),
  flights: z.array(flightSchema).optional().default([]),
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

  // Honeypot — silently pretend success so bots think it worked.
  const honeypot = (raw as Record<string, unknown>).website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return json({ ok: true, message: "ok" });
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid payload" }, 400);
  }

  const env = getEnv();
  const ip = getClientIp(request);
  if (!checkRateLimit(`contact:${ip}`, env.RATE_LIMIT_MAX, env.RATE_LIMIT_WINDOW)) {
    return json({ ok: false, error: "Too many requests. Please wait a few minutes and try again." }, 429);
  }

  const data = parsed.data;
  const fullName = `${data.firstName} ${data.lastName}`.trim();

  try {
    await createLead({
      type: "contact",
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      company: data.company,
      service: data.service,
      aircraft: data.aircraft,
      flights: data.flights,
      notes: data.notes,
    });
  } catch (err) {
    console.error("[api/contact] Failed to store lead:", err);
    // Don't block the email send on a DB hiccup — the operator still needs the request.
  }

  try {
    await sendContactEmail({
      fullName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.service,
      aircraft: data.aircraft,
      notes: data.notes,
      flights: data.flights,
    });
  } catch (err) {
    console.error("[api/contact] SMTP error:", err);
    return json({ ok: false, error: "We could not send your message right now. Please try again or contact us directly." }, 500);
  }

  return json({ ok: true, message: "Request sent" });
};
