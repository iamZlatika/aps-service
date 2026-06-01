# APS Service

A CRM system for managing electronics repair orders — built for a service center handling phones, computers, laptops, tablets, monitors, TVs, and charging stations.

## Overview

The application has two parts:

- **Backoffice** — internal panel for employees: order management, customer database, products, services, and staff
- **Website** — public interface for customers: company information, repair status tracking, and a personal account for viewing orders and managing Telegram subscriptions

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
| `VITE_CLIENT_LANGUAGE` | Default language for public website (`ru` or `uk`) |

```bash
npm run dev        # development server
npm run build      # production build
npm run test       # run tests in watch mode
npm run test:run   # run tests once
npm run lint       # lint
npm run lint:fix   # lint and auto-fix
```

## Project Structure

```
src/
├── app/              # Router config, route guards, app root
├── features/
│   ├── auth/         # Authentication
│   ├── backoffice/   # Employee panel
│   │   └── modules/  # orders, customers, users, dictionaries, profile
│   └── website/      # Public website
├── widgets/          # Reusable compound components (used across features)
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
- [Website](docs/website.md)
- [Shared utilities & components](docs/shared.md)