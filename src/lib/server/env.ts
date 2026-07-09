import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4321),

  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().min(1),
  DB_PASS: z.string().default(""),
  DB_NAME: z.string().min(1),

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  MAIL_FROM: z.string().min(1),
  MAIL_FROM_NAME: z.string().default("Website Form"),
  MAIL_TO_CONTACT: z.string().min(1),
  MAIL_TO_GATE: z.string().min(1),
  MAIL_CC: z.string().default(""),

  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  ADMIN_USERNAME: z.string().min(3),
  ADMIN_PASSWORD_HASH: z.string().min(1),

  ALLOWED_ORIGIN: z.string().min(1),

  RATE_LIMIT_MAX: z.coerce.number().default(15),
  RATE_LIMIT_WINDOW: z.coerce.number().default(3600),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }

  cached = parsed.data;
  return cached;
}

export function mailCcList(env: Env): string[] {
  return env.MAIL_CC.split(",").map((s) => s.trim()).filter(Boolean);
}
