import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
import { logger } from "./shared/logger";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { requestId } from "./middlewares/requestId";

import { healthRouter } from "./modules/health/health.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { usersRouter } from "./modules/users/users.routes";
import { categoriesRouter } from "./modules/categories/categories.routes";
import { projectsRouter } from "./modules/projects/projects.routes";
import { requestsRouter } from "./modules/requests/requests.routes";
import { membershipsRouter } from "./modules/memberships/memberships.routes";
import { tasksRouter } from "./modules/tasks/tasks.routes";
import { notificationsRouter } from "./modules/notifications/notifications.routes";
import { auditRouter } from "./modules/audit/audit.routes";
import { reportsRouter } from "./modules/reports/reports.routes";
import { storageRouter } from "./modules/storage/storage.routes";

const envOrigins = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(",").map((s) => s.trim().replace(/\/$/, "")).filter(Boolean)
  : [];

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3005",
  ...envOrigins,
];

export function createApp() {
  const app = express();

  // Security headers
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

  // CORS
  app.use(cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (
        ALLOWED_ORIGINS.includes("*") ||
        ALLOWED_ORIGINS.includes(cleanOrigin) ||
        cleanOrigin.endsWith(".vercel.app")
      ) {
        return cb(null, true);
      }
      return cb(new Error(`CORS policy violation: ${origin} is not allowed`));
    },
    credentials: true,
  }));

  // Body parsing
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Request ID
  app.use(requestId);

  // HTTP logger
  if (env.NODE_ENV !== "test") {
    app.use(pinoHttp({ logger }));
  }

  // API v1 Routes
  app.use("/api/v1/health",        healthRouter);
  app.use("/api/v1/auth",          authRouter);
  app.use("/api/v1/users",         usersRouter);
  app.use("/api/v1/categories",    categoriesRouter);
  app.use("/api/v1/projects",      projectsRouter);
  app.use("/api/v1/requests",      requestsRouter);
  app.use("/api/v1/memberships",   membershipsRouter);
  app.use("/api/v1/tasks",         tasksRouter);
  app.use("/api/v1/notifications", notificationsRouter);
  app.use("/api/v1/audit",         auditRouter);
  app.use("/api/v1/reports",       reportsRouter);
  app.use("/api/v1/storage",       storageRouter);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
