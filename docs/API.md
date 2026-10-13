# TeamConnect — API Reference (v1)

> Base URL: /api/v1  
> Auth: Bearer token (Authorization header) + httpOnly cookie for refresh  
> All responses: { success, data|error, meta }  
> All datetimes: ISO-8601 UTC string  
> Pagination: ?page=1&limit=20 (tables) or ?cursor=... (feeds)

---

## Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/login | Authenticate; returns accessToken + sets refresh cookie |
| POST | /auth/refresh | Rotate refresh token; returns new accessToken |
| POST | /auth/logout | Revoke refresh token; clear cookie |
| POST | /auth/forgot-password | Send reset link |
| POST | /auth/reset-password | Consume reset token; set new password |
| GET  | /auth/me | Return current user with roles |

---

## Users

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | /users | Admin | List users (paginated, filterable) |
| POST | /users | Admin | Create user |
| GET | /users/:id | Admin | Get user detail |
| PATCH | /users/:id | Admin | Update user fields |
| POST | /users/:id/suspend | Admin | Suspend user |
| POST | /users/:id/activate | Admin | Activate user |
| POST | /users/:id/reset-password | Admin | Admin-initiated password reset |
| GET | /users/me/profile | Auth | Get own profile |
| PATCH | /users/me/profile | Auth | Update own profile |
| PATCH | /users/me/password | Auth | Change own password |
| PATCH | /users/me/preferences | Auth | Update notification + theme prefs |

---

## Categories

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | /categories | Auth | List categories |
| POST | /categories | Admin | Create category |
| GET | /categories/:id | Auth | Get category detail |
| PATCH | /categories/:id | Admin | Update category |
| POST | /categories/:id/lead | Admin | Assign/replace primary lead |
| GET | /categories/:id/delegates | Lead/Admin | List delegates |
| POST | /categories/:id/delegates | Lead/Admin | Add delegate |
| GET | /categories/:id/delegates/:did | Lead/Admin | Get delegate detail |
| PATCH | /categories/:id/delegates/:did | Lead/Admin | Update delegate (permissions, dates) |
| POST | /categories/:id/delegates/:did/revoke | Lead/Admin | Revoke delegation |
| GET | /categories/:id/members | Lead/Admin | List category members |
| GET | /categories/:id/tasks | Lead/Auth | List category tasks |
| GET | /categories/:id/announcements | Lead/Member | List announcements |
| POST | /categories/:id/announcements | Lead | Create announcement |

---

## Projects

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | /projects | Auth | List projects (role-filtered) |
| POST | /projects | Lead/PM(canCreate)/Admin | Create project |
| GET | /projects/:id | Member/Lead/Admin | Get project detail |
| PATCH | /projects/:id | PM/Admin | Update project |
| POST | /projects/:id/state | PM/Admin | Transition project state |
| GET | /projects/:id/members | PM/Lead/Admin | List project members |
| POST | /projects/:id/members | PM/Admin | Add member (same-category direct) |
| DELETE | /projects/:id/members/:uid | PM/Admin | Remove member |
| POST | /projects/:id/members/:uid/revoke | Lead/PM/Admin | Revoke membership |
| POST | /projects/:id/members/:uid/renew | Requester/Admin | Propose renewal |
| GET | /projects/:id/tasks | Member/PM/Lead/Admin | List project tasks |
| GET | /projects/:id/milestones | Member | List milestones |
| POST | /projects/:id/milestones | PM/Admin | Create milestone |
| PATCH | /projects/:id/milestones/:mid | PM/Admin | Update milestone |
| GET | /projects/:id/discussions | Member | List discussions |
| POST | /projects/:id/discussions | Member | Post discussion |
| GET | /projects/:id/activity | PM/Lead/Admin | Activity timeline |

---

## Cross-Category Requests

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | /requests | Auth | List requests (role-filtered inbox/outbox) |
| POST | /requests | PM/Lead/Admin | Submit request |
| GET | /requests/:id | Parties/Admin | Get request detail |
| POST | /requests/:id/approve | Target Lead/Delegate/Admin | Approve |
| POST | /requests/:id/reject | Target Lead/Delegate/Admin | Reject (reason required) |
| POST | /requests/:id/cancel | Requester/Admin | Cancel (pending only) |
| POST | /requests/:id/renew | Requester/PM/Admin | Propose renewal |

---

## Tasks

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | /tasks | Auth | List tasks (role-filtered, scope-separated) |
| POST | /tasks | Lead/PM/Admin | Create task |
| GET | /tasks/:id | Authorized | Get task detail |
| PATCH | /tasks/:id | Lead/PM/Admin | Update task metadata |
| POST | /tasks/:id/assign | Lead/PM/Admin | Assign to user |
| POST | /tasks/:id/start | Assignee | Transition to in_progress |
| POST | /tasks/:id/block | Assignee/Lead/PM/Admin | Mark blocked |
| POST | /tasks/:id/unblock | Same | Unblock |
| POST | /tasks/:id/cancel | Lead/PM/Admin | Cancel |
| GET | /tasks/:id/submissions | Authorized | List submission versions |
| POST | /tasks/:id/submissions | Assignee | Submit (files + summary) |
| GET | /tasks/:id/submissions/:vid | Authorized | Get submission version detail |
| POST | /tasks/:id/review | Reviewer (not self) | Approve or request revision |
| GET | /tasks/:id/dependencies | Authorized | List dependencies |
| POST | /tasks/:id/dependencies | Lead/PM/Admin | Add dependency |
| DELETE | /tasks/:id/dependencies/:depId | Lead/PM/Admin | Remove dependency |
| GET | /tasks/:id/activity | Authorized | Task activity timeline |

---

## Memberships

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | /memberships | Auth | List memberships (role-filtered) |
| GET | /memberships/:id | Parties/Admin | Get membership detail |
| POST | /memberships/:id/renew | Requester/PM/Admin | Propose renewal |
| POST | /memberships/:id/revoke | Lead/PM/Admin | Revoke |

---

## Notifications

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | /notifications | Auth | List notifications (paginated) |
| POST | /notifications/read-all | Auth | Mark all as read |
| PATCH | /notifications/:id/read | Auth | Mark one as read |
| DELETE | /notifications/:id | Auth | Dismiss notification |

---

## Reports (Admin)

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | /reports/task-completion | Admin/Lead(view_reports) | Task completion + overdue rates |
| GET | /reports/project-progress | Admin | Project progress overview |
| GET | /reports/category-workload | Admin/Lead | Category workload distribution |
| GET | /reports/review-turnaround | Admin | Review turnaround times |
| GET | /reports/request-turnaround | Admin | Request approval turnaround |
| GET | /reports/memberships-expiring | Admin | Memberships expiring within window |
| GET | /reports/delegation-activity | Admin | Delegated approval activity |
| GET | /reports/:type/export | Admin | Download as CSV |

---

## Audit

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | /audit | Admin | List audit entries (filter: actor, action, resource, date) |
| GET | /audit/:id | Admin | Get single audit entry |

---

## Storage (File Uploads)

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | /storage/upload | Assignee | Multipart upload; returns file IDs |
| GET | /storage/:fileId/url | Authorized | Get time-limited signed download URL |

---

## Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | None | Liveness: returns 200 OK with service status |
| GET | /health/ready | None | Readiness: checks DB + Redis + MinIO |

---

## Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Missing or invalid access token |
| `FORBIDDEN` | 403 | Authenticated but insufficient permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Request body/params failed Zod validation |
| `CONFLICT` | 409 | Unique constraint violation (duplicate pending request, etc.) |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error (requestId in response for tracing) |
| `SELF_APPROVAL_BLOCKED` | 403 | Reviewer is same as assignee |
| `CONCURRENT_DECISION` | 409 | Request was already decided by another actor |
| `MEMBERSHIP_INACTIVE` | 403 | User's project membership is not currently active |
| `TASK_SCOPE_VIOLATION` | 422 | Task scope (category/project) mismatch |
| `DELEGATION_EXPIRED` | 403 | Delegate's authority has expired or been revoked |
| `CYCLE_DETECTED` | 422 | Task dependency would create a cycle |
