import { Router } from "express";
import { dbStore, getDefaultCategory, getDefaultUser } from "../../shared/data-store";
import { ok, created, noContent } from "../../shared/response";
import { NotFoundError, ValidationError } from "../../shared/errors";
import { ProjectStatus, TaskScope, MembershipStatus, ProjectMemberRole } from "@teamconnect/shared-types";
import type { Project, ProjectMember, Milestone } from "@teamconnect/shared-types";

export const projectsRouter = Router();

// GET /api/v1/projects
projectsRouter.get("/", (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const status = req.query.status as string;

  let list = dbStore.projects;
  if (status) {
    list = list.filter((p) => p.status === status);
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

// POST /api/v1/projects
projectsRouter.post("/", (req, res, next) => {
  const { name, description, originCategoryId, managerId, startAt, endAt, objectives } = req.body;
  const originCat = dbStore.categories.find((c) => c._id === originCategoryId) ?? getDefaultCategory();
  const manager = dbStore.users.find((u) => u._id === managerId) ?? getDefaultUser();

  const newProj: Project = {
    _id: `proj-${Date.now()}`,
    name: name || "New Project",
    description,
    originCategory: { _id: originCat._id, name: originCat.name },
    manager: { _id: manager._id, name: manager.name, email: manager.email, accountType: manager.accountType },
    status: ProjectStatus.Active,
    startAt: startAt || new Date().toISOString(),
    endAt: endAt || new Date(Date.now() + 60 * 86_400_000).toISOString(),
    objectives,
    milestones: [],
    memberCount: 1,
    taskCount: 0,
    canCreateTask: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbStore.projects.push(newProj);
  return created(res, newProj);
});

// GET /api/v1/projects/:id
projectsRouter.get("/:id", (req, res, next) => {
  const proj = dbStore.projects.find((p) => p._id === req.params.id);
  if (!proj) return next(new NotFoundError("Project", req.params.id));
  return ok(res, proj);
});

// PATCH /api/v1/projects/:id
projectsRouter.patch("/:id", (req, res, next) => {
  const proj = dbStore.projects.find((p) => p._id === req.params.id);
  if (!proj) return next(new NotFoundError("Project", req.params.id));

  if (req.body.name) proj.name = req.body.name;
  if (req.body.description !== undefined) proj.description = req.body.description;
  if (req.body.objectives !== undefined) proj.objectives = req.body.objectives;
  if (req.body.startAt) proj.startAt = req.body.startAt;
  if (req.body.endAt) proj.endAt = req.body.endAt;
  proj.updatedAt = new Date().toISOString();

  return ok(res, proj);
});

// POST /api/v1/projects/:id/state
projectsRouter.post("/:id/state", (req, res, next) => {
  const proj = dbStore.projects.find((p) => p._id === req.params.id);
  if (!proj) return next(new NotFoundError("Project", req.params.id));

  const { state } = req.body;
  if (!Object.values(ProjectStatus).includes(state)) {
    return next(new ValidationError("Invalid project status transition"));
  }

  proj.status = state as ProjectStatus;
  proj.updatedAt = new Date().toISOString();
  return ok(res, proj);
});

// GET /api/v1/projects/:id/members
projectsRouter.get("/:id/members", (req, res) => {
  const members = dbStore.memberships.filter((m) => m.project._id === req.params.id);
  return ok(res, members);
});

// POST /api/v1/projects/:id/members
projectsRouter.post("/:id/members", (req, res, next) => {
  const proj = dbStore.projects.find((p) => p._id === req.params.id);
  if (!proj) return next(new NotFoundError("Project", req.params.id));

  const { userId, role, startAt, endAt } = req.body;
  const user = dbStore.users.find((u) => u._id === userId);
  if (!user) return next(new NotFoundError("User", userId));

  const newMember: ProjectMember = {
    _id: `mbr-${Date.now()}`,
    project: { _id: proj._id, name: proj.name, status: proj.status },
    user: { _id: user._id, name: user.name, email: user.email, accountType: user.accountType },
    role: (role as ProjectMemberRole) || ProjectMemberRole.Member,
    sourceCategory: proj.originCategory,
    status: MembershipStatus.Active,
    startAt: startAt || new Date().toISOString(),
    endAt: endAt || proj.endAt,
    renewalPending: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbStore.memberships.push(newMember);
  proj.memberCount += 1;
  return created(res, newMember);
});

// DELETE /api/v1/projects/:id/members/:uid
projectsRouter.delete("/:id/members/:uid", (req, res, next) => {
  const idx = dbStore.memberships.findIndex((m) => m.project._id === req.params.id && m.user._id === req.params.uid);
  if (idx === -1) return next(new NotFoundError("Member", req.params.uid));

  dbStore.memberships.splice(idx, 1);
  return noContent(res);
});

// POST /api/v1/projects/:id/members/:uid/revoke
projectsRouter.post("/:id/members/:uid/revoke", (req, res, next) => {
  const member = dbStore.memberships.find((m) => m.project._id === req.params.id && m.user._id === req.params.uid);
  if (!member) return next(new NotFoundError("Member", req.params.uid));

  member.status = MembershipStatus.Revoked;
  member.revokeReason = req.body.reason || "Membership revoked by administrator or project manager";
  member.updatedAt = new Date().toISOString();
  return ok(res, member);
});

// POST /api/v1/projects/:id/members/:uid/renew
projectsRouter.post("/:id/members/:uid/renew", (req, res, next) => {
  const member = dbStore.memberships.find((m) => m.project._id === req.params.id && m.user._id === req.params.uid);
  if (!member) return next(new NotFoundError("Member", req.params.uid));

  member.renewalPending = true;
  member.updatedAt = new Date().toISOString();
  return ok(res, member);
});

// GET /api/v1/projects/:id/tasks (Project scope only)
projectsRouter.get("/:id/tasks", (req, res) => {
  const tasks = dbStore.tasks.filter(
    (t) => t.scope === TaskScope.Project && t.project?._id === req.params.id
  );
  return ok(res, tasks);
});

// GET /api/v1/projects/:id/milestones
projectsRouter.get("/:id/milestones", (req, res, next) => {
  const proj = dbStore.projects.find((p) => p._id === req.params.id);
  if (!proj) return next(new NotFoundError("Project", req.params.id));
  return ok(res, proj.milestones || []);
});

// POST /api/v1/projects/:id/milestones
projectsRouter.post("/:id/milestones", (req, res, next) => {
  const proj = dbStore.projects.find((p) => p._id === req.params.id);
  if (!proj) return next(new NotFoundError("Project", req.params.id));

  const newMilestone: Milestone = {
    _id: `ms-${Date.now()}`,
    name: req.body.name || "New Milestone",
    targetDate: req.body.targetDate || new Date().toISOString(),
    status: "pending",
  };

  proj.milestones.push(newMilestone);
  proj.updatedAt = new Date().toISOString();
  return created(res, newMilestone);
});

// GET /api/v1/projects/:id/discussions
projectsRouter.get("/:id/discussions", (_req, res) => {
  return ok(res, [
    {
      _id: "disc-1",
      author: { _id: "u-pm-1", name: "Taylor Kim", email: "taylor.kim@acmecorp.com" },
      content: "Sprint milestone goals are aligned. Please review tasks for upcoming handoff.",
      createdAt: new Date().toISOString(),
    },
  ]);
});

// POST /api/v1/projects/:id/discussions
projectsRouter.post("/:id/discussions", (req, res) => {
  return created(res, {
    _id: `disc-${Date.now()}`,
    author: dbStore.users[0],
    content: req.body.content || "",
    createdAt: new Date().toISOString(),
  });
});

// GET /api/v1/projects/:id/activity
projectsRouter.get("/:id/activity", (req, res) => {
  const activity = dbStore.audit.filter((a) => a.resourceId === req.params.id || a.resource === "project");
  return ok(res, activity);
});
