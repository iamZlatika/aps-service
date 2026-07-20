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
| `VITE_CLIENT_LANGUAGE` | Default language for public website (`ru` or `uk`) |
| `VITE_GOOGLE_MAPS_KEY` | Google Maps API key (used for the map embed on the contacts page) |
| `VITE_SITE_URL` | Public site base URL (used for SEO/canonical links, OAuth callback) |
| `VITE_GTM_ID` | Google Tag Manager container ID (optional) |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics measurement ID (optional) |

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
├── entities/         # Shared domain entities reused across features (location, order-status, price-list, work, role)
├── features/
│   ├── auth/         # Authentication
│   ├── backoffice/   # Employee panel
│   │   └── modules/  # orders, customers, users, dictionaries, billing, referrals, profile, works, roles-permissions, sms-integration, quick-orders
│   └── website/      # Public website
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
- [Website](docs/website.md)
- [Shared utilities & components](docs/shared.md)