# TeamConnect Ecosystem

[![CI/CD Pipeline](https://github.com/prashant-GKV/teamconnect-ecosystem/actions/workflows/ci.yml/badge.svg)](https://github.com/prashant-GKV/teamconnect-ecosystem/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm Version](https://img.shields.io/badge/pnpm-%3E%3D9.0.0-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%205.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Enterprise Operations Platform** — Unifying functional department workflows, cross-project talent governance, time-bound memberships, and auditable task delivery in a decoupled TypeScript monorepo.

---

## 🌐 Live Deployments

| Component            | Status  | Production Endpoint                                                                    | Description                                                                    |
| :------------------- | :-----: | :------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| **Backend REST API** | 🟢 Live | [teamconnect-backend-4q77.onrender.com](https://teamconnect-backend-4q77.onrender.com) | Express REST API gateway, health probes (`/api/v1/health`), and root status    |
| **User Workspace**   | 🟢 Live | [teamconnect-frontend.vercel.app](https://vercel.com)                                  | Next.js 14 App Router portal for Employees, Category Leads, PMs, and Reviewers |
| **Admin Governance** | 🟢 Live | [teamconnect-admin.vercel.app](https://vercel.com)                                     | Next.js 14 App Router governance panel for Super Admins and Org Admins         |

---

## 📑 Table of Contents

- [Overview & Problem Statement](#-overview--problem-statement)
- [System Architecture](#-system-architecture)
- [Monorepo Workspace Structure](#-monorepo-workspace-structure)
- [Core Invariants & Capabilities](#-core-invariants--capabilities)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [State Machines & Lifecycles](#-state-machines--lifecycles)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start Guide](#-quick-start-guide)
- [Available Scripts](#-available-scripts)
- [REST API Reference](#-rest-api-reference)
- [Environment Configuration](#-environment-configuration)
- [Quality Assurance & CI/CD](#-quality-assurance--cicd)
- [Project Documentation](#-project-documentation)
- [Contributing & License](#-contributing--license)

---

## 💡 Overview & Problem Statement

Modern matrix organizations face a persistent operational challenge: **the tension between functional departments and cross-functional project teams**.

1. **Dual-Mandate Friction**: Employees belong to a functional category (Engineering, Design, QA, Legal) but are frequently borrowed by Project Managers for sprint-based initiatives.
2. **Missing Review Gates**: Work submitted across teams often lacks formal acceptance criteria, leading to untracked deliverables and informal sign-offs in chat channels.
3. **Ghost Memberships**: Talent borrowed for a 4-week initiative often retains access or sits in limbo indefinitely without clear expiration boundaries.
4. **Audit Deficits**: Changes to permissions, delegations, task approvals, and membership revocations rarely produce an immutable audit trail.

**TeamConnect** solves these governance breakdowns with:

- **Strict Scope Separation**: Hard database-level and policy-level isolation between Category Tasks and Project Tasks.
- **Mandatory Review Authority**: Deliverable submission is required prior to review, and **self-approval is strictly forbidden**.
- **Structured Resource Requests**: Formal request-and-approval workflows for borrowing talent across categories with date windows and weekly hour caps.
- **Time-Bound Memberships**: Lifecycle automation (`ApprovedNotYetActive` ➔ `Active` ➔ `ExpiringSoon` ➔ `Expired`) governed by background worker jobs.
- **Tamper-Evident Audit Logging**: Every critical lifecycle transition and administrative action is permanently recorded.

---

## 🏛️ System Architecture

The platform is designed around a clean three-tier architecture with zero client-server contract drift:

```
                          ┌────────────────────────┐
                          │     Web Browsers       │
                          └───────────┬────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 │                                         │
        (Port 3000)                               (Port 3001)
┌───────────────────────────────┐         ┌───────────────────────────────┐
│     teamconnect-frontend      │         │       teamconnect-admin       │
│  Next.js 14 (App Router)      │         │   Next.js 14 (App Router)     │
│  Tailwind CSS + shadcn/ui     │         │   Tailwind CSS + Radix + Charts│
│  TanStack Query v5 + MSW Mock │         │   Multi-tenant Org Control    │
└───────────────┬───────────────┘         └───────────────┬───────────────┘
                │                                         │
                └────────────────────┬────────────────────┘
                                     │ JSON / HTTPS
                                     ▼
                ┌─────────────────────────────────────────┐
                │          teamconnect-backend            │
                │        Express + Node.js (TS)           │
                │        (Port 4000 / /api/v1)            │
                ├─────────────────────────────────────────┤
                │  • JWT Auth & Refresh Cookie Rotation   │
                │  • RBAC & Delegation Policy Engine      │
                │  • Zod Contract Validation              │
                │  • Pino Structured Audit Logger         │
                └───────┬─────────────┬─────────────┬─────┘
                        │             │             │
        ┌───────────────┘             │             └───────────────┐
        ▼                             ▼                             ▼
┌───────────────┐             ┌───────────────┐             ┌───────────────┐
│    MongoDB    │             │ Redis + BullMQ│             │ MinIO / S3    │
│  Mongoose 8   │             │ Job Workers   │             │ Object Store  │
│  (Port 27017) │             │ (Port 6379)   │             │ (Port 9000)   │
└───────────────┘             └───────────────┘             └───────────────┘
```

---

## 📦 Monorepo Workspace Structure

Managed via `pnpm` workspaces with TypeScript project references:

```
teamconnect-ecosystem/
├── .github/
│   └── workflows/ci.yml         # Monorepo CI: Lint, Typecheck, Vitest, Build
├── containers/
│   ├── docker-compose.yml       # Local dev infra (MongoDB, Redis, MinIO)
│   ├── docker-compose.prod.yml  # Production multi-container composition
│   └── nginx/                   # Nginx reverse proxy configuration
├── docs/                        # Architecture and policy specifications
│   ├── API.md                   # Complete REST API endpoint reference
│   ├── ARCHITECTURE.md          # Monorepo blueprint and data flow
│   ├── ASSUMPTIONS.md           # Business rules and PRD ambiguity resolutions
│   ├── RBAC.md                  # Role-Based Access Control matrix
│   └── STATE_MACHINES.md        # State transitions and invariants
├── packages/                    # Shared workspace libraries
│   ├── api-contracts/           # HTTP schemas, request/response DTOs
│   ├── shared-config/           # Environment parsing, constants
│   ├── shared-types/            # Canonical domain models, roles, enums
│   └── validation/              # Shared Zod validation schemas
├── teamconnect-admin/           # Super Admin & Org Admin portal (:3001)
├── teamconnect-backend/         # Express REST API engine (:4000)
├── teamconnect-frontend/        # Employee / Lead / PM user application (:3000)
├── scripts/
│   └── dev.js                   # Orchestrates zero-conflict multi-service startup
├── render.yaml                  # Zero-config Render backend deployment spec
├── package.json                 # Workspace root scripts and devDependencies
├── pnpm-workspace.yaml          # Monorepo package boundaries
└── tsconfig.base.json           # Shared strict TypeScript compiler rules
```

---

## ⚡ Core Invariants & Capabilities

### 1. Dual-Scope Task Separation

Tasks are strictly categorized into one of two mutually exclusive scopes:

- **Category Tasks**: Internal departmental operations (e.g., Design System maintenance, Backend bug triage). Managed by Category Leads and Delegates.
- **Project Tasks**: Cross-functional initiative deliverables. Managed by Project Managers and designated Reviewers.
- _Invariant_: A task must reference either a `categoryId` OR a `projectId` — never both, and never neither.

### 2. Scope-Aware Review Authority & Anti-Self-Approval

- Work is not marked complete until a deliverable (file, URL, or notes) is formally submitted.
- Reviews can result in **Approved** or **Revision Requested** (with mandatory feedback remarks).
- _Invariant_: **Self-approval is blocked at the backend policy layer**:
  $$\text{Reviewer ID} \neq \text{Assignee ID}$$

### 3. Cross-Category Resource Borrowing

- Project Managers submit borrowing requests specifying talent role, date window, and weekly hour commitments.
- Category Leads evaluate the request based on department capacity and approve or reject it.
- Upon approval, a project membership is provisioned automatically.

### 4. Time-Bound Membership Lifecycle

- Project memberships carry strict `startAt` and `endAt` dates.
- Automated Redis + BullMQ workers evaluate memberships daily:
  - `ApprovedNotYetActive`: Provisioned for a future date.
  - `Active`: Currently within the valid date window.
  - `ExpiringSoon`: Within 7 days of expiration (triggers alerts).
  - `Expired`: Automatically deactivated upon reaching `endAt`.
  - `Revoked`: Manually terminated early by an authorized administrator.

### 5. Multi-Mode Frontend Execution

The user frontend supports two modes:

- **Live Mode** (`USE_MOCKS=false`): Communicates with the live Express backend.
- **Autonomous Mock Mode** (`USE_MOCKS=true`): Runs with Mock Service Worker (MSW) for rapid UI iteration, demo environments, or offline development.

---

## 🛡️ Role-Based Access Control (RBAC)

| Role                               | Scope               | Key Permissions                                                                |
| :--------------------------------- | :------------------ | :----------------------------------------------------------------------------- |
| **Super Admin**                    | Platform-Wide       | Full tenant management, audit logs, system-level configurations                |
| **Org Admin**                      | Organization        | User management, category creation, role assignments, reports                  |
| **Category Lead**                  | Own Category        | Assign category tasks, manage delegates, approve/reject borrowing requests     |
| **Category Delegate**              | Scoped Category     | Time-limited subset of Lead permissions (delegated tasks, reviews)             |
| **Project Manager**                | Assigned Projects   | Create project tasks, request cross-category talent, assign deliverables       |
| **Project Reviewer**               | Assigned Projects   | Review and approve/reject deliverables submitted by project members            |
| **Employee / Intern / Contractor** | Personal / Assigned | Execute assigned tasks, upload deliverables, view dashboards and notifications |

_For the complete granular permission matrix, see [docs/RBAC.md](docs/RBAC.md)._

---

## 🔄 State Machines & Lifecycles

### Task State Machine

```
[draft] ──(assign)──► [assigned] ──(start)──► [in_progress]
                                                    │
                                             (submit deliverable)
                                                    ▼
[approved] ◄──(approve)── [submitted_for_review] ──(request revision)──► [revision_requested]
                                                                                │
                                                                         (resume work)
                                                                                ▼
                                                                          [in_progress]
```

_(Tasks may also transition to `blocked` or `cancelled` with documented justification)._

### Resource Request Lifecycle

```
[submitted] ──► [under_review] ──► [approved] ──► [active] ──► [completed]
                                 └──► [rejected]           └──► [cancelled]
```

_For formal state transition tables and mermaid diagrams, see [docs/STATE_MACHINES.md](docs/STATE_MACHINES.md)._

---

## 🛠️ Tech Stack

### Frontend & Admin Applications

- **Framework**: Next.js 14 (App Router, Server & Client Components)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS, PostCSS, `next-themes` (Dark/Light themes)
- **UI Components**: shadcn/ui primitives, Radix UI, Lucide Icons, Recharts
- **State & Data**: TanStack Query v5, Zustand, React Hook Form, Zod
- **Mocking**: Mock Service Worker (MSW v2)

### Backend API Core

- **Runtime**: Node.js 20+ & Express 4
- **Language**: TypeScript bundled via `esbuild`
- **Database**: MongoDB 7.0 via Mongoose 8
- **Caching & Queues**: Redis 7.2 & BullMQ 5
- **Object Storage**: MinIO / S3-compatible storage with signed URLs
- **Security**: Argon2 password hashing, JWT with refresh token rotation, Helmet, Express Rate Limit, CORS
- **Observability**: Pino structured HTTP logger

### Developer Tooling & DevOps

- **Package Manager**: pnpm 9+ / 12+ (workspaces)
- **Containerization**: Docker & Docker Compose
- **Quality**: Vitest, `@testing-library/jest-dom`, ESLint, Prettier
- **CI/CD**: GitHub Actions

---

## 📋 Prerequisites

Ensure your development environment meets the following minimum requirements:

- **Node.js**: `>= 20.0.0`
- **pnpm**: `>= 9.0.0` (Install via `npm install -g pnpm@latest`)
- **Docker & Docker Compose**: Required for local MongoDB, Redis, and MinIO instances
- **Git**

---

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/prashant-GKV/teamconnect-ecosystem.git
cd teamconnect-ecosystem
```

### 2. Start Infrastructure Containers

Launch MongoDB, Redis, and MinIO in the background:

```bash
pnpm docker:up
```

### 3. Configure Environment Variables

Copy the template configuration:

```bash
cp .env.example .env
```

_(The default values in `.env.example` work out-of-the-box for local Docker containers)._

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Start the Development Ecosystem

Run all services concurrently using the built-in orchestrator:

```bash
pnpm dev
```

The script verifies and frees ports automatically, launching:

- **Backend API**: `http://localhost:4000`
- **User Portal**: `http://localhost:3000`
- **Admin Portal**: `http://localhost:3001`

_(To run individual services independently: `pnpm dev:backend`, `pnpm dev:frontend`, or `pnpm dev:admin`)._

---

## 📜 Available Scripts

| Command             | Purpose                                                               |
| :------------------ | :-------------------------------------------------------------------- |
| `pnpm dev`          | Starts Backend, Frontend, and Admin concurrently with unified logging |
| `pnpm dev:backend`  | Starts only the Express API with `tsx watch`                          |
| `pnpm dev:frontend` | Starts only the Next.js user workspace (`:3000`)                      |
| `pnpm dev:admin`    | Starts only the Next.js admin governance portal (`:3001`)             |
| `pnpm build`        | Compiles all packages and applications for production                 |
| `pnpm typecheck`    | Runs strict TypeScript type-checking across all workspaces            |
| `pnpm lint`         | Runs ESLint across all workspaces                                     |
| `pnpm test`         | Executes all Vitest test suites across the monorepo                   |
| `pnpm format`       | Formats all codebase files using Prettier                             |
| `pnpm docker:up`    | Boots MongoDB, Redis, and MinIO via Docker Compose                    |
| `pnpm docker:down`  | Gracefully terminates Docker Compose containers                       |

---

## 🔌 REST API Reference

The backend exposes a structured REST API under the `/api/v1` namespace. All responses follow a standardized JSON envelope:

```json
{
  "success": true,
  "data": { ... },
  "meta": { "requestId": "uuid", "timestamp": "ISO-8601" }
}
```

### Primary Endpoints Overview

| Module            | Route Prefix               | Description                                                        |
| :---------------- | :------------------------- | :----------------------------------------------------------------- |
| **Health**        | `GET /api/v1/health`       | Comprehensive system health check and uptime probe                 |
| **Auth**          | `/api/v1/auth`             | Login, logout, refresh tokens, password reset, `/me` profile       |
| **Users**         | `/api/v1/users`            | User CRUD, profile settings, account activation/suspension         |
| **Categories**    | `/api/v1/categories`       | Department management, lead assignment, delegation rules           |
| **Projects**      | `/api/v1/projects`         | Project workspaces, milestone tracking, project teams              |
| **Requests**      | `/api/v1/requests`         | Cross-category talent requests, approval/rejection review          |
| **Memberships**   | `/api/v1/memberships`      | Time-bound memberships, lifecycle management, renewals             |
| **Tasks**         | `/api/v1/tasks`            | Dual-scope tasks, Kanban transitions, dependency graph             |
| **Submissions**   | `/api/v1/tasks/:id/submit` | Deliverable file uploads, versioning, review verdicts              |
| **Notifications** | `/api/v1/notifications`    | In-app user notifications, unread count, read states               |
| **Audit**         | `/api/v1/audit`            | Immutable audit trail query and inspection                         |
| **Reports**       | `/api/v1/reports`          | Organizational velocity, task completion, and resource utilization |
| **Storage**       | `/api/v1/storage`          | Presigned S3/MinIO upload and download URL generation              |

_For complete endpoint specifications with parameter tables, see [docs/API.md](docs/API.md)._

---

## ⚙️ Environment Configuration

| Variable                   | Default (Dev)                           | Description                                                |
| :------------------------- | :-------------------------------------- | :--------------------------------------------------------- |
| `PORT`                     | `4000`                                  | Backend HTTP listening port                                |
| `NODE_ENV`                 | `development`                           | Runtime environment (`development`, `production`, `test`)  |
| `MONGODB_URI`              | `mongodb://localhost:27017/teamconnect` | MongoDB connection string                                  |
| `REDIS_URL`                | `redis://localhost:6379`                | Redis connection URL                                       |
| `JWT_ACCESS_SECRET`        | _(Random 32+ char secret)_              | HMAC key for short-lived access tokens (15m)               |
| `JWT_REFRESH_SECRET`       | _(Random 32+ char secret)_              | HMAC key for long-lived refresh tokens (7d)                |
| `MINIO_ENDPOINT`           | `localhost`                             | MinIO / S3 host endpoint                                   |
| `MINIO_PORT`               | `9000`                                  | MinIO S3 API port                                          |
| `MINIO_BUCKET`             | `tc-submissions`                        | S3 bucket for task deliverable attachments                 |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:4000/api/v1`          | Frontend API target endpoint                               |
| `USE_MOCKS`                | `false`                                 | When `true`, frontend utilizes MSW instead of live backend |

_See [.env.example](.env.example) for the complete reference._

---

## 🧪 Quality Assurance & CI/CD

Code quality and system stability are enforced through automated checks:

- **Strict Type Safety**: Monorepo-wide strict TypeScript compiler checks (`pnpm typecheck`).
- **ESLint & Prettier**: Automated linting and style enforcement (`pnpm lint`).
- **Vitest Test Suites**: Unit and integration test suites validating state machines, invariants, and permissions (`pnpm test`).
- **GitHub Actions Pipeline**: Runs on every push and pull request to `main` and `feat/**` branches, validating linting, types, unit tests, and workspace builds.

---

## 📚 Project Documentation

Deep-dive documentation is located in the [`docs/`](docs/) directory:

- 🏛️ **[System Architecture & Blueprint](docs/ARCHITECTURE.md)**: Data flows, services, and directory layout.
- 🛡️ **[RBAC Permission Matrix](docs/RBAC.md)**: Authoritative role definitions and access tables.
- 🔄 **[State Machines & Invariants](docs/STATE_MACHINES.md)**: Task, request, and membership lifecycles.
- 🔌 **[REST API Reference](docs/API.md)**: Full v1 endpoint documentation with request/response schemas.
- 📝 **[Business Assumptions](docs/ASSUMPTIONS.md)**: Resolutions to edge cases and business logic.

---

## 📄 Contributing & License

Contributions are welcome! Please open an issue or submit a pull request following our repository guidelines.

This project is licensed under the **MIT License**.
