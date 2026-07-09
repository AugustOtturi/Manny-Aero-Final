import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getEnv } from "./env";
import { getDb } from "./db/client";
import { adminUsers } from "./db/schema";

export const SESSION_COOKIE = "manny_admin_session";
const SESSION_TTL = "12h";

// A valid bcrypt hash of a throwaway string. Used to run a real bcrypt.compare
// even when the username doesn't exist, so response time doesn't reveal whether
// the username was valid (user-enumeration mitigation).
const DUMMY_HASH = "$2b$10$kJQHI.UOdwsAnqDneTGGp.E.cgEdEl3B.bNTUyAlxmjcwwIWbRVrS";

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
      return await bcrypt.compare(password, user[0].passwordHash);
    }
  } catch (err) {
    // A DB failure shouldn't silently swap the auth source — log it so a
    // transient outage that pushes us onto the env-var fallback is visible.
    console.error("[auth] DB lookup failed, falling back to env credentials:", err);
  }

  // Fallback to env vars (old method, for backwards compatibility)
  const env = getEnv();
  if (username !== env.ADMIN_USERNAME) {
    // Compare against a dummy hash so a non-existent username takes the same
    // time as a wrong password (mitigates user enumeration via timing).
    await bcrypt.compare(password, DUMMY_HASH);
    return false;
  }
  return await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
}
