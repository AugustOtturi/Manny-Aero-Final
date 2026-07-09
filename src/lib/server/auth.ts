import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getEnv } from "./env";
import { getDb } from "./db/client";
import { adminUsers } from "./db/schema";

export const SESSION_COOKIE = "manny_admin_session";
const SESSION_TTL = "12h";

export interface SessionPayload {
  username: string;
}

function secretKey() {
  return new TextEncoder().encode(getEnv().JWT_SECRET);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(secretKey());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.username !== "string") return null;
    return { username: payload.username };
  } catch {
    return null;
  }
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  try {
    const db = getDb();

    // Try database first — username is treated as email
    const user = await db.select().from(adminUsers).where(
      eq(adminUsers.email, username)
    );

    if (user.length > 0) {
      return bcrypt.compare(password, user[0].password_hash);
    }
  } catch {
    // Fall back to env vars if DB is unavailable
  }

  // Fallback to env vars (old method, for backwards compatibility)
  const env = getEnv();
  if (username !== env.ADMIN_USERNAME) return false;
  return bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
}
