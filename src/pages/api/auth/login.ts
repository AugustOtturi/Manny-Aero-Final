import type { APIRoute } from "astro";
import { z } from "zod";
import { SESSION_COOKIE, signSession, verifyCredentials } from "../../../lib/server/auth";
import { checkRateLimit, getClientIp } from "../../../lib/server/rateLimit";
import { isAllowedOrigin } from "../../../lib/server/originCheck";

export const prerender = false;

const loginSchema = z.object({
  username: z.string().min(1).max(255),
  password: z.string().min(1).max(1000),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  // Reject cross-site login attempts (login CSRF) before doing any work.
  if (!isAllowedOrigin(request)) {
    return json({ ok: false, error: "Forbidden" }, 403);
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(`login:${ip}`, 10, 300)) {
    return json({ ok: false, error: "Too many attempts. Please wait a few minutes." }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid payload" }, 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, error: "Username and password are required" }, 400);
  }
  const { username, password } = parsed.data;

  let valid = false;
  try {
    valid = await verifyCredentials(username, password);
  } catch (err) {
    console.error("[login] verifyCredentials error:", err);
    return json({ ok: false, error: "Authentication error" }, 500);
  }
  if (!valid) {
    return json({ ok: false, error: "Invalid credentials" }, 401);
  }

  const token = await signSession({ username });
  cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
