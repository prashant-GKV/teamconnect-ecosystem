import { Router } from "express";
import { dbStore } from "../../shared/data-store";
import { ok } from "../../shared/response";
import { NotFoundError } from "../../shared/errors";

export const auditRouter = Router();

// GET /api/v1/audit
auditRouter.get("/", (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const actor = req.query.actor as string;
  const action = req.query.action as string;
  const resource = req.query.resource as string;

  let list = dbStore.audit;
  if (actor) {
    list = list.filter((a) => a.actor.name.toLowerCase().includes(actor.toLowerCase()));
  }
  if (action) {
    list = list.filter((a) => a.action === action);
  }
  if (resource) {
    list = list.filter((a) => a.resource === resource);
  }

  const total = list.length;
  const start = (page - 1) * limit;
  const data = list.slice(start, start + limit);

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

// GET /api/v1/audit/:id
auditRouter.get("/:id", (req, res, next) => {
  const entry = dbStore.audit.find((a) => a._id === req.params.id);
  if (!entry) return next(new NotFoundError("AuditEntry", req.params.id));
  return ok(res, entry);
});
