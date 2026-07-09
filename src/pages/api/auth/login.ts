import type { APIRoute } from "astro";
import { SESSION_COOKIE, signSession, verifyCredentials } from "../../../lib/server/auth";
import { checkRateLimit, getClientIp } from "../../../lib/server/rateLimit";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
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

  const { username, password } = (body ?? {}) as { username?: string; password?: string };
  if (!username || !password) {
    return json({ ok: false, error: "Username and password are required" }, 400);
  }

  const valid = await verifyCredentials(username, password);
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
