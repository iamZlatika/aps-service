# Architecture & Patterns

This document explains the key architectural decisions and patterns used in this project.
The goal is to help new developers (and future-you) understand *why* the code is structured this way — not just *what* is there.

## Table of Contents

- [Project Structure](#project-structure)
- [Data Flow: DTO → Adapter → Domain](#data-flow-dto--adapter--domain)
- [Money / Amount Fields](#money--amount-fields)
- [API Layer](#api-layer)
- [Error Handling](#error-handling)
- [Server State: React Query](#server-state-react-query)
- [Real-time Updates (WebSockets)](#real-time-updates-websockets)
- [Routing & Navigation](#routing--navigation)
- [Forms](#forms)
- [Enums & Shared Types](#enums--shared-types)
- [i18n](#i18n)
- [Adding a New Backoffice Module](#adding-a-new-backoffice-module)

---

## Project Structure

```
src/
├── app/              # Router config, route guards, app root
├── entities/         # Shared domain entities reused across features
│   ├── location/     # Location DTO, domain type, adapter
│   ├── order-status/ # OrderStatus DTO, domain type, adapter
│   └── price-list/   # PriceListItem DTO, domain type, adapter
├── features/
│   ├── auth/         # Login, token storage, session management
│   ├── backoffice/   # Employee panel
│   │   ├── modules/  # Self-contained feature modules (see below)
│   │   └── widgets/  # Compound components used across modules (table, etc.)
│   └── website/      # Public-facing website
├── widgets/          # Compound components shared across features
└── shared/
    ├── api/          # HTTP client, query client, query keys
    ├── components/   # Generic UI primitives (Button, Dialog, etc.)
    ├── hooks/        # Shared hooks
    ├── lib/          # Utilities, constants, i18n, error helpers
    └── types.ts      # Global enums and shared types
```

Each backoffice module is self-contained and follows the same structure:

```
modules/<name>/
├── api/
│   ├── dto.ts        # Zod schemas for server response shapes (snake_case)
│   ├── endpoints.ts  # API URL constants and builder functions
│   └── index.ts      # API object with typed async methods
├── lib/
│   ├── adapters.ts   # DTO → domain mappers (the only snake_case ↔ camelCase layer)
│   └── *.schema.ts   # Zod schemas for form validation
├── hooks/            # React Query hooks for this module
├── components/       # UI components for this module
├── pages/            # Route targets (lazy-loaded)
├── routes.ts         # Route path patterns (for React Router <Route path=…>)
├── navigation.ts     # Link builder functions (used in components and hooks)
└── types.ts          # Domain types for this module
```

---

## Shared Entities (`src/entities/`)

Some domain types and their DTO/adapter layers are shared between features (e.g. `Location` is used by both the website and the backoffice dictionaries module). These live in `src/entities/` rather than in any single feature.

Each entity follows the same three-file structure:

```
entities/<name>/
├── dto.ts       # Zod schema for the server response shape
├── types.ts     # Domain type (camelCase)
└── adapters.ts  # DTO → domain mapper function
```

Current entities:

| Entity | Consumers |
|--------|-----------|
| `location` | `website` (contacts page, modal phone buttons), `backoffice/dictionaries` |
| `order-status` | `website` (track page, status badge), `backoffice/orders` |
| `price-list` | `website` (price modal, price list page) |

**Rule:** Move a type to `entities/` only when it is actually shared across two or more features. Feature-specific types stay in the feature's own `types.ts`.

---

## Data Flow: DTO → Adapter → Domain

All data from the server goes through three layers before reaching components.
This separation keeps components clean, makes API changes easy to absorb, and ensures types are always correct.

### Layer 1 — DTO (`api/dto.ts`)

Defines the server response shape with Zod. Fields stay in `snake_case` exactly as the server sends them.
The TypeScript type is always **inferred** from the schema — never written manually.

```ts
// orders/api/dto.ts
export const OrderDtoSchema = z.object({
  id: z.number(),
  order_number: z.string(),
  is_urgent: z.boolean(),
  due_date: z.iso.datetime(),
  // ...
});

export type OrderDto = z.infer<typeof OrderDtoSchema>;
```

When one DTO extends another, use Zod's `.extend()` to avoid duplication:

```ts
export const OrderInfoDtoSchema = OrderDtoSchema.extend({
  status_history: z.array(StatusHistoryItemDtoSchema),
  services: z.array(OrderServiceSchema),
  // ...
});
```

### Layer 2 — Domain types (`types.ts`)

The frontend-facing shape in `camelCase`. No connection to the network format.
Shared base types are composed with TypeScript utilities — never duplicated.

```ts
// orders/types.ts
export type Order = {
  id: number;
  orderNumber: string;
  isUrgent: boolean;
  dueDate: string;
  // ...
};

// OrderInfo extends Order and swaps the customer type for a richer one
export type OrderInfo = Omit<Order, "customer"> & {
  customer: CustomerInfo;
  statusHistory: StatusHistoryItem[];
  services: OrderService[];
};
```

### Layer 3 — Adapter (`lib/adapters.ts`)

Pure functions that map DTO → domain. This is the **only** place where `snake_case → camelCase` conversion happens.

```ts
// orders/lib/adapters.ts
export function mapOrderDtoToOrder(dto: OrderDto): Order {
  return {
    id: dto.id,
    orderNumber: dto.order_number,
    isUrgent: dto.is_urgent,
    dueDate: dto.due_date,
    // ...
  };
}
```

### Putting it together in `api/index.ts`

The API method validates the response, then maps it. Components and hooks only ever see domain types.

```ts
// orders/api/index.ts
export const ordersApi = {
  getOrder: async (id: number): Promise<OrderInfo> => {
    const response = await get<{ data: OrderInfoDto }>(`/backoffice/orders/${id}`);
    const validated = parseDto(OrderInfoDtoSchema, response.data); // validates with Zod
    return mapOrderInfoDtoToOrderInfo(validated);                   // maps to domain
  },
};
```

**Rule:** Never parse a DTO inside a component or hook. Never use raw server shapes in the UI.

---

## Money / Amount Fields

Backend project rule: all money amounts are whole numbers — the backend never sends fractional values like `"0.00"`, always `"0"`, `"150"`, etc.

This means exact string comparisons against amount fields (e.g. `amount === "0"`) are safe and do not need `Number.parseFloat(...) === 0` defensiveness. Use `formatMoney(value)` (`shared/lib/utils.ts`) to render amounts — see `MoneyAmount` component (`shared/components/common/MoneyAmount.tsx`) for the standard debt/positive styling and optional `prefix`.

---

## API Layer

### HTTP client (`shared/api/apiClient.ts`)

Axios instance configured with base URL and interceptors.

**Request interceptor** — automatically injects `Authorization: Bearer <token>` for every request.

**Response interceptor** handles all errors centrally:
- Network errors → localized message
- 401 with an existing token → calls `logout()` automatically
- All errors except 401 and 422 → sent to Sentry
- Returns an `ApiError` instance with `status` and `data`

You never need to handle auth failures or token injection manually in feature code.

### Shared HTTP methods (`shared/api/api.ts`)

Thin wrappers around the axios instance that unwrap `response.data`:

```ts
get<T>(url, config?)     // GET
post<T, R>(url, data?)   // POST
put<T, R>(url, data?)    // PUT
del<R>(url)              // DELETE
```

### Pagination helper

Use `buildPaginatedParams()` to build query strings for paginated/sorted/filtered endpoints:

```ts
const params = buildPaginatedParams(page, perPage, sortColumn, sortType, filters);
const response = await get(`${ORDERS_API.orders()}?${params.toString()}`);
```

---

## Error Handling

Errors are handled at three levels. Never add per-call auth/logging — the interceptor already does it.

### `ApiError`

All HTTP errors are converted to `ApiError` by the interceptor. It carries `status` and `data`.

```ts
class ApiError extends Error {
  status?: number;
  data?: unknown;
}
```

Use `isApiError(error)` to narrow type before branching:

```ts
if (isApiError(error) && error.status === 422) {
  handleFormError(error, setError);
}
```

### `notifyError(error)`

Shows a toast for unexpected API errors. Handles 403 with a localized "forbidden" message automatically.
The `queryClient` already calls `notifyError` for all mutations that don't have an explicit `onError` handler.

```ts
// use in hooks when you need manual error handling:
onError: (error) => notifyError(error),
```

### `handleFormError(error, setError, options?)`

Maps server validation errors (422 responses) to React Hook Form fields.

```ts
onError: (error) => handleFormError(error, setError),
```

If the server field name differs from the form field name, use `fieldMap`:

```ts
handleFormError(error, setError, {
  fieldMap: { server_field_name: "formFieldName" },
});
```

### `QueryPageGuard`

Wrap page-level queries to handle loading and error states consistently:

```ts
<QueryPageGuard query={orderQuery}>
  {(order) => <OrderDetail order={order} />}
</QueryPageGuard>
```

---

## Server State: React Query

All server state is managed through TanStack Query. No Redux, Zustand, or Context for remote data.

### Query keys (`shared/api/queryKeys.ts`)

All keys are centralized. Always use the registry — never inline arrays:

```ts
// ✅ correct
useQuery({ queryKey: queryKeys.orders.detail(id), queryFn: ... });

// ❌ wrong
useQuery({ queryKey: ["orders", id], queryFn: ... });
```

### Default settings (do not override without reason)

| Setting | Value |
|---------|-------|
| `staleTime` | 5 minutes |
| `gcTime` | 10 minutes |
| `refetchOnWindowFocus` | disabled |
| Retry | 0 for 4xx, 1 for 5xx |

### Mutation error handling

Mutations that don't define `onError` automatically show an error toast via `notifyError`.
To suppress this (e.g. for silent background mutations), set `meta: { silent: true }`.

---

## Real-time Updates (WebSockets)

The backoffice receives live order updates via Ably, integrated through `@ably/laravel-echo` with Laravel Broadcasting.

### Setup

The Echo singleton is split across two files to keep Ably out of the main bundle:

| File | Role |
|------|------|
| `shared/lib/echo.ts` | Thin wrapper — lifecycle API: `initEcho`, `getEcho`, `destroyEcho`. Imports Echo type-only (zero runtime cost). |
| `shared/lib/echoFactory.ts` | Heavy implementation with all Ably imports. Lazy-loaded via dynamic `import()` on first call to `initEcho`. |

This split keeps Ably (~234 KB) out of the main bundle — it loads only when `initEcho` is called.

### Lifecycle

- **Login** — `useAuth` calls `initEcho(token)` after `GET /me` succeeds
- **Page refresh** — `echo.ts` module initializer checks for a stored token and calls `initEcho()` immediately (fires before hooks mount, so Echo is ready by the time components subscribe)
- **Logout** — `sessionManager` calls `destroyEcho()`, which disconnects and clears the singleton

### Connection error handling

`echoFactory.ts` attaches a connection state listener on every new instance:
- `failed` state → captured in Sentry + error toast
- `suspended` state → error toast (connection unstable)

No per-subscription error handling is needed — it's all centralized here.

### How socket events update the UI

Socket events bypass the network — they patch the React Query cache directly via `setQueryData` / `setQueriesData`. No refetch needed.

Data flow for an incoming event:
1. Echo fires a callback with the raw payload (DTO shape)
2. The hook maps the DTO to a domain type via the existing adapter
3. `queryClient.setQueryData` / `setQueriesData` patches the cached value
4. React Query re-renders the affected components automatically

**Rule:** If the payload carries the new data, patch the cache directly — never `invalidateQueries`. Only use `invalidateQueries` when the payload doesn't contain the new data (e.g. `.order.created`).

### Channels and events

Two channels are used for the orders module:

#### `backoffice.orders` — list channel

Subscribed in `useOrdersSocket()`, mounted on the orders list page.

| Event | Payload | Cache update |
|-------|---------|--------------|
| `.order.created` | — | `invalidateQueries` orders list |
| `.order.status_changed` | `{ order }` | Update matching row in all list pages |
| `.order.updated` | `{ order }` | Update matching row in all list pages |
| `.order.urgency_changed` | `{ order }` | Update matching row in all list pages |
| `.order.called_changed` | `{ order }` | Update matching row in all list pages |
| `.order.payment_changed` | `{ order, payment, action }` | Update matching row totals |
| `.order.service_changed` | `{ order, service, action }` | Update matching row totals |
| `.order.product_changed` | `{ order, product, action }` | Update matching row totals |

#### `backoffice.orders.{id}` — card channel

Subscribed in `useOrderSocket(orderId)`, mounted on the order detail page.

| Event | Payload | Cache update |
|-------|---------|--------------|
| `.order.status_changed` | `{ order }` | Merge header fields into `OrderInfo` |
| `.order.updated` | `{ order }` | Merge header fields into `OrderInfo` |
| `.order.urgency_changed` | `{ order }` | Merge header fields into `OrderInfo` |
| `.order.called_changed` | `{ order }` | Merge header fields into `OrderInfo` |
| `.order.payment_changed` | `{ order, payment, action }` | Merge header + upsert/delete in `payments` |
| `.order.service_changed` | `{ order, service, action }` | Merge header + upsert/delete in `services` |
| `.order.product_changed` | `{ order, product, action }` | Merge header + upsert/delete in `products` |
| `.order.comment_added` | `{ comment }` | Append to `comments` |
| `.order.document_added` | `{ document }` | Append to `documents` |

#### Idempotency

Payment, service, and product events fire on **both** channels simultaneously. Each hook handles only its own cache slice — they don't interfere.

#### `action` field

For `*_changed` events: `action` is `"created" | "updated" | "deleted"`.
The `applyItemAction` helper in `orders/lib/services.ts` handles upsert/delete logic for sub-collections.

---

## Routing & Navigation

Route patterns and link builders are separated to keep route config and navigation code independent.

`routes.ts` — path patterns for React Router `<Route path=...>`:

```ts
export const ORDERS_ROUTES = {
  root: "orders",
  order: "orders/:id",
} as const;
```

`navigation.ts` — link builder functions used in components and hooks:

```ts
const BASE = "/backoffice/orders";

export const ORDERS_LINKS = {
  root: () => BASE,
  detail: (id: number) => `${BASE}/${id}`,
} as const;
```

**Never hardcode paths in components:**

```ts
// ✅ correct
navigate(ORDERS_LINKS.detail(order.id));

// ❌ wrong
navigate(`/backoffice/orders/${order.id}`);
```

---

## Forms

All forms use **React Hook Form** with a **Zod resolver**.

Schema lives in a `*.schema.ts` file next to the page or component:

```ts
// order.schema.ts
export const orderSchema = z.object({
  deviceType: z.string().min(1, i18next.t("validation.required")),
  estimatedCost: z.number().positive().optional(),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
```

Connecting to the form:

```ts
const form = useForm<OrderFormValues>({
  resolver: zodResolver(orderSchema),
});
```

Server validation errors are mapped to fields with `handleFormError`:

```ts
const mutation = useMutation({
  onError: (error) => handleFormError(error, form.setError),
});
```

**Rule:** All Zod error messages must use `i18next.t()` — never hardcode strings in schemas.

---

## Enums & Shared Types

Fixed value sets are defined as `as const` objects in `shared/types.ts`.
The union type is always derived — never written manually:

```ts
export const ROLES = {
  CLIENT: "client",
  MANAGER: "manager",
  HEAD_MANAGER: "head_manager",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
// → "client" | "manager" | "head_manager"
```

To use as a Zod enum, use the `zodEnumFromConst` helper:

```ts
import { zodEnumFromConst } from "@/shared/lib/zod-helpers";

role: zodEnumFromConst(ROLES),
```

---

## i18n

The project supports two locales: `ru` (default for backoffice) and `uk` (default for website).
Translation files live in `src/shared/lib/i18n/locales/{ru,uk}/*.json`.

- In components and hooks: `const { t } = useTranslation()`
- In non-component code (schemas, services): `i18next.t(key)` directly

Every user-visible string from the frontend must be translated.
Strings from the server are translated server-side.

---

## Adding a New Backoffice Module

Checklist for a new module (e.g. `invoices`):

- [ ] Create `src/features/backoffice/modules/invoices/`
- [ ] `api/dto.ts` — Zod schemas for all server response shapes
- [ ] `api/endpoints.ts` — URL constants and builder functions
- [ ] `api/index.ts` — API object with typed async methods (validate + map in each method)
- [ ] `types.ts` — domain types (camelCase, derived from each other where possible)
- [ ] `lib/adapters.ts` — DTO → domain mapper functions
- [ ] `lib/*.schema.ts` — Zod form schemas (with i18next messages)
- [ ] `hooks/` — React Query hooks (`useQuery`, `useMutation`)
- [ ] `components/` — UI components for this module
- [ ] `pages/` — lazy-loaded route targets
- [ ] `routes.ts` — route path patterns
- [ ] `navigation.ts` — link builder functions
- [ ] Add query keys to `shared/api/queryKeys.ts`
- [ ] Register routes in the router config (`app/`)
