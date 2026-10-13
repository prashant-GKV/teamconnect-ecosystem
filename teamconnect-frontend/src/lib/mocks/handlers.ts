// MSW request handlers — implement exact /api/v1 contract
import { http, HttpResponse, delay } from "msw";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import {
  SEED_CATEGORIES, SEED_DELEGATES, SEED_PROJECTS,
  SEED_MEMBERSHIPS, SEED_REQUESTS, SEED_TASKS, SEED_NOTIFICATIONS,
} from "./seed-data";
import { mockUserStore } from "./user-store";

const BASE = "http://localhost:4000";
const url  = (path: string) => `${BASE}${path}`;

function paginate<T>(items: T[], page = 1, limit = 20) {
  const total = items.length;
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    pagination: {
      page, limit, total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: start + limit < total,
      hasPrevPage: page > 1,
    },
  };
}

const ok   = (data: unknown, meta?: unknown) => HttpResponse.json({ success: true, data, ...(meta ? { meta } : {}) });
const fail = (code: string, message: string, status: number) =>
  HttpResponse.json({ success: false, error: { code, message, requestId: "mock-req" } }, { status });

// Simulate realistic network delay
const MOCK_DELAY = 120;

export const handlers = [
  // ── Health ─────────────────────────────────────────────────
  http.get(url(ENDPOINTS.HEALTH.LIVENESS),  async () => { await delay(30);  return ok({ status: "ok" }); }),
  http.get(url(ENDPOINTS.HEALTH.READINESS), async () => { await delay(30);  return ok({ status: "ready" }); }),

  // ── Auth ───────────────────────────────────────────────────
  http.get(url(ENDPOINTS.AUTH.ME), async ({ request }) => {
    await delay(MOCK_DELAY);
    const authHeader = request.headers.get("Authorization");
    const user = mockUserStore.getUserFromToken(authHeader);
    if (!user) {
      return fail("UNAUTHORIZED", "Not authenticated", 401);
    }
    return ok(user);
  }),

  http.post(url(ENDPOINTS.AUTH.LOGIN), async ({ request }) => {
    await delay(MOCK_DELAY);
    const body = (await request.json()) as {
      email?: string;
      username?: string;
      password?: string;
    };
    const identifier = body.email || body.username || "";
    if (!identifier || !body.password) {
      return fail("BAD_REQUEST", "Email or username and password are required", 400);
    }

    const user = mockUserStore.findByIdentifier(identifier);
    if (!user) {
      return fail("UNAUTHORIZED", "Invalid email/username or password", 401);
    }

    const isValid = await mockUserStore.verifyPassword(user, body.password);
    if (!isValid) {
      return fail("UNAUTHORIZED", "Invalid email/username or password", 401);
    }

    if (!user.isActive) {
      return fail("FORBIDDEN", "This account has been deactivated. Please contact an administrator.", 403);
    }

    const accessToken = mockUserStore.createToken(user);
    return ok({ accessToken, user });
  }),

  http.post(url("/api/v1/auth/signup"), async ({ request }) => {
    await delay(MOCK_DELAY);
    const body = (await request.json()) as {
      name: string;
      username: string;
      email: string;
      password: string;
      role?: "employee" | "lead" | "manager" | "admin";
    };

    try {
      const result = await mockUserStore.register({
        name: body.name,
        username: body.username,
        email: body.email,
        password: body.password,
        role: body.role || "employee",
      });
      return HttpResponse.json({ success: true, data: result }, { status: 201 });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      return fail("CONFLICT", msg, 409);
    }
  }),

  http.post(url("/api/v1/auth/register"), async ({ request }) => {
    await delay(MOCK_DELAY);
    const body = (await request.json()) as {
      name: string;
      username: string;
      email: string;
      password: string;
      role?: "employee" | "lead" | "manager" | "admin";
    };

    try {
      const result = await mockUserStore.register({
        name: body.name,
        username: body.username,
        email: body.email,
        password: body.password,
        role: body.role || "employee",
      });
      return HttpResponse.json({ success: true, data: result }, { status: 201 });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      return fail("CONFLICT", msg, 409);
    }
  }),

  http.post(url(ENDPOINTS.AUTH.LOGOUT), async () => {
    await delay(50);
    return ok({ message: "Logged out successfully" });
  }),

  http.post(url(ENDPOINTS.AUTH.REFRESH), async ({ request }) => {
    await delay(MOCK_DELAY);
    const authHeader = request.headers.get("Authorization");
    const user = mockUserStore.getUserFromToken(authHeader);
    const accessToken = user ? mockUserStore.createToken(user) : "mock-access-token-refreshed";
    return ok({ accessToken });
  }),

  http.post(url(ENDPOINTS.AUTH.FORGOT_PASSWORD), async () => {
    await delay(MOCK_DELAY);
    return ok({ message: "If that email is registered, you will receive a reset link." });
  }),

  http.post(url(ENDPOINTS.AUTH.RESET_PASSWORD), async () => {
    await delay(MOCK_DELAY);
    return ok({ message: "Password updated successfully." });
  }),

  // ── Users ──────────────────────────────────────────────────
  http.get(url(ENDPOINTS.USERS.LIST), async ({ request }) => {
    await delay(MOCK_DELAY);
    const params = new URL(request.url).searchParams;
    const page = Number(params.get("page") ?? 1);
    const limit = Number(params.get("limit") ?? 20);
    const allUsers = mockUserStore.getAll();
    return ok(paginate(allUsers, page, limit));
  }),

  http.get(url(ENDPOINTS.USERS.ME_PROFILE), async ({ request }) => {
    await delay(MOCK_DELAY);
    const authHeader = request.headers.get("Authorization");
    const user = mockUserStore.getUserFromToken(authHeader);
    if (!user) return fail("UNAUTHORIZED", "Not authenticated", 401);
    return ok(user);
  }),

  http.get(url("/api/v1/users/:id"), async ({ params }) => {
    await delay(MOCK_DELAY);
    const user = mockUserStore.findById(params["id"] as string);
    if (!user) return fail("NOT_FOUND", "User not found", 404);
    return ok(user);
  }),

  // ── Categories ─────────────────────────────────────────────
  http.get(url(ENDPOINTS.CATEGORIES.LIST), async () => {
    await delay(MOCK_DELAY);
    return ok(paginate(SEED_CATEGORIES));
  }),

  http.get(url("/api/v1/categories/:id"), async ({ params }) => {
    await delay(MOCK_DELAY);
    const cat = SEED_CATEGORIES.find((c) => c._id === params["id"]);
    if (!cat) return fail("NOT_FOUND", "Category not found", 404);
    return ok(cat);
  }),

  http.get(url("/api/v1/categories/:id/delegates"), async ({ params }) => {
    await delay(MOCK_DELAY);
    const dels = SEED_DELEGATES.filter((d) => d.categoryId === params["id"]);
    return ok(dels);
  }),

  http.get(url("/api/v1/categories/:id/members"), async ({ params }) => {
    await delay(MOCK_DELAY);
    const users = mockUserStore.getAll().slice(0, 5);
    return ok(paginate(users));
  }),

  // ── Projects ───────────────────────────────────────────────
  http.get(url(ENDPOINTS.PROJECTS.LIST), async () => {
    await delay(MOCK_DELAY);
    return ok(paginate(SEED_PROJECTS));
  }),

  http.get(url("/api/v1/projects/:id"), async ({ params }) => {
    await delay(MOCK_DELAY);
    const proj = SEED_PROJECTS.find((p) => p._id === params["id"]);
    if (!proj) return fail("NOT_FOUND", "Project not found", 404);
    return ok(proj);
  }),

  http.get(url("/api/v1/projects/:id/members"), async ({ params }) => {
    await delay(MOCK_DELAY);
    const members = SEED_MEMBERSHIPS.filter((m) => m.project._id === params["id"]);
    return ok(paginate(members));
  }),

  http.post(url(ENDPOINTS.PROJECTS.CREATE), async ({ request }) => {
    await delay(MOCK_DELAY);
    const body = (await request.json()) as Record<string, unknown>;
    const allUsers = mockUserStore.getAll();
    const newProject = {
      _id: `proj-${Date.now()}`,
      name: body["name"],
      description: body["description"],
      originCategory: SEED_CATEGORIES.find((c) => c._id === body["originCategoryId"]) ?? SEED_CATEGORIES[0],
      manager: allUsers.find((u) => u._id === body["managerId"]) ?? allUsers[1] ?? allUsers[0],
      status: "draft",
      startAt: body["startAt"],
      endAt: body["endAt"],
      milestones: [],
      memberCount: 0,
      taskCount: 0,
      canCreateTask: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, data: newProject }, { status: 201 });
  }),

  // ── Requests ───────────────────────────────────────────────
  http.get(url(ENDPOINTS.REQUESTS.LIST), async ({ request }) => {
    await delay(MOCK_DELAY);
    const params = new URL(request.url).searchParams;
    const type = params.get("type"); // 'inbox' | 'outbox'
    const authHeader = request.headers.get("Authorization");
    const user = mockUserStore.getUserFromToken(authHeader);

    let data = [...SEED_REQUESTS];
    if (type === "inbox") {
      if (user?.categoryRoles?.[0]?.categoryId) {
        data = data.filter((r) => r.targetCategory._id === user.categoryRoles[0]?.categoryId);
      } else {
        data = data.filter((r) => r.targetCategory._id === "cat-1");
      }
    } else if (type === "outbox") {
      if (user) {
        data = data.filter((r) => r.requester._id === user._id || r.requester.email === user.email);
      } else {
        data = data.filter((r) => r.requester._id === "u-pm-1");
      }
    }
    return ok(paginate(data));
  }),

  http.get(url("/api/v1/requests/:id"), async ({ params }) => {
    await delay(MOCK_DELAY);
    const req = SEED_REQUESTS.find((r) => r._id === params["id"]);
    if (!req) return fail("NOT_FOUND", "Request not found", 404);
    return ok(req);
  }),

  http.post(url("/api/v1/requests/:id/approve"), async ({ params }) => {
    await delay(MOCK_DELAY);
    const req = SEED_REQUESTS.find((r) => r._id === params["id"]);
    if (!req) return fail("NOT_FOUND", "Request not found", 404);
    return ok({ ...req, status: "approved", decidedAt: new Date().toISOString() });
  }),

  http.post(url("/api/v1/requests/:id/reject"), async ({ params }) => {
    await delay(MOCK_DELAY);
    const req = SEED_REQUESTS.find((r) => r._id === params["id"]);
    if (!req) return fail("NOT_FOUND", "Request not found", 404);
    return ok({ ...req, status: "rejected", decidedAt: new Date().toISOString() });
  }),

  http.post(url("/api/v1/requests/:id/cancel"), async ({ params }) => {
    await delay(MOCK_DELAY);
    const req = SEED_REQUESTS.find((r) => r._id === params["id"]);
    if (!req) return fail("NOT_FOUND", "Request not found", 404);
    if (req.status !== "pending") return fail("CONFLICT", "Only pending requests can be cancelled", 409);
    return ok({ ...req, status: "cancelled" });
  }),

  // ── Memberships ────────────────────────────────────────────
  http.get(url(ENDPOINTS.MEMBERSHIPS.LIST), async () => {
    await delay(MOCK_DELAY);
    return ok(paginate(SEED_MEMBERSHIPS));
  }),

  http.get(url("/api/v1/memberships/:id"), async ({ params }) => {
    await delay(MOCK_DELAY);
    const mbr = SEED_MEMBERSHIPS.find((m) => m._id === params["id"]);
    if (!mbr) return fail("NOT_FOUND", "Membership not found", 404);
    return ok(mbr);
  }),

  // ── Tasks ──────────────────────────────────────────────────
  http.get(url(ENDPOINTS.TASKS.LIST), async ({ request }) => {
    await delay(MOCK_DELAY);
    const params = new URL(request.url).searchParams;
    const scope  = params.get("scope");
    const status = params.get("status");
    const search = params.get("search")?.toLowerCase();
    const assignedTo = params.get("assignedTo");

    let data = [...SEED_TASKS];
    if (scope)  data = data.filter((t) => t.scope === scope);
    if (status) data = data.filter((t) => t.status === status);
    if (search) data = data.filter((t) => t.title.toLowerCase().includes(search));
    if (assignedTo) data = data.filter((t) => t.assignee?._id === assignedTo);

    return ok(paginate(data, Number(params.get("page") ?? 1), Number(params.get("limit") ?? 20)));
  }),

  http.get(url("/api/v1/tasks/:id"), async ({ params }) => {
    await delay(MOCK_DELAY);
    const task = SEED_TASKS.find((t) => t._id === params["id"]);
    if (!task) return fail("NOT_FOUND", "Task not found", 404);
    return ok(task);
  }),

  http.post(url("/api/v1/tasks/:id/start"), async ({ params }) => {
    await delay(MOCK_DELAY);
    const task = SEED_TASKS.find((t) => t._id === params["id"]);
    if (!task) return fail("NOT_FOUND", "Task not found", 404);
    return ok({ ...task, status: "in_progress" });
  }),

  http.post(url(ENDPOINTS.TASKS.CREATE), async ({ request }) => {
    await delay(MOCK_DELAY);
    const body = (await request.json()) as Record<string, any>;
    const allUsers = mockUserStore.getAll();
    const assignee = body.assigneeEmail
      ? allUsers.find(u => u.email === body.assigneeEmail) || allUsers[0]
      : allUsers[0];
    const newTask = {
      _id: `task-${Date.now()}`,
      title: body.title || "Untitled Task",
      scope: body.scope || "category",
      priority: body.priority || "medium",
      status: "assigned",
      description: body.description || "",
      acceptanceCriteria: body.acceptanceCriteria || "",
      dueAt: body.dueAt || new Date(Date.now() + 7 * 86400000).toISOString(),
      category: SEED_CATEGORIES.find(c => c._id === body.categoryId) || SEED_CATEGORIES[0],
      project: body.projectId ? (SEED_PROJECTS.find(p => p._id === body.projectId) || SEED_PROJECTS[0]) : undefined,
      assignee,
      dependsOn: [],
      submissionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    SEED_TASKS.unshift(newTask as any);
    return HttpResponse.json({ success: true, data: newTask }, { status: 201 });
  }),

  http.post(url("/api/v1/tasks/:id/submit"), async ({ params, request }) => {
    await delay(MOCK_DELAY);
    const task = SEED_TASKS.find((t) => t._id === params["id"]);
    if (!task) return fail("NOT_FOUND", "Task not found", 404);
    task.status = "submitted_for_review" as any;
    task.submissionCount = (task.submissionCount || 0) + 1;
    return ok({ ...task, status: "submitted_for_review" });
  }),

  http.post(url("/api/v1/tasks/:id/submissions"), async ({ params, request }) => {
    await delay(MOCK_DELAY);
    const task = SEED_TASKS.find((t) => t._id === params["id"]);
    if (!task) return fail("NOT_FOUND", "Task not found", 404);
    task.status = "submitted_for_review" as any;
    task.submissionCount = (task.submissionCount || 0) + 1;
    return ok({ ...task, status: "submitted_for_review" });
  }),

  http.post(url(ENDPOINTS.REQUESTS.CREATE), async ({ request }) => {
    await delay(MOCK_DELAY);
    const body = (await request.json()) as Record<string, any>;
    const allUsers = mockUserStore.getAll();
    const newReq = {
      _id: `req-${Date.now()}`,
      project: SEED_PROJECTS.find(p => p._id === body.projectId) || SEED_PROJECTS[0],
      requester: allUsers.find(u => u._id === "u-pm-1") || allUsers[0],
      targetUser: {
        _id: `u-${Date.now()}`,
        name: body.targetUserName || "Requested Member",
        email: "member@acmecorp.com",
        accountType: "employee",
        categoryRoles: [],
        projectRoles: [],
      },
      requestingCategory: SEED_CATEGORIES[0],
      targetCategory: SEED_CATEGORIES[1] || SEED_CATEGORIES[0],
      role: body.role || "Contributor",
      startAt: body.startAt || new Date().toISOString(),
      endAt: body.endAt || new Date(Date.now() + 60 * 86400000).toISOString(),
      justification: body.justification || "Required for sprint support",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    SEED_REQUESTS.unshift(newReq as any);
    return HttpResponse.json({ success: true, data: newReq }, { status: 201 });
  }),

  // ── Notifications ──────────────────────────────────────────
  http.get(url(ENDPOINTS.NOTIFICATIONS.LIST), async () => {
    await delay(MOCK_DELAY);
    return ok(paginate(SEED_NOTIFICATIONS));
  }),

  http.post(url(ENDPOINTS.NOTIFICATIONS.READ_ALL), async () => {
    await delay(MOCK_DELAY);
    return ok({ updated: SEED_NOTIFICATIONS.length });
  }),
];
