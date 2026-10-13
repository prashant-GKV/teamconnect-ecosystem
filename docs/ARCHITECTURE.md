# TeamConnect — Architecture Document

> Version: 1.0  
> Phase: 0 (plan)  
> Last updated: 2026-10-12

---

## 1. System Overview

TeamConnect is a monorepo organizational operations platform consisting of three top-level applications sharing one backend, hosted under a single Docker Compose stack with Nginx as the reverse proxy.

```
Browser (User)  ──┐
Browser (Admin) ──┼──► Nginx ──► teamconnect-frontend (Next.js :3000)
                  │           └── teamconnect-admin    (Next.js :3001)
                  └──────────────► teamconnect-backend  (Express  :4000)
                                       │
                              ┌────────┼────────┐
                           MongoDB  Redis    MinIO
                           :27017  :6379    :9000
```

---

## 2. Repository Layout

```
/srv/teamconnect/                        ← monorepo root (pnpm workspaces)
├── package.json                         ← root scripts + workspace config
├── pnpm-workspace.yaml
├── tsconfig.base.json                   ← shared TS config
├── .env.example
├── README.md
│
├── teamconnect-backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts                       ← Express app factory
│       ├── server.ts                    ← HTTP server bootstrap
│       ├── config/
│       │   ├── env.ts                   ← Zod-validated env vars
│       │   ├── db.ts                    ← Mongoose connection
│       │   ├── redis.ts                 ← IORedis connection
│       │   └── storage.ts              ← MinIO client
│       ├── middlewares/
│       │   ├── authenticate.ts          ← JWT verify + user attach
│       │   ├── authorize.ts             ← Role + scope permission check
│       │   ├── rateLimiter.ts
│       │   ├── errorHandler.ts          ← Global error → {code,message,requestId}
│       │   ├── requestId.ts
│       │   └── validate.ts              ← Zod body/query/param validation
│       ├── shared/
│       │   ├── errors.ts               ← AppError hierarchy
│       │   ├── logger.ts               ← Pino logger
│       │   ├── pagination.ts
│       │   ├── response.ts             ← Envelope helpers
│       │   └── crypto.ts               ← argon2 helpers
│       └── modules/
│           ├── auth/                   ← login, refresh, logout, reset
│           ├── users/                  ← CRUD, roles, profile
│           ├── categories/             ← CRUD, lead assignment, delegates
│           ├── projects/               ← CRUD, state transitions, members
│           ├── requests/               ← submit, approve, reject, cancel
│           ├── tasks/                  ← CRUD, assign, transitions, dependencies
│           ├── submissions/            ← file upload, versioning, review
│           ├── communications/         ← announcements, discussions, remarks
│           ├── notifications/          ← in-app, worker-triggered
│           ├── audit/                  ← immutable log writer + reader
│           └── reports/               ← aggregations, exports
│
├── teamconnect-frontend/
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── src/
│       ├── app/                        ← Next.js App Router pages
│       │   ├── layout.tsx              ← root layout (fonts, providers)
│       │   ├── loading.tsx
│       │   ├── error.tsx
│       │   ├── not-found.tsx
│       │   ├── (auth)/                 ← login, forgot, reset
│       │   ├── dashboard/
│       │   ├── tasks/
│       │   ├── projects/
│       │   ├── category/
│       │   ├── requests/
│       │   ├── notifications/
│       │   ├── memberships/
│       │   ├── reviews/
│       │   └── profile/
│       ├── components/
│       │   ├── ui/                     ← atomic design-system components
│       │   └── shared/                 ← composed shared components
│       ├── features/                   ← feature-sliced modules
│       │   └── [feature]/
│       │       ├── components/
│       │       ├── hooks/
│       │       ├── api.ts
│       │       ├── types.ts
│       │       ├── schemas.ts
│       │       └── index.ts
│       ├── hooks/                      ← global custom hooks
│       └── lib/
│           ├── api.ts                  ← typed fetch wrapper
│           ├── auth.ts
│           ├── permissions.ts
│           ├── dates.ts
│           └── env.ts
│
├── teamconnect-admin/                  ← same structure as frontend
│
├── packages/
│   ├── shared-types/                   ← TypeScript interfaces + enums
│   ├── api-contracts/                  ← endpoint definitions + response shapes
│   ├── validation/                     ← Zod schemas (shared with backend)
│   └── shared-config/                  ← constants (pagination, limits, etc.)
│
├── containers/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── nginx/
│       ├── nginx.conf
│       └── sites/
│           ├── frontend.conf
│           └── admin.conf
│
├── docs/
│   ├── ARCHITECTURE.md                 ← this file
│   ├── RBAC.md
│   ├── STATE_MACHINES.md
│   ├── API.md
│   └── ASSUMPTIONS.md
│
└── scripts/
    ├── seed.ts                         ← database seeder
    ├── backup.sh                       ← MongoDB + MinIO backup
    └── restore.sh
```

---

## 3. Data Model

### Collections Overview

```
users              ← identity + account type + roles
categories         ← org categories; 1 primary lead each
categoryDelegates  ← time-limited scoped delegates per category
projects           ← project records + PM + origin category
projectMembers     ← cross-category memberships + validity interval
requests           ← cross-category membership requests (source of truth)
tasks              ← category tasks AND project tasks (scope field)
submissions        ← versioned task submissions + file refs
reviews            ← review decisions per submission version
communications     ← announcements + discussions + remarks
notifications      ← in-app notification records
auditLogs          ← immutable actor-action-resource records
reports            ← cached/exported report metadata
refreshTokens      ← JWT refresh token records (for revocation)
```

### Key Indexes (invariants)

```javascript
// One primary lead per active category
categories: unique on { lead: 1 } where isActive = true

// One pending request per (project, targetUser)
requests: unique partial on { project: 1, targetUser: 1 } where status = "pending"

// One active membership per (project, user)
projectMembers: unique partial on { project: 1, user: 1 } where status = "active"

// Task scope immutability enforced in app layer; categoryId XOR projectId

// Audit log: no unique indexes (append-only)
```

### Entity Relationship (text form)

```
User ──< CategoryDelegate >── Category
User ──< ProjectMember    >── Project
User ──< Task (assignee)
User ──< Submission (submitter)
User ──< Request (requester + targetUser)

Category ──< Task (category tasks)
Category ──< Project (origin category)
Category ──< CategoryDelegate

Project ──< Task (project tasks)
Project ──< ProjectMember
Project ──< Request

Task ──< Submission ──< Review
Task ──< Task (dependencies, DAG)
```

---

## 4. Authentication Flow

```
1. POST /api/v1/auth/login
   → Verify password (argon2)
   → Issue accessToken (JWT, 15min, in-memory)
   → Issue refreshToken (JWT, 7d, httpOnly cookie)
   → Store refreshToken hash in refreshTokens collection

2. Client sends accessToken in Authorization: Bearer header

3. On 401, client auto-calls POST /api/v1/auth/refresh
   → Verify refreshToken cookie
   → Rotate: delete old, issue new accessToken + refreshToken

4. POST /api/v1/auth/logout
   → Delete refreshToken record (revoke)
   → Clear cookie
```

---

## 5. Authorization Middleware Chain

Every protected endpoint runs this chain:

```
authenticate          ← verify JWT, attach req.user
resolvePermissions    ← load user's category roles, delegation status,
                        project memberships (validity check), admin roles
resourcePolicyCheck   ← resource-specific guard using resolved permissions
```

Membership validity check in resolvePermissions:
```typescript
const isMemberActive = (m: ProjectMember) =>
  m.startAt <= new Date() &&
  m.endAt > new Date() &&
  m.status !== 'revoked';
```

---

## 6. Background Worker (BullMQ)

Queue: `tc-jobs` in Redis

| Job | Trigger | Action |
|-----|---------|--------|
| `membership:check-expiry` | Cron: every hour | Transitions active → expiring_soon → expired |
| `membership:send-reminder` | After expiry check | Creates notifications, deduped by dedupe key |
| `delegation:check-expiry` | Cron: every hour | Expires active delegations past effectiveTo |
| `task:overdue-check` | Cron: daily 06:00 | Flags overdue tasks; notifies leads/PMs |
| `report:snapshot` | Cron: daily 00:00 | Caches report aggregations |

All jobs are idempotent. Each run is atomic: job either fully completes or rolls back.

---

## 7. API Response Envelope

All API responses use this envelope:

```typescript
// Success
{
  "success": true,
  "data": T,
  "meta": { "page": 1, "total": 120, "requestId": "req_..." }  // optional
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [...],   // field-level for validation errors
    "requestId": "req_..."
  }
}
```

---

## 8. Frontend Architecture

### Data Fetching Pattern

```
Page Server Component
  └── Client Component (with Suspense boundary)
        └── TanStack Query (useQuery / useMutation)
              └── API Client (lib/api.ts)
                    └── fetch (with auth interceptor, idempotency key, requestId)
```

### State Management

- **Server state:** TanStack Query (fetch, cache, refetch, optimistic updates)
- **UI state:** Zustand (sidebar open/closed, theme, selected rows, modal state)
- **Form state:** React Hook Form + Zod
- **URL state:** Next.js searchParams (filters, page, sort — persisted across refresh)

### Mock API Layer (Phase 1-5)

```
USE_MOCKS=true  → MSW service worker intercepts all /api/v1/* requests
USE_MOCKS=false → Requests go to NEXT_PUBLIC_API_BASE_URL
```

The mock handler file `src/lib/mocks/handlers.ts` implements every endpoint 
with realistic seed data and proper status codes.

---

## 9. Design System Tokens

See tailwind.config.ts for full token set. Key tokens:

```css
/* Primary */
--color-primary: 243 75% 59%;      /* indigo-600 #4F46E5 */
--color-primary-hover: 243 75% 49%;

/* Accent */
--color-accent: 174 72% 40%;       /* teal-500 #14B8A6 */

/* Scope colors */
--color-scope-category: 262 83% 58%; /* violet */
--color-scope-project:  221 83% 53%; /* blue   */

/* App backgrounds */
--color-bg: 210 40% 98%;           /* light: slate-50 */
--color-bg-dark: 225 35% 9%;       /* dark: #0B1020 */

/* Card */
--color-card: 0 0% 100%;           /* white */
--color-card-dark: 226 37% 15%;    /* #121936 */
```

---

## 10. Phase Delivery Plan

| Phase | Focus | Key Deliverables |
|-------|-------|-----------------|
| **0** | Plan | This document, RBAC, state machines, assumptions |
| **1** | Foundation | Monorepo, packages, design system, mock layer, component library |
| **2** | Auth + Org | Login flows, admin users, categories, delegation, backend auth |
| **3** | Projects + Requests | Project wizard, workspace, cross-category requests, membership lifecycle |
| **4** | Tasks | Dual-scope task engine, board, detail, dependencies |
| **5** | Submissions + Review | File upload, review flows, notifications, audit |
| **6** | Oversight + Production | Reports, E2E tests, Docker prod, final docs |

Each phase leaves the project runnable. Backend and frontend are built in parallel within each phase.
