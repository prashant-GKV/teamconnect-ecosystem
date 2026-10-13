# TeamConnect

> Organizational operations platform — monorepo

## Overview

TeamConnect is a three-app platform for managing category-level work, cross-category project collaboration, and organizational oversight. It enforces strict separation between Category Tasks and Project Tasks, time-bound membership with full lifecycle management, and scope-aware review authority.

### Apps

| App | Port | Description |
|-----|------|-------------|
| `teamconnect-frontend` | 3000 | Employee / Intern / Contractor / Lead / PM user app |
| `teamconnect-admin` | 3001 | Super Admin + Org Admin panel |
| `teamconnect-backend` | 4000 | Node/Express/TypeScript REST API |

---

## Prerequisites

- Node.js >= 20
- pnpm >= 9 (`npm i -g pnpm`)
- Docker + Docker Compose (for MongoDB, Redis, MinIO)

---

## Quick Start (Development)

```bash
# 1. Clone
git clone <repo-url>
cd teamconnect

# 2. Start infrastructure (MongoDB, Redis, MinIO)
pnpm docker:up

# 3. Copy env
cp .env.example .env
# Edit .env if needed (defaults work for local Docker)

# 4. Install dependencies
pnpm install

# 5. Seed the database
pnpm seed

# 6. Start all apps in parallel
pnpm dev
```

The frontend mock layer (`USE_MOCKS=true`) runs without the backend. 
To use the real backend set `USE_MOCKS=false`.

---

## Project Structure

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full repository layout and system design.

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, data model, auth flow |
| [docs/RBAC.md](docs/RBAC.md) | Role-based access control matrix |
| [docs/STATE_MACHINES.md](docs/STATE_MACHINES.md) | Task, request, membership, project state machines |
| [docs/API.md](docs/API.md) | Full API endpoint reference |
| [docs/ASSUMPTIONS.md](docs/ASSUMPTIONS.md) | Assumptions and PRD ambiguity resolutions |

---

## Tech Stack

**Frontend & Admin**
- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS + shadcn/ui (Radix primitives)
- Framer Motion, TanStack Query, Zustand
- React Hook Form + Zod, lucide-react, Recharts, dnd-kit

**Backend**
- Node.js + Express.js + TypeScript
- MongoDB + Mongoose, Redis + BullMQ
- Zod validation, JWT + argon2, MinIO (S3-compatible)
- Pino logging, Helmet, OpenAPI/Swagger

**Infrastructure**
- Docker Compose, Nginx, ESLint + Prettier
- Vitest (unit), Playwright (E2E)

---

## Scripts

```bash
pnpm dev            # Start all apps in parallel (dev mode)
pnpm build          # Build all apps for production
pnpm lint           # Lint all packages
pnpm test           # Run all tests
pnpm typecheck      # TypeScript check all packages
pnpm seed           # Seed database with realistic test data
pnpm docker:up      # Start Docker services
pnpm docker:down    # Stop Docker services
```

---

## Environment Variables

See [.env.example](.env.example) for all configurable variables with descriptions.

---

## Phase Delivery

| Phase | Status | Description |
|-------|--------|-------------|
| 0 — Plan | ✅ Complete | Architecture docs, RBAC, state machines |
| 1 — Foundation | ⏳ Next | Monorepo, design system, component library, mock layer |
| 2 — Auth + Org | 🔜 | Login, users, categories, delegation |
| 3 — Projects + Requests | 🔜 | Project workspace, cross-category requests |
| 4 — Task Engine | 🔜 | Dual-scope tasks, board, dependencies |
| 5 — Submissions + Review | 🔜 | File upload, review flows, notifications |
| 6 — Production | 🔜 | Reports, E2E tests, Docker prod, final docs |
