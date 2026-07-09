import { getEnv } from "./env";

const LOCALHOST_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function isAllowedOrigin(request: Request): boolean {
  const env = getEnv();
  const allowed = env.ALLOWED_ORIGIN;
  const origin = request.headers.get("origin") ?? "";
  const referer = request.headers.get("referer") ?? "";

  if (allowed && (origin.startsWith(allowed) || referer.startsWith(allowed))) return true;

  // Same-origin fallback: behind Hostinger's reverse proxy the public host
  // arrives in `x-forwarded-host` (server.mjs sets `trust proxy`), while the
  // raw `host` header may be an internal name. If the browser's Origin/Referer
  // host matches either, the request is same-origin and safe — this keeps the
  // form working even if ALLOWED_ORIGIN isn't set to the exact public URL.
  const publicHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  if (publicHost) {
    if (hostMatches(origin, publicHost)) return true;
    if (hostMatches(referer, publicHost)) return true;
  }

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

function hostMatches(urlish: string, host: string): boolean {
  if (!urlish) return false;
  try {
    return new URL(urlish).host === host;
  } catch {
    return false;
  }
}
