import { Router } from "express";
import { dbStore, getDefaultUser } from "../../shared/data-store";
import { ok, created, noContent } from "../../shared/response";
import {
  NotFoundError, ValidationError, SelfApprovalError,
  CycleDetectedError
} from "../../shared/errors";
import {
  TaskScope, TaskStatus, TaskPriority, SubmissionStatus,
  NotificationType
} from "@teamconnect/shared-types";
import type { Task, Submission, Notification } from "@teamconnect/shared-types";

export const tasksRouter = Router();

// GET /api/v1/tasks
tasksRouter.get("/", (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const scope = req.query.scope as TaskScope;
  const status = req.query.status as string;
  const assigneeId = req.query.assigneeId as string;
  const categoryId = req.query.categoryId as string;
  const projectId = req.query.projectId as string;

  let list = dbStore.tasks;
  if (scope) {
    list = list.filter((t) => t.scope === scope);
  }
  if (status) {
    list = list.filter((t) => t.status === status);
  }
  if (assigneeId) {
    list = list.filter((t) => t.assignee?._id === assigneeId);
  }
  if (categoryId) {
    list = list.filter((t) => t.category?._id === categoryId);
  }
  if (projectId) {
    list = list.filter((t) => t.project?._id === projectId);
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

// POST /api/v1/tasks
tasksRouter.post("/", (req, res, next) => {
  const {
    title, description, scope, categoryId, projectId,
    assigneeId, priority, dueAt, acceptanceCriteria, tags
  } = req.body;

  // Strict scope separation invariant
  if (scope === TaskScope.Category) {
    if (projectId || !categoryId) {
      return next(new ValidationError("Category tasks must specify categoryId and cannot belong to a project"));
    }
  } else if (scope === TaskScope.Project) {
    if (categoryId || !projectId) {
      return next(new ValidationError("Project tasks must specify projectId and cannot belong to a category"));
    }
  } else {
    return next(new ValidationError("Invalid task scope"));
  }

  let catRef = undefined;
  if (categoryId) {
    const c = dbStore.categories.find((cat) => cat._id === categoryId);
    if (c) catRef = { _id: c._id, name: c.name };
  }

  let projRef = undefined;
  if (projectId) {
    const p = dbStore.projects.find((proj) => proj._id === projectId);
    if (p) projRef = { _id: p._id, name: p.name, status: p.status };
  }

  let assigneeRef = undefined;
  if (assigneeId) {
    const u = dbStore.users.find((user) => user._id === assigneeId);
    if (u) assigneeRef = { _id: u._id, name: u.name, email: u.email, accountType: u.accountType };
  }

  const newTask: Task = {
    _id: `task-${Date.now()}`,
    title: title || "New Task",
    description,
    scope: scope as TaskScope,
    category: catRef,
    project: projRef,
    assignee: assigneeRef,
    status: assigneeRef ? TaskStatus.Assigned : TaskStatus.Draft,
    priority: (priority as TaskPriority) || TaskPriority.Medium,
    dueAt: dueAt || new Date(Date.now() + 7 * 86_400_000).toISOString(),
    isOverdue: false,
    acceptanceCriteria,
    dependsOn: [],
    submissionCount: 0,
    tags: tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbStore.tasks.push(newTask);
  return created(res, newTask);
});

// GET /api/v1/tasks/:id
tasksRouter.get("/:id", (req, res, next) => {
  const task = dbStore.tasks.find((t) => t._id === req.params.id);
  if (!task) return next(new NotFoundError("Task", req.params.id));
  return ok(res, task);
});

// PATCH /api/v1/tasks/:id
tasksRouter.patch("/:id", (req, res, next) => {
  const task = dbStore.tasks.find((t) => t._id === req.params.id);
  if (!task) return next(new NotFoundError("Task", req.params.id));

  if (req.body.title) task.title = req.body.title;
  if (req.body.description !== undefined) task.description = req.body.description;
  if (req.body.priority) task.priority = req.body.priority;
  if (req.body.dueAt) task.dueAt = req.body.dueAt;
  if (req.body.acceptanceCriteria !== undefined) task.acceptanceCriteria = req.body.acceptanceCriteria;
  task.updatedAt = new Date().toISOString();

  return ok(res, task);
});

// POST /api/v1/tasks/:id/assign
tasksRouter.post("/:id/assign", (req, res, next) => {
  const task = dbStore.tasks.find((t) => t._id === req.params.id);
  if (!task) return next(new NotFoundError("Task", req.params.id));

  const user = dbStore.users.find((u) => u._id === req.body.userId);
  if (!user) return next(new NotFoundError("User", req.body.userId));

  task.assignee = { _id: user._id, name: user.name, email: user.email, accountType: user.accountType };
  if (task.status === TaskStatus.Draft) {
    task.status = TaskStatus.Assigned;
  }
  task.updatedAt = new Date().toISOString();

  // Notification
  const notif: Notification = {
    _id: `notif-${Date.now()}`,
    recipient: user._id,
    type: NotificationType.TaskAssigned,
    title: "New task assigned",
    body: `You have been assigned '${task.title}'`,
    read: false,
    entityType: "task",
    entityId: task._id,
    link: `/tasks/${task._id}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  dbStore.notifications.push(notif);

  return ok(res, task);
});

// POST /api/v1/tasks/:id/start
tasksRouter.post("/:id/start", (req, res, next) => {
  const task = dbStore.tasks.find((t) => t._id === req.params.id);
  if (!task) return next(new NotFoundError("Task", req.params.id));

  task.status = TaskStatus.InProgress;
  task.updatedAt = new Date().toISOString();
  return ok(res, task);
});

// POST /api/v1/tasks/:id/block
tasksRouter.post("/:id/block", (req, res, next) => {
  const task = dbStore.tasks.find((t) => t._id === req.params.id);
  if (!task) return next(new NotFoundError("Task", req.params.id));

  task.status = TaskStatus.Blocked;
  task.updatedAt = new Date().toISOString();
  return ok(res, task);
});

// POST /api/v1/tasks/:id/unblock
tasksRouter.post("/:id/unblock", (req, res, next) => {
  const task = dbStore.tasks.find((t) => t._id === req.params.id);
  if (!task) return next(new NotFoundError("Task", req.params.id));

  task.status = TaskStatus.InProgress;
  task.updatedAt = new Date().toISOString();
  return ok(res, task);
});

// POST /api/v1/tasks/:id/cancel
tasksRouter.post("/:id/cancel", (req, res, next) => {
  const task = dbStore.tasks.find((t) => t._id === req.params.id);
  if (!task) return next(new NotFoundError("Task", req.params.id));

  task.status = TaskStatus.Cancelled;
  task.updatedAt = new Date().toISOString();
  return ok(res, task);
});

// GET /api/v1/tasks/:id/submissions
tasksRouter.get("/:id/submissions", (req, res) => {
  const subs = dbStore.submissions.filter((s) => s.task._id === req.params.id);
  return ok(res, subs);
});

// POST /api/v1/tasks/:id/submissions
tasksRouter.post("/:id/submissions", (req, res, next) => {
  const task = dbStore.tasks.find((t) => t._id === req.params.id);
  if (!task) return next(new NotFoundError("Task", req.params.id));

  const version = (task.submissionCount || 0) + 1;
  const submitter = task.assignee ?? getDefaultUser();

  const newSub: Submission = {
    _id: `sub-${Date.now()}`,
    task: { _id: task._id, title: task.title, scope: task.scope },
    submitter,
    version,
    notes: req.body.notes || "Deliverable submission",
    files: req.body.files || [],
    status: SubmissionStatus.PendingReview,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbStore.submissions.push(newSub);
  task.submissionCount = version;
  task.status = TaskStatus.SubmittedForReview;
  task.latestSubmission = {
    _id: newSub._id,
    version: newSub.version,
    status: "pending_review",
    submittedAt: newSub.createdAt,
  };
  task.updatedAt = new Date().toISOString();

  return created(res, newSub);
});

// GET /api/v1/tasks/:id/submissions/:vid
tasksRouter.get("/:id/submissions/:vid", (req, res, next) => {
  const sub = dbStore.submissions.find((s) => s._id === req.params.vid && s.task._id === req.params.id);
  if (!sub) return next(new NotFoundError("Submission", req.params.vid));
  return ok(res, sub);
});

// POST /api/v1/tasks/:id/review
tasksRouter.post("/:id/review", (req, res, next) => {
  const task = dbStore.tasks.find((t) => t._id === req.params.id);
  if (!task) return next(new NotFoundError("Task", req.params.id));

  const { decision, notes, reviewerId } = req.body;
  const reviewer = dbStore.users.find((u) => u._id === reviewerId) ?? (dbStore.users[1] ?? getDefaultUser());

  // Self-approval blocked invariant
  if (task.assignee && task.assignee._id === reviewer._id) {
    return next(new SelfApprovalError());
  }

  if (decision === "approve") {
    task.status = TaskStatus.Approved;
  } else if (decision === "request_revision") {
    task.status = TaskStatus.RevisionRequested;
  } else {
    return next(new ValidationError("Decision must be 'approve' or 'request_revision'"));
  }

  task.reviewer = { _id: reviewer._id, name: reviewer.name, email: reviewer.email, accountType: reviewer.accountType };
  task.updatedAt = new Date().toISOString();

  // Update latest submission
  const latestSub = dbStore.submissions
    .filter((s) => s.task._id === task._id)
    .sort((a, b) => b.version - a.version)[0];
  if (latestSub) {
    latestSub.status = decision === "approve" ? SubmissionStatus.Approved : SubmissionStatus.RevisionRequired;
    latestSub.reviewedBy = task.reviewer;
    latestSub.reviewedAt = new Date().toISOString();
    latestSub.reviewNotes = notes;
    latestSub.updatedAt = new Date().toISOString();
  }

  return ok(res, task);
});

// GET /api/v1/tasks/:id/dependencies
tasksRouter.get("/:id/dependencies", (req, res, next) => {
  const task = dbStore.tasks.find((t) => t._id === req.params.id);
  if (!task) return next(new NotFoundError("Task", req.params.id));
  return ok(res, task.dependsOn || []);
});

// POST /api/v1/tasks/:id/dependencies
tasksRouter.post("/:id/dependencies", (req, res, next) => {
  const task = dbStore.tasks.find((t) => t._id === req.params.id);
  if (!task) return next(new NotFoundError("Task", req.params.id));

  const depTargetId = req.body.dependsOnTaskId;
  if (depTargetId === task._id) {
    return next(new CycleDetectedError());
  }

  const depTask = dbStore.tasks.find((t) => t._id === depTargetId);
  if (!depTask) return next(new NotFoundError("Task", depTargetId));

  // Check if target already depends on this task (circular dependency)
  if (depTask.dependsOn.some((d) => d.task._id === task._id)) {
    return next(new CycleDetectedError());
  }

  task.dependsOn.push({
    task: { _id: depTask._id, title: depTask.title, status: depTask.status, scope: depTask.scope },
    status: depTask.status,
  });
  task.updatedAt = new Date().toISOString();

  return created(res, task.dependsOn);
});

// DELETE /api/v1/tasks/:id/dependencies/:depId
tasksRouter.delete("/:id/dependencies/:depId", (req, res, next) => {
  const task = dbStore.tasks.find((t) => t._id === req.params.id);
  if (!task) return next(new NotFoundError("Task", req.params.id));

  const idx = task.dependsOn.findIndex((d) => d.task._id === req.params.depId);
  if (idx !== -1) {
    task.dependsOn.splice(idx, 1);
  }
  return noContent(res);
});

// GET /api/v1/tasks/:id/activity
tasksRouter.get("/:id/activity", (req, res) => {
  return ok(res, [
    {
      _id: "act-1",
      action: "created",
      timestamp: new Date().toISOString(),
      details: "Task initialized",
    },
  ]);
});
