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
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
