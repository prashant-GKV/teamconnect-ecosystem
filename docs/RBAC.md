# TeamConnect — RBAC Matrix

> This document is the authoritative reference for role-based access control.
> The BACKEND is the enforcement authority. Frontend gates are UX conveniences only.

---

## Role Taxonomy

```
Super Admin          — full platform control, cross-org
Org Admin            — full org control, no code/infra access
Category Lead        — primary lead of exactly one category (enforced)
Category Delegate    — scoped delegate for a specific category lead, time-limited, permission-allowlisted
Project Manager      — assigned to one or more projects; optional canCreateProject flag
Project Reviewer     — designated by PM within a project for task review
Employee             — standard account type; can hold any of the above roles
Intern               — standard account type; same permissions as Employee once a role is held
Contractor           — standard account type; same permissions as Employee once a role is held
                       (no Lead or PM authority by default; admin can grant)
```

---

## 1. User Management

| Action | Super Admin | Org Admin | Category Lead | Delegate | PM | Employee/Intern/Contractor |
|--------|:-----------:|:---------:|:-------------:|:--------:|:--:|:------------------------:|
| Create user | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| View own profile | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Edit own profile (name, prefs) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Change own password | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View any user profile | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Edit any user (name, email, type) | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Activate / Suspend user | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Assign roles | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Initiate password reset (admin) | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| View user activity | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |

---

## 2. Category Management

| Action | Super Admin | Org Admin | Category Lead (own) | Delegate (allowlisted) | PM | Others |
|--------|:-----------:|:---------:|:-------------------:|:---------------------:|:--:|:------:|
| Create category | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Edit category details | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Assign primary lead | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| View category workspace | ✓ | ✓ | ✓ (own) | ✓ (own) | ✗ | ✗ |
| View own category members | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Post announcement to category | ✓ | ✓ | ✓ (own) | if manage_category_tasks | ✗ | ✗ |
| Add delegate | ✓ | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| Edit/revoke delegate | ✓ | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| View delegates | ✓ | ✓ | ✓ (own) | ✓ (read-only, own) | ✗ | ✗ |

---

## 3. Project Management

| Action | Super Admin | Org Admin | Category Lead | PM (own project) | Project Member | Others |
|--------|:-----------:|:---------:|:-------------:|:----------------:|:--------------:|:------:|
| Create project | ✓ | ✓ | ✓ (own cat) | if canCreateProject | ✗ | ✗ |
| Edit project details | ✓ | ✓ | ✓ (origin cat) | ✓ | ✗ | ✗ |
| Transition project state | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Archive project | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| View project overview | ✓ | ✓ | ✓ (origin) | ✓ | ✓ (active mbr) | ✗ |
| View project members list | ✓ | ✓ | ✓ (origin) | ✓ | ✓ (active mbr) | ✗ |
| Manage project members | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Assign Project Reviewer | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| View project tasks | ✓ | ✓ | ✓ (origin) | ✓ | ✓ (active mbr) | ✗ |
| Create project task | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| View project discussions | ✓ | ✓ | ✓ (origin) | ✓ | ✓ (active mbr) | ✗ |
| Post project discussion | ✗ | ✗ | ✗ | ✓ | ✓ (active mbr) | ✗ |

---

## 4. Cross-Category Requests

| Action | Super Admin | Org Admin | Category Lead (TARGET) | Delegate (approve_request) | Requester | Others |
|--------|:-----------:|:---------:|:---------------------:|:--------------------------:|:---------:|:------:|
| Submit request | ✓ | ✓ | ✓ | ✓ | ✓ (PM/Lead) | ✗ |
| Approve request | ✓ | ✓ | ✓ (target cat) | ✓ (target cat, active) | ✗ | ✗ |
| Reject request | ✓ | ✓ | ✓ (target cat) | ✓ (target cat, active) | ✗ | ✗ |
| Cancel request | ✓ | ✓ | ✗ | ✗ | ✓ (own, pending only) | ✗ |
| View request detail | ✓ | ✓ | ✓ (target cat) | ✓ (target cat) | ✓ (own) | ✗ |
| Propose renewal | ✓ | ✓ | ✗ | ✗ | ✓ (own mbr) | PM of project |
| Revoke membership | ✓ | ✓ | ✓ (target cat) | ✗ | ✗ | PM of project |

---

## 5. Task Management

| Action | Super Admin | Org Admin | Category Lead (scope) | Delegate (manage_category_tasks) | PM (scope) | Assignee | Others |
|--------|:-----------:|:---------:|:--------------------:|:--------------------------------:|:----------:|:--------:|:------:|
| Create category task | ✓ | ✓ | ✓ (own cat) | ✓ | ✗ | ✗ | ✗ |
| Create project task | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| Assign task | ✓ | ✓ | ✓ (cat scope) | ✓ (cat scope) | ✓ (proj scope) | ✗ | ✗ |
| View own assigned task | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Edit task (before submit) | ✓ | ✓ | ✓ (cat scope) | ✓ (cat scope) | ✓ (proj scope) | ✓ (own, In Progress) | ✗ |
| Submit task | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ (own, In Progress) | ✗ |
| Request revision | ✓ | ✓ | ✓ (cat scope, review_task) | ✓ (review_task) | ✓ (proj scope) | ✗ | ✗ |
| Approve task | ✓ | ✓ | ✓ (cat scope, review_task, not self) | ✓ (review_task, not self) | ✓ (proj scope, not self) | ✗ | ✗ |
| Block / Cancel task | ✓ | ✓ | ✓ (cat scope) | ✓ (cat scope) | ✓ (proj scope) | ✗ | ✗ |
| View task history | ✓ | ✓ | ✓ (scope) | ✓ (scope) | ✓ (scope) | ✓ (own) | ✗ |

**Self-approval rule:** The reviewer performing approval must NOT be the same user as the task assignee. Enforced at API level.

---

## 6. Delegation Permission Allowlist

A delegate can be granted any subset of the following permissions by the primary lead:

| Permission Key | What it allows |
|----------------|----------------|
| `review_task` | Approve/reject/request revision on category tasks (replaces lead for review) |
| `approve_request` | Approve/reject cross-category membership requests (for target category) |
| `manage_category_tasks` | Create, assign, and edit category tasks |
| `view_reports` | Access category-level reports in admin panel |

---

## 7. Admin Panel

| Action | Super Admin | Org Admin |
|--------|:-----------:|:---------:|
| Full platform settings | ✓ | ✓ (partial) |
| View/edit any entity | ✓ | ✓ |
| Audit log viewer | ✓ | ✓ |
| Reports (all categories) | ✓ | ✓ |
| Delete (soft) any entity | ✓ | ✓ |
| Create/manage admins | ✓ | ✗ |
| System config (infra) | ✓ | ✗ |

---

## 8. Self-Escalation Prevention

- A user cannot delegate to themselves
- A user cannot approve their own requests (they submitted)
- A user cannot approve their own tasks (they are assigned)
- A delegate cannot grant themselves additional permissions
- A Category Lead cannot be their own delegate (circular)
- Admin actions on self-account require Super Admin confirmation
