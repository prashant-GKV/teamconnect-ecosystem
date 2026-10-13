import { Router } from "express";
import { dbStore } from "../../shared/data-store";
import { ok, noContent } from "../../shared/response";
import { NotFoundError } from "../../shared/errors";

export const notificationsRouter = Router();

// GET /api/v1/notifications
notificationsRouter.get("/", (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const total = dbStore.notifications.length;
  const start = (page - 1) * limit;
  const data = dbStore.notifications.slice(start, start + limit);

  return ok(res, {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: start + limit < total,
      hasPrevPage: page > 1,
    },
  });
});

// POST /api/v1/notifications/read-all
notificationsRouter.post("/read-all", (_req, res) => {
  dbStore.notifications.forEach((n) => {
    n.read = true;
  });
  return ok(res, { message: "All notifications marked as read" });
});

// PATCH /api/v1/notifications/:id/read
notificationsRouter.patch("/:id/read", (req, res, next) => {
  const notif = dbStore.notifications.find((n) => n._id === req.params.id);
  if (!notif) return next(new NotFoundError("Notification", req.params.id));
  notif.read = true;
  return ok(res, notif);
});

// DELETE /api/v1/notifications/:id
notificationsRouter.delete("/:id", (req, res, next) => {
  const idx = dbStore.notifications.findIndex((n) => n._id === req.params.id);
  if (idx === -1) return next(new NotFoundError("Notification", req.params.id));
  dbStore.notifications.splice(idx, 1);
  return noContent(res);
});
