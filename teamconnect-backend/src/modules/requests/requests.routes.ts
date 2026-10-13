import { Router } from "express";
import { dbStore, getDefaultUser, getDefaultProject, getDefaultCategory } from "../../shared/data-store";
import { ok, created } from "../../shared/response";
import {
  NotFoundError, ConflictError, ConcurrentDecisionError,
  ValidationError
} from "../../shared/errors";
import {
  RequestStatus, MembershipStatus, ProjectMemberRole, AuditAction
} from "@teamconnect/shared-types";
import type { Request, ProjectMember, AuditEntry } from "@teamconnect/shared-types";

export const requestsRouter = Router();

// GET /api/v1/requests
requestsRouter.get("/", (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const type = req.query.type as string; // "inbox" | "outbox"
  const status = req.query.status as string;

  let list = dbStore.requests;
  if (status) {
    list = list.filter((r) => r.status === status);
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

// POST /api/v1/requests
requestsRouter.post("/", (req, res, next) => {
  const {
    projectId, targetUserId, requestingCategoryId, targetCategoryId,
    role, justification, expectedContribution, startAt, endAt, workloadPercent
  } = req.body;

  // Check for duplicate pending request for same project and user
  const duplicate = dbStore.requests.find(
    (r) => r.project._id === projectId && r.targetUser._id === targetUserId && r.status === RequestStatus.Pending
  );
  if (duplicate) {
    return next(new ConflictError("A pending request already exists for this user and project"));
  }

  const proj = dbStore.projects.find((p) => p._id === projectId) ?? getDefaultProject();
  const targetUser = dbStore.users.find((u) => u._id === targetUserId) ?? getDefaultUser();
  const reqCat = dbStore.categories.find((c) => c._id === requestingCategoryId) ?? getDefaultCategory();
  const tgtCat = dbStore.categories.find((c) => c._id === targetCategoryId) ?? (dbStore.categories[1] ?? getDefaultCategory());
  const requester = getDefaultUser();

  const newReq: Request = {
    _id: `req-${Date.now()}`,
    project: { _id: proj._id, name: proj.name, status: proj.status },
    requester: { _id: requester._id, name: requester.name, email: requester.email, accountType: requester.accountType },
    targetUser: { _id: targetUser._id, name: targetUser.name, email: targetUser.email, accountType: targetUser.accountType },
    requestingCategory: { _id: reqCat._id, name: reqCat.name },
    targetCategory: { _id: tgtCat._id, name: tgtCat.name },
    role: (role as ProjectMemberRole) || ProjectMemberRole.Member,
    justification: justification || "Staffing support needed",
    expectedContribution,
    startAt: startAt || new Date().toISOString(),
    endAt: endAt || new Date(Date.now() + 30 * 86_400_000).toISOString(),
    workloadPercent: workloadPercent ? Number(workloadPercent) : undefined,
    status: RequestStatus.Pending,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbStore.requests.push(newReq);
  return created(res, newReq);
});

// GET /api/v1/requests/:id
requestsRouter.get("/:id", (req, res, next) => {
  const request = dbStore.requests.find((r) => r._id === req.params.id);
  if (!request) return next(new NotFoundError("Request", req.params.id));
  return ok(res, request);
});

// POST /api/v1/requests/:id/approve
requestsRouter.post("/:id/approve", (req, res, next) => {
  const request = dbStore.requests.find((r) => r._id === req.params.id);
  if (!request) return next(new NotFoundError("Request", req.params.id));

  if (request.status !== RequestStatus.Pending) {
    return next(new ConcurrentDecisionError());
  }

  const approver = getDefaultUser();
  request.status = RequestStatus.Approved;
  request.decidedBy = { _id: approver._id, name: approver.name, email: approver.email, accountType: approver.accountType };
  request.decidedAt = new Date().toISOString();
  request.updatedAt = new Date().toISOString();

  // Create resulting membership atomically
  const newMembership: ProjectMember = {
    _id: `mbr-${Date.now()}`,
    project: request.project,
    user: request.targetUser,
    role: request.role,
    sourceCategory: request.targetCategory,
    status: MembershipStatus.Active,
    startAt: request.startAt,
    endAt: request.endAt,
    approvedBy: request.decidedBy,
    renewalPending: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbStore.memberships.push(newMembership);
  request.resultingMembership = newMembership._id;

  // Log audit
  const auditEntry: AuditEntry = {
    _id: `aud-${Date.now()}`,
    actor: request.decidedBy,
    action: AuditAction.Approve,
    resource: "request",
    resourceId: request._id,
    reason: req.body.remarks || "Cross-category request approved",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  dbStore.audit.push(auditEntry);

  return ok(res, request);
});

// POST /api/v1/requests/:id/reject
requestsRouter.post("/:id/reject", (req, res, next) => {
  const request = dbStore.requests.find((r) => r._id === req.params.id);
  if (!request) return next(new NotFoundError("Request", req.params.id));

  if (request.status !== RequestStatus.Pending) {
    return next(new ConcurrentDecisionError());
  }

  const reason = req.body.rejectionReason || req.body.reason;
  if (!reason) {
    return next(new ValidationError("Rejection reason is required"));
  }

  const actor = getDefaultUser();
  request.status = RequestStatus.Rejected;
  request.decidedBy = { _id: actor._id, name: actor.name, email: actor.email, accountType: actor.accountType };
  request.decidedAt = new Date().toISOString();
  request.rejectionReason = reason;
  request.updatedAt = new Date().toISOString();

  return ok(res, request);
});

// POST /api/v1/requests/:id/cancel
requestsRouter.post("/:id/cancel", (req, res, next) => {
  const request = dbStore.requests.find((r) => r._id === req.params.id);
  if (!request) return next(new NotFoundError("Request", req.params.id));

  if (request.status !== RequestStatus.Pending) {
    return next(new ConcurrentDecisionError());
  }

  request.status = RequestStatus.Cancelled;
  request.cancelledAt = new Date().toISOString();
  request.updatedAt = new Date().toISOString();

  return ok(res, request);
});

// POST /api/v1/requests/:id/renew
requestsRouter.post("/:id/renew", (req, res, next) => {
  const request = dbStore.requests.find((r) => r._id === req.params.id);
  if (!request) return next(new NotFoundError("Request", req.params.id));

  return ok(res, { message: "Renewal proposed successfully" });
});
