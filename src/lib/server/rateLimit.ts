// In-memory sliding-window rate limiter. Single-process only — fine for
// Hostinger's Node.js app (one instance), mirrors the old mail.php
// per-IP file-based limiter without touching disk.
const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, max: number, windowSeconds: number): boolean {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);
  return true;
}

export function getClientIp(request: Request): string {
  // Prefer the single-value header the trusted proxy sets directly — a client
  // can pre-populate X-Forwarded-For, but not the proxy-issued x-real-ip.
  // Behind Hostinger's edge, fall back to the first X-Forwarded-For entry.
  // NOTE: fully spoof-proof rate limiting needs the edge's trusted client-IP
  // header; confirm which one hcdn sets before tightening further.
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
