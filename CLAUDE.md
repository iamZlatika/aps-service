# Project Rules for Claude

## Import Aliases

Always use `@/` for internal project imports. Never use `src/` as a path prefix.

```ts
// ✅ correct
import { Foo } from "@/features/bar/Foo"

// ❌ wrong
import { Foo } from "src/features/bar/Foo"
```

`@` is configured as a TypeScript path alias pointing to `src/`.

---

## Project Structure

```
src/
├── app/              # Router config, route guards, app root
├── features/
│   ├── auth/         # Authentication feature
│   ├── backoffice/   # Admin panel
│   │   └── modules/  # Self-contained feature modules (orders, users, customers, …)
│   └── website/      # Public website
├── widgets/          # Reusable compound components (used across features)
└── shared/
    ├── api/          # HTTP client, query client, query keys
    ├── components/   # Generic UI components
    ├── hooks/        # Shared hooks
    ├── lib/          # Utilities, constants, error helpers, i18n
    └── types.ts      # Global enums and shared types
```

Each module inside `features/backoffice/modules/<module>/` is self-contained:

```
<module>/
├── api/
│   ├── dto.ts        # Zod schemas for server responses
│   ├── endpoints.ts  # API URL constants
│   └── index.ts      # API object with typed methods
├── lib/
│   ├── adapters.ts   # DTO → domain mappers
│   └── *.schema.ts   # Form validation schemas
├── hooks/            # Module-specific React Query hooks
├── components/       # Module-specific UI components
├── pages/            # Route targets (lazy-loaded)
├── routes.ts         # Route path patterns
├── navigation.ts     # Link builder functions
└── types.ts          # Domain types for this module
```

---

## No Hardcoded Links

Links MUST NOT be hardcoded anywhere in components, hooks, or services.
All navigation targets live in `navigation.ts` files per module.

```ts
// ✅ correct
import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation";
navigate(ORDERS_LINKS.detail(order.id));

// ❌ wrong
navigate(`/backoffice/orders/${order.id}`);
```

Route path patterns (for `<Route path=…>`) live in `routes.ts`.
Link builder functions (used in code) live in `navigation.ts`.

---

## DTO → Adapter → Domain: Mandatory Data Flow

All data crossing the network boundary MUST go through three layers.
Never use raw server response shapes in components or hooks.

**Layer 1 — DTO (`api/dto.ts`):** Zod schema in snake_case, type inferred from schema.

```ts
export const UserDtoSchema = z.object({ id: z.number(), avatar_url: z.string() });
export type UserDto = z.infer<typeof UserDtoSchema>;
```

**Layer 2 — Domain types (`types.ts`):** camelCase, no connection to network format.

```ts
export type User = { id: number; avatarUrl: string };
```

**Layer 3 — Adapter (`lib/adapters.ts`):** pure functions, the only place for snake_case ↔ camelCase conversion.

```ts
export function mapUserDtoToUser(dto: UserDto): User {
  return { id: dto.id, avatarUrl: dto.avatar_url };
}
```

The API method validates with Zod, then maps — never in a component or hook.
Adding a new endpoint requires updating all three layers.

---

## Error Handling via Interceptors

Errors are handled centrally in `shared/api/apiClient.ts`. The response interceptor already:
- Injects `Authorization: Bearer <token>` on every request
- Converts all Axios errors → `ApiError` with `status` and `data`
- Calls `logout()` on 401 (when a token exists)
- Sends to Sentry for all errors except 401 and 422

Do not add per-call handling for auth, token injection, or Sentry capture.
Use `isApiError()` only when branching on error type.
Use `notifyError(error)` to show a toast for unexpected errors.

---

## Enum and Shared Types Pattern

Fixed value sets use `as const` objects; union types are always derived.

```ts
// ✅ correct
export const ROLES = { CLIENT: "client", MANAGER: "manager" } as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

// ❌ wrong
type Role = "client" | "manager";
```

To use in Zod schemas: `zodEnumFromConst(ROLES)` — never `z.enum([...])` with literals.

---

## Related Type Composition via Utility Types

When a type extends or restricts another, derive it — never duplicate fields.

```ts
// Extended detail type
export type Me = User & { balance: string; searchPresets: SearchPreset[] };

// Detail view swapping a nested type
export type OrderInfo = Omit<Order, "customer"> & { customer: CustomerInfo; statusHistory: StatusHistoryItem[] };

// Write/create type derived from the full type
export type NewOrderProduct = Omit<OrderProduct, "id" | "manager" | "createdAt"> & { managerId: number | null };
```

Mirror the same composition in DTO schemas using `.extend()`.

---

## React Query

All server state is managed through TanStack Query — no Redux, Zustand, or Context for remote data.

Query keys MUST come from the central registry in `shared/api/queryKeys.ts`:

```ts
// ✅ correct
useQuery({ queryKey: queryKeys.orders.detail(id), queryFn: ... });

// ❌ wrong
useQuery({ queryKey: ["orders", id], queryFn: ... });
```

Default settings (already configured — do not override without reason): `staleTime` 5 min, `gcTime` 10 min, no refetch on window focus, retry 0 for 4xx / 1 for 5xx.
Use `QueryPageGuard` for loading/error states in pages.

---

## Forms

Forms use **React Hook Form** with a **Zod resolver** — the only allowed approach.
Form schemas live in `*.schema.ts` next to the page or component.
Error messages in schemas MUST use `i18next.t()` — never hardcode strings.
Server validation errors are mapped to fields with `handleFormError(error, setError)`.

---

## i18n

Two locales: `ru` (default) and `uk`. Translation files: `src/shared/lib/i18n/locales/{ru,uk}/`.
In components/hooks: `const { t } = useTranslation()`.
In non-component code (schemas, services): `i18next.t(key)` directly.
Every user-visible frontend string MUST be translated.

---

## Shared Utilities

Always use these helpers — never reimplement equivalent logic:

| Utility | Import | Use for |
|---------|--------|---------|
| `cn(...classes)` | `@/shared/lib/utils` | Conditional Tailwind class merging |
| `assertNever(x)` | `@/shared/lib/assertNever` | Exhaustiveness checks in switch/union |
| `formatDate(iso)` | `@/shared/lib/` | Formatting dates to `dd.MM.yyyy` |
| `useDebounce(value, ms)` | `@/shared/hooks/` | Debouncing search inputs |
| `useIsMobile()` | `@/shared/hooks/` | Responsive behavior |
| `buildPaginatedParams(...)` | `@/shared/api/api` | Pagination/sort/filter query params |
| `SEARCH_DEBOUNCE_MS` | `@/shared/lib/constants` | Debounce delay for search inputs |
