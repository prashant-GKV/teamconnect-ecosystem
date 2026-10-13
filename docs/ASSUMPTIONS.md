# TeamConnect — Assumptions & PRD Ambiguities

> Last updated: 2026-10-12  
> Owner: Engineering Lead  
> Status: Living document — updated at the start of each phase

---

## 1. Explicit Assumptions (PRD is silent, sensible defaults chosen)

| ID | Area | Assumption | Rationale |
|----|------|-----------|-----------|
| A-01 | Account types | "Contractor" behaves identically to "Employee" from a permission perspective unless PRD specifies otherwise. Contractors receive no Category Lead or PM authority by default. | PRD lists three account types without differentiating contractor permissions. |
| A-02 | Self-registration | Users cannot self-register. Only Org Admins / Super Admins create accounts. | PRD describes admin account creation; no public sign-up flow mentioned. |
| A-03 | Token lifetime | Access token TTL = 15 minutes; Refresh token TTL = 7 days with rotation. Refresh tokens stored as httpOnly cookies + server-side record for revocation. | PRD mandates JWT + httpOnly cookies + refresh rotation but gives no TTL values. |
| A-04 | Password policy | Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character. Argon2id hashing. | PRD says passwords are reset/changed but does not define strength policy. |
| A-05 | Rate limiting | Login: 5 attempts/15 min per IP+username, then 15-min lockout. Sensitive writes: 30 req/min. General: 300 req/min per user. | PRD mentions rate-limit error state without specifying limits. |
| A-06 | File uploads | Max 25 MB/file; max 10 files/submission. Accepted: PDF, DOCX, XLSX, PPTX, PNG, JPG, ZIP. Stored in private MinIO bucket tc-submissions. | PRD says multi-file upload with type/size validation, without limits. |
| A-07 | Signed URL TTL | Pre-signed MinIO download URLs expire after 1 hour. | PRD silent on S3 URL TTL. |
| A-08 | Notification delivery | In-app only (Phase 1-5). Email notifications are architected but stubbed (log-only) unless ENV provides SMTP config. | PRD describes notification types but not delivery channels. |
| A-09 | Delegation max | Maximum 3 simultaneous active delegates per category lead. | PRD describes delegation but not concurrency limits. |
| A-10 | Project member limit | No hard technical limit on project members, but UI warns at >50 members. | PRD is silent; practical guard-rail. |
| A-11 | Task dependency direction | Dependencies are directional (A blocks B). Cycles blocked at API level (DFS check before write). | PRD mentions dependencies + blocked indicator; cycle prevention assumed best practice. |
| A-12 | Audit log retention | Audit records are immutable and retained indefinitely. Actual deletion is a DBA manual step. | PRD mentions audit viewer + settings retention without specifying deletion. |
| A-13 | Timezone handling | All datetimes stored as UTC in MongoDB. Org-level timezone used ONLY for display in reports. API always returns ISO-8601 UTC. | PRD mentions org timezone in settings without specifying storage format. |
| A-14 | Soft deletes | Users and Categories are soft-deleted (isActive flag). Projects, Tasks, Memberships, Requests use status transitions. Audit records never deleted. | PRD describes suspend for users and archived for projects; full deletion not mentioned. |
| A-15 | Global search | Searches: task titles, project names, user names, category names. MongoDB Atlas full-text or regex fallback. | PRD mentions global search bar without specifying scope. |
| A-16 | Pagination defaults | Default page size = 20; max = 100. Cursor-based for feeds; page-number for tables. | PRD mandates pagination without defaults. |
| A-17 | Milestones | Milestones are metadata on a Project (name, targetDate, status). NOT tasks. Can be linked to tasks as context. | PRD mentions milestones in project wizard without clear definition. |
| A-18 | Workload % | The optional workload % in cross-category requests is informational only — no automated constraint check. | PRD includes it as a request field with no enforcement described. |
| A-19 | Project Reviewer | A Project Reviewer is a project member explicitly assigned the reviewer role by the PM. PM can also review tasks. | PRD says assigned PM or designated project reviewer without explaining how reviewers are designated. |
| A-20 | Delegation depth | Delegation is one level only — a delegate cannot sub-delegate. User cannot delegate to themselves. | PRD blocks circular delegation without defining depth. |
| A-21 | Renewal grace period | An expired membership with a pending renewal request does NOT re-grant access. Access resumes ONLY if renewal is approved AND new startAt <= now. | PRD explicitly says expired membership never regains access just because renewal is pending. |
| A-22 | Category Task reviewer fallback | If a category lead is vacant, no one can approve category tasks until admin assigns a new lead. | PRD clear on reviewer authority; silent on the vacancy case. |
| A-23 | Seed org name | Default seed org name is "Acme Corp" with realistic department categories. | PRD is silent on seed content specifics. |
| A-24 | canCreateProject flag | A boolean on the users PM role record set by admin, distinct from being assigned as PM on an existing project. | PRD says PM with creation permission — assumed to be a stored flag. |
| A-25 | Announcement scope | Announcements scoped to: category (by Lead), project (by PM), or global (by Org Admin/Super Admin). | PRD mentions announcements without scope definition. |

---

## 2. PRD Ambiguities (questions needing product clarification)

| ID | Section | Ambiguity | Decision taken |
|----|---------|-----------|---------------|
| Q-01 | Requests | Can the same user have overlapping approved memberships in the same project with different roles? | No — unique partial index enforces one active membership per (project, user). |
| Q-02 | Membership §10.5 | When a PM cross-category membership expires mid-sprint, what happens to tasks they own? | Tasks remain assigned; PM gets read-only access to those tasks; dashboard warning surfaces them. |
| Q-03 | Permissions §10 | Can a Category Lead be a member of their OWN category project? | Yes — same-category membership is a special case. No request required; admin or lead grants directly. |
| Q-04 | API §12.2 | Are there bulk endpoints (e.g., bulk assign tasks)? | No bulk endpoints in Phase 1-5. Single-resource operations only. |
| Q-05 | Projects §5 | Can a project span multiple origin categories? | No. A project has exactly one origin category. |
| Q-06 | Tasks §6 | Can a task be re-assigned after Submitted for Review? | No re-assignment once submitted. Revision Requested returns it to In Progress. |
| Q-07 | Delegation §8 | What permissions can be in the delegate allowlist? | Allowlist: review_task, approve_request, manage_category_tasks, view_reports. |
| Q-08 | Users §4 | Can a user hold both Employee + Contractor account types? | No — accountType is a single enum per user. |
| Q-09 | Notifications §11 | Are in-app notifications real-time or poll-based? | Phase 1-5: poll-based (30s interval via TanStack Query). Phase 6: SSE upgrade. |
| Q-10 | API §12 | API version path /api/v1 or /v1? | /api/v1 as specified in the prompt. |

---

## 3. Out of Scope

- OAuth / SSO (SAML, Google Workspace)
- Multi-tenancy / multi-org
- Mobile native apps
- Billing / subscription
- Real-time collaboration (simultaneous editing)
- AI-generated content or ML features
- Offline-first (offline banner shown; no service worker data sync)
