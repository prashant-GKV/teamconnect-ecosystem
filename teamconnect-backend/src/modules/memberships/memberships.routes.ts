import { Router } from "express";
import { dbStore, getDefaultUser } from "../../shared/data-store";
import { ok } from "../../shared/response";
import { NotFoundError } from "../../shared/errors";
import { MembershipStatus, AuditAction } from "@teamconnect/shared-types";
import type { AuditEntry } from "@teamconnect/shared-types";

export const membershipsRouter = Router();

// GET /api/v1/memberships
membershipsRouter.get("/", (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const status = req.query.status as string;

  let list = dbStore.memberships;
  if (status) {
    list = list.filter((m) => m.status === status);
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

// GET /api/v1/memberships/:id
membershipsRouter.get("/:id", (req, res, next) => {
  const member = dbStore.memberships.find((m) => m._id === req.params.id);
  if (!member) return next(new NotFoundError("Membership", req.params.id));
  return ok(res, member);
});

// POST /api/v1/memberships/:id/renew
membershipsRouter.post("/:id/renew", (req, res, next) => {
  const member = dbStore.memberships.find((m) => m._id === req.params.id);
  if (!member) return next(new NotFoundError("Membership", req.params.id));

  member.renewalPending = true;
  member.updatedAt = new Date().toISOString();
  return ok(res, member);
});

// POST /api/v1/memberships/:id/revoke
membershipsRouter.post("/:id/revoke", (req, res, next) => {
  const member = dbStore.memberships.find((m) => m._id === req.params.id);
  if (!member) return next(new NotFoundError("Membership", req.params.id));

  const actor = getDefaultUser();
  member.status = MembershipStatus.Revoked;
  member.revokedBy = { _id: actor._id, name: actor.name, email: actor.email, accountType: actor.accountType };
  member.revokeReason = req.body.reason || "Membership revoked by administrator";
  member.updatedAt = new Date().toISOString();

  // Audit
  const auditEntry: AuditEntry = {
    _id: `aud-${Date.now()}`,
    actor: member.revokedBy,
    action: AuditAction.Revoke,
    resource: "membership",
    resourceId: member._id,
    reason: member.revokeReason,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  dbStore.audit.push(auditEntry);

  return ok(res, member);
});
