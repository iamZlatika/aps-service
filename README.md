# APS Service

A CRM system for managing electronics repair orders — built for a service center handling phones, computers, laptops, tablets, monitors, TVs, and charging stations.

## Overview

This repo is the **backoffice** — the internal panel for employees: order management, customer database, products, services, billing, referrals, and staff administration.

The public-facing customer website used to live in this repo but has been split out into a separate project, **aps-website** (Next.js), which consumes the same backend API independently. A few pieces of shared design/domain code remain here because the backoffice still needs them (e.g. the `Work` entity and `WorkCard` widget, reused by a live preview modal that shows how a portfolio entry will look on the public site) — see [Architecture](docs/architecture.md#shared-entities-srcentities) for details.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19, TypeScript 5.9 |
| Build tool | Vite 7 |
| Routing | React Router 7 |
| Server state | TanStack Query 5 |
| Forms | React Hook Form 7 + Zod 4 |
| Styling | Tailwind CSS 3, Radix UI |
| i18n | i18next (ru / uk) |
| HTTP client | Axios |
| Real-time | Ably (`@ably/laravel-echo`) — backoffice WebSocket updates |
| PWA | `vite-plugin-pwa`, `vite-plugin-compression` |
| Drag & drop | `@dnd-kit/*` |
| Error tracking | Sentry |
| Testing | Vitest, Testing Library |

## Getting Started

**Prerequisites:** Node.js 18+, npm

```bash
git clone <repo-url>
cd aps-service
npm install
```

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking (optional) |
| `VITE_BACKOFFICE_LANGUAGE` | Default language for backoffice (`ru` or `uk`) |

```bash
npm run dev        # development server
npm run build      # production build
npm run preview    # preview the production build locally
npm run test       # run tests in watch mode
npm run test:run   # run tests once
npm run lint       # lint
npm run lint:fix   # lint and auto-fix
```

## Project Structure

```
src/
├── app/              # Router config, route guards, app root
├── entities/         # Shared domain entities reused across backoffice modules (location, order-status, price-list, work, role)
├── features/
│   ├── auth/         # Authentication
│   └── backoffice/   # Employee panel
│       └── modules/  # orders, customers, users, dictionaries, billing, referrals, profile, works, roles-permissions, sms-integration, quick-orders
├── widgets/          # Reusable compound components (used across features)
├── styles/           # Global CSS
├── test/             # Vitest setup
└── shared/
    ├── api/          # HTTP client, query client, query keys
    ├── components/   # Generic UI components
    ├── hooks/        # Shared hooks
    ├── lib/          # Utilities, constants, i18n
    └── types.ts      # Global enums and shared types
```

## Documentation

- [Architecture & patterns](docs/architecture.md)
- [Backoffice modules](docs/backoffice.md)
- [Shared utilities & components](docs/shared.md)