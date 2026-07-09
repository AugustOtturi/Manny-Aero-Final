import { getEnv } from "./env";

const LOCALHOST_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function isAllowedOrigin(request: Request): boolean {
  const env = getEnv();
  const allowed = env.ALLOWED_ORIGIN;
  const origin = request.headers.get("origin") ?? "";
  const referer = request.headers.get("referer") ?? "";

  if (origin.startsWith(allowed) || referer.startsWith(allowed)) return true;

  // In dev, `astro dev` may run on any port (4321 by default, 4330 via the
  // Preview tool, or whatever the user picks) — don't hardcode one port.
  if (env.NODE_ENV !== "production") {
    if (LOCALHOST_ORIGIN.test(origin)) return true;
    try {
      return LOCALHOST_ORIGIN.test(new URL(referer).origin);
    } catch {
      return false;
    }
  }

  return false;
}
