import { z } from "zod";

const envSchema = z.object({
  NODE_ENV:    z.enum(["development", "test", "production"]).default("development"),
  PORT:        z.coerce.number().default(4000),

  MONGODB_URI: z.string().url().default("mongodb://localhost:27017/teamconnect"),
  REDIS_URL:   z.string().url().default("redis://localhost:6379"),

  JWT_ACCESS_SECRET:  z.string().min(32).default("development_jwt_access_secret_key_32chars!"),
  JWT_REFRESH_SECRET: z.string().min(32).default("development_jwt_refresh_secret_key_32chars!"),
  JWT_ACCESS_TTL:     z.coerce.number().default(900),
  JWT_REFRESH_TTL:    z.coerce.number().default(604800),

  MINIO_ENDPOINT:   z.string().default("localhost"),
  MINIO_PORT:       z.coerce.number().default(9000),
  MINIO_ACCESS_KEY: z.string().default("minioadmin"),
  MINIO_SECRET_KEY: z.string().default("minioadmin"),
  MINIO_BUCKET:     z.string().default("tc-submissions"),
  MINIO_USE_SSL:    z.string().transform((v) => v === "true").default("false"),
  SIGNED_URL_TTL:   z.coerce.number().default(3600),

  SMTP_HOST:  z.string().optional(),
  SMTP_PORT:  z.coerce.number().optional(),
  SMTP_USER:  z.string().optional(),
  SMTP_PASS:  z.string().optional(),
  SMTP_FROM:  z.string().default("noreply@teamconnect.local"),

  RATE_LIMIT_LOGIN_MAX:      z.coerce.number().default(5),
  RATE_LIMIT_LOGIN_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_GENERAL_MAX:    z.coerce.number().default(300),
  RATE_LIMIT_GENERAL_WINDOW_MS: z.coerce.number().default(60000),

  WORKER_EXPIRY_CRON:   z.string().default("0 * * * *"),
  WORKER_REMINDER_DAYS: z.coerce.number().default(7),
  WORKER_OVERDUE_CRON:  z.string().default("0 6 * * *"),

  CORS_ORIGIN: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = _env.data;
export type Env = typeof env;
