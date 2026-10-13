import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

healthRouter.get("/ready", (_req, res) => {
  // TODO Phase 2: check DB, Redis, MinIO connections
  res.json({ success: true, data: { status: "ready", services: { db: "ok", redis: "ok", storage: "ok" } } });
});
