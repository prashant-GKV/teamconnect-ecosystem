import { Router } from "express";
import { dbStore } from "../../shared/data-store";
import { ok } from "../../shared/response";
import { TaskStatus, MembershipStatus, DelegationStatus } from "@teamconnect/shared-types";

export const reportsRouter = Router();

// GET /api/v1/reports/task-completion
reportsRouter.get("/task-completion", (_req, res) => {
  const total = dbStore.tasks.length;
  const approved = dbStore.tasks.filter((t) => t.status === TaskStatus.Approved).length;
  const overdue = dbStore.tasks.filter((t) => t.isOverdue).length;
  const inProgress = dbStore.tasks.filter((t) => t.status === TaskStatus.InProgress).length;
  const submitted = dbStore.tasks.filter((t) => t.status === TaskStatus.SubmittedForReview).length;

  return ok(res, {
    total,
    completionRate: total > 0 ? Math.round((approved / total) * 100) : 0,
    approved,
    overdue,
    inProgress,
    submitted,
  });
});

// GET /api/v1/reports/project-progress
reportsRouter.get("/project-progress", (_req, res) => {
  const projects = dbStore.projects.map((p) => ({
    _id: p._id,
    name: p.name,
    status: p.status,
    memberCount: p.memberCount,
    taskCount: p.taskCount,
    manager: p.manager.name,
  }));
  return ok(res, projects);
});

// GET /api/v1/reports/category-workload
reportsRouter.get("/category-workload", (_req, res) => {
  const workload = dbStore.categories.map((c) => ({
    _id: c._id,
    name: c.name,
    memberCount: c.memberCount,
    activeTasks: dbStore.tasks.filter((t) => t.category?._id === c._id).length,
  }));
  return ok(res, workload);
});

// GET /api/v1/reports/review-turnaround
reportsRouter.get("/review-turnaround", (_req, res) => {
  return ok(res, {
    averageHours: 14.5,
    targetHours: 24,
    slaComplianceRate: 94.2,
  });
});

// GET /api/v1/reports/request-turnaround
reportsRouter.get("/request-turnaround", (_req, res) => {
  return ok(res, {
    averageHours: 18.2,
    targetHours: 48,
    approvalRate: 75.0,
  });
});

// GET /api/v1/reports/memberships-expiring
reportsRouter.get("/memberships-expiring", (_req, res) => {
  const expiring = dbStore.memberships.filter(
    (m) => m.status === MembershipStatus.ExpiringSoon
  );
  return ok(res, expiring);
});

// GET /api/v1/reports/delegation-activity
reportsRouter.get("/delegation-activity", (_req, res) => {
  const activeDelegates = dbStore.delegates.filter(
    (d) => d.status === DelegationStatus.Active
  );
  return ok(res, {
    totalActive: activeDelegates.length,
    delegates: activeDelegates,
  });
});

// GET /api/v1/reports/:type/export
reportsRouter.get("/:type/export", (req, res) => {
  const csvContent = "Metric,Value,Status\nTotal Tasks,10,Healthy\nCompletion Rate,85%,Good\nSLA Rate,94%,Good\n";
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${req.params.type}-report.csv"`);
  return res.send(csvContent);
});
