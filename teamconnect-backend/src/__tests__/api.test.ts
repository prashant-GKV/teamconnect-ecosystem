import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Server } from "http";
import { createApp } from "../app";
import { TaskScope, TaskStatus, RequestStatus } from "@teamconnect/shared-types";

describe("TeamConnect Backend API Suite", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address() as any;
        baseUrl = `http://localhost:${address.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it("GET /api/v1/health returns liveness status ok", async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.status).toBe("ok");
  });

  it("POST /api/v1/auth/login succeeds with valid demo credentials", async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "jordan.lee@acmecorp.com", password: "Password1!" }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.accessToken).toBeDefined();
    expect(json.data.user.email).toBe("jordan.lee@acmecorp.com");
  });

  it("GET /api/v1/categories returns list of operational categories", async () => {
    const res = await fetch(`${baseUrl}/api/v1/categories`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.data.length).toBeGreaterThan(0);
    expect(json.data.data[0].name).toBe("Engineering");
  });

  it("POST /api/v1/tasks enforces strict scope separation invariant", async () => {
    // Attempt to create a Category task that specifies a projectId -> must be rejected with 422
    const res = await fetch(`${baseUrl}/api/v1/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Invalid Scope Task",
        scope: TaskScope.Category,
        categoryId: "cat-1",
        projectId: "proj-1", // Violation!
      }),
    });
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /api/v1/tasks creates valid Category task when invariants hold", async () => {
    const res = await fetch(`${baseUrl}/api/v1/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Valid Category Task",
        description: "Department-level initiative",
        scope: TaskScope.Category,
        categoryId: "cat-1",
      }),
    });
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.scope).toBe(TaskScope.Category);
    expect(json.data.category._id).toBe("cat-1");
    expect(json.data.project).toBeUndefined();
  });

  it("POST /api/v1/tasks/:id/review blocks self-approval", async () => {
    // task-1 is assigned to u-employee-1
    const res = await fetch(`${baseUrl}/api/v1/tasks/task-1/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decision: "approve",
        reviewerId: "u-employee-1", // Assignee attempting to approve own work!
        notes: "Self-signed approval",
      }),
    });
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("SELF_APPROVAL_BLOCKED");
  });

  it("POST /api/v1/requests blocks duplicate pending requests", async () => {
    // req-1 is pending for targetUser: u-intern-1 and project: proj-1
    const res = await fetch(`${baseUrl}/api/v1/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: "proj-1",
        targetUserId: "u-intern-1",
        requestingCategoryId: "cat-1",
        targetCategoryId: "cat-2",
        role: "member",
        justification: "Duplicate staffing request",
      }),
    });
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("CONFLICT");
  });

  it("POST /api/v1/requests/:id/approve creates project membership atomically", async () => {
    const res = await fetch(`${baseUrl}/api/v1/requests/req-1/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ remarks: "Approved for sprint" }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.status).toBe(RequestStatus.Approved);
    expect(json.data.resultingMembership).toBeDefined();

    // Verify membership now exists
    const memRes = await fetch(`${baseUrl}/api/v1/memberships/${json.data.resultingMembership}`);
    expect(memRes.status).toBe(200);
    const memJson = await memRes.json();
    expect(memJson.success).toBe(true);
    expect(memJson.data.user._id).toBe("u-intern-1");
  });
});
