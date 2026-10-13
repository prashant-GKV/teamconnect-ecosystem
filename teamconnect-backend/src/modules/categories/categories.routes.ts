import { Router } from "express";
import { dbStore } from "../../shared/data-store";
import { ok, created } from "../../shared/response";
import { NotFoundError, ValidationError, ForbiddenError } from "../../shared/errors";
import { DelegationStatus, DelegatePermission, TaskScope } from "@teamconnect/shared-types";
import type { Category, CategoryDelegate } from "@teamconnect/shared-types";

export const categoriesRouter = Router();

// GET /api/v1/categories
categoriesRouter.get("/", (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const total = dbStore.categories.length;
  const start = (page - 1) * limit;
  const data = dbStore.categories.slice(start, start + limit);

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

// POST /api/v1/categories
categoriesRouter.post("/", (req, res) => {
  const { name, description } = req.body;
  const newCat: Category = {
    _id: `cat-${Date.now()}`,
    name: name || "New Category",
    description,
    isActive: true,
    memberCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  dbStore.categories.push(newCat);
  return created(res, newCat);
});

// GET /api/v1/categories/:id
categoriesRouter.get("/:id", (req, res, next) => {
  const cat = dbStore.categories.find((c) => c._id === req.params.id);
  if (!cat) return next(new NotFoundError("Category", req.params.id));
  return ok(res, cat);
});

// PATCH /api/v1/categories/:id
categoriesRouter.patch("/:id", (req, res, next) => {
  const cat = dbStore.categories.find((c) => c._id === req.params.id);
  if (!cat) return next(new NotFoundError("Category", req.params.id));

  if (req.body.name) cat.name = req.body.name;
  if (req.body.description !== undefined) cat.description = req.body.description;
  if (req.body.isActive !== undefined) cat.isActive = req.body.isActive;
  cat.updatedAt = new Date().toISOString();

  return ok(res, cat);
});

// POST /api/v1/categories/:id/lead - assign or replace primary lead
categoriesRouter.post("/:id/lead", (req, res, next) => {
  const cat = dbStore.categories.find((c) => c._id === req.params.id);
  if (!cat) return next(new NotFoundError("Category", req.params.id));

  const { userId } = req.body;
  const user = dbStore.users.find((u) => u._id === userId);
  if (!user) return next(new NotFoundError("User", userId));

  cat.lead = {
    _id: user._id,
    name: user.name,
    email: user.email,
    accountType: user.accountType,
  };
  cat.updatedAt = new Date().toISOString();

  return ok(res, cat);
});

// GET /api/v1/categories/:id/delegates
categoriesRouter.get("/:id/delegates", (req, res) => {
  const list = dbStore.delegates.filter((d) => d.categoryId === req.params.id);
  return ok(res, list);
});

// POST /api/v1/categories/:id/delegates
categoriesRouter.post("/:id/delegates", (req, res, next) => {
  const cat = dbStore.categories.find((c) => c._id === req.params.id);
  if (!cat) return next(new NotFoundError("Category", req.params.id));

  const { delegateId, permissions, effectiveFrom, effectiveTo } = req.body;
  const user = dbStore.users.find((u) => u._id === delegateId);
  if (!user) return next(new NotFoundError("User", delegateId));

  const newDelegate: CategoryDelegate = {
    _id: `del-${Date.now()}`,
    categoryId: cat._id,
    delegate: { _id: user._id, name: user.name, email: user.email, accountType: user.accountType },
    grantedBy: cat.lead ?? { _id: "u-admin", name: "System Admin", email: "admin@acmecorp.com", accountType: user.accountType },
    permissions: permissions || [DelegatePermission.ReviewTask],
    effectiveFrom: effectiveFrom || new Date().toISOString(),
    effectiveTo: effectiveTo || new Date(Date.now() + 30 * 86_400_000).toISOString(),
    status: DelegationStatus.Active,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbStore.delegates.push(newDelegate);
  return created(res, newDelegate);
});

// POST /api/v1/categories/:id/delegates/:did/revoke
categoriesRouter.post("/:id/delegates/:did/revoke", (req, res, next) => {
  const del = dbStore.delegates.find((d) => d._id === req.params.did && d.categoryId === req.params.id);
  if (!del) return next(new NotFoundError("Delegate", req.params.did));

  del.status = DelegationStatus.Revoked;
  del.updatedAt = new Date().toISOString();
  return ok(res, del);
});

// GET /api/v1/categories/:id/members
categoriesRouter.get("/:id/members", (req, res) => {
  const members = dbStore.users.slice(0, 4);
  return ok(res, members);
});

// GET /api/v1/categories/:id/tasks
categoriesRouter.get("/:id/tasks", (req, res) => {
  const tasks = dbStore.tasks.filter(
    (t) => t.scope === TaskScope.Category && t.category?._id === req.params.id
  );
  return ok(res, tasks);
});

// GET /api/v1/categories/:id/announcements
categoriesRouter.get("/:id/announcements", (_req, res) => {
  return ok(res, [
    {
      _id: "ann-1",
      title: "Category Operations Update",
      content: "All sprint deliverables and reviews must be finalized before the upcoming cycle.",
      createdAt: new Date().toISOString(),
    },
  ]);
});

// POST /api/v1/categories/:id/announcements
categoriesRouter.post("/:id/announcements", (req, res) => {
  return created(res, {
    _id: `ann-${Date.now()}`,
    title: req.body.title || "Announcement",
    content: req.body.content || "",
    createdAt: new Date().toISOString(),
  });
});
