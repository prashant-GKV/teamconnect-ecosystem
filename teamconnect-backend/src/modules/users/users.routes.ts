import { Router } from "express";
import { dbStore, getDefaultUser } from "../../shared/data-store";
import { ok, created } from "../../shared/response";
import { NotFoundError } from "../../shared/errors";
import { AccountType } from "@teamconnect/shared-types";
import type { UserWithRoles, AdminRole } from "@teamconnect/shared-types";

export const usersRouter = Router();

// GET /api/v1/users/me/profile
usersRouter.get("/me/profile", (_req, res) => {
  return ok(res, getDefaultUser());
});

// PATCH /api/v1/users/me/profile
usersRouter.patch("/me/profile", (req, res) => {
  const user = getDefaultUser();
  if (req.body.name) user.name = req.body.name;
  if (req.body.avatarUrl !== undefined) user.avatarUrl = req.body.avatarUrl;
  user.updatedAt = new Date().toISOString();
  return ok(res, user);
});

// PATCH /api/v1/users/me/password
usersRouter.patch("/me/password", (_req, res) => {
  return ok(res, { message: "Password updated successfully." });
});

// PATCH /api/v1/users/me/preferences
usersRouter.patch("/me/preferences", (req, res) => {
  const user = getDefaultUser();
  user.preferences = { ...user.preferences, ...req.body };
  user.updatedAt = new Date().toISOString();
  return ok(res, user.preferences);
});

// GET /api/v1/users
usersRouter.get("/", (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const search = String(req.query.search ?? "").toLowerCase();
  const accountType = req.query.accountType as string;

  let list = dbStore.users;
  if (search) {
    list = list.filter((u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
  }
  if (accountType) {
    list = list.filter((u) => u.accountType === accountType);
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

// POST /api/v1/users
usersRouter.post("/", (req, res) => {
  const { name, email, accountType, adminRole } = req.body;
  const newUser: UserWithRoles = {
    _id: `u-${Date.now()}`,
    name: name || "New User",
    email: email || `user-${Date.now()}@example.com`,
    accountType: (accountType as AccountType) || AccountType.Employee,
    adminRole: adminRole as AdminRole,
    isActive: true,
    preferences: { theme: "system", notificationsEmail: true, notificationsInApp: true },
    categoryRoles: [],
    projectRoles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbStore.users.push(newUser);
  return created(res, newUser);
});

// GET /api/v1/users/:id
usersRouter.get("/:id", (req, res, next) => {
  const user = dbStore.users.find((u) => u._id === req.params.id);
  if (!user) return next(new NotFoundError("User", req.params.id));
  return ok(res, user);
});

// PATCH /api/v1/users/:id
usersRouter.patch("/:id", (req, res, next) => {
  const user = dbStore.users.find((u) => u._id === req.params.id);
  if (!user) return next(new NotFoundError("User", req.params.id));

  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  if (req.body.accountType) user.accountType = req.body.accountType;
  if (req.body.adminRole !== undefined) user.adminRole = req.body.adminRole || undefined;
  if (req.body.isActive !== undefined) user.isActive = req.body.isActive;
  user.updatedAt = new Date().toISOString();

  return ok(res, user);
});

// POST /api/v1/users/:id/suspend
usersRouter.post("/:id/suspend", (req, res, next) => {
  const user = dbStore.users.find((u) => u._id === req.params.id);
  if (!user) return next(new NotFoundError("User", req.params.id));
  user.isActive = false;
  user.updatedAt = new Date().toISOString();
  return ok(res, user);
});

// POST /api/v1/users/:id/activate
usersRouter.post("/:id/activate", (req, res, next) => {
  const user = dbStore.users.find((u) => u._id === req.params.id);
  if (!user) return next(new NotFoundError("User", req.params.id));
  user.isActive = true;
  user.updatedAt = new Date().toISOString();
  return ok(res, user);
});

// POST /api/v1/users/:id/reset-password
usersRouter.post("/:id/reset-password", (req, res, next) => {
  const user = dbStore.users.find((u) => u._id === req.params.id);
  if (!user) return next(new NotFoundError("User", req.params.id));
  return ok(res, { message: `Password reset email sent to ${user.email}` });
});
