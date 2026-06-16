# Backoffice

The backoffice is the internal panel for employees. It lives under `/backoffice` and is accessible only to authenticated users with the `manager` or `head_manager` role.

## Modules

- [Orders](#orders)
- [Customers](#customers)
- [Users](#users)
- [Dictionaries](#dictionaries)
- [Profile](#profile)

---

## Orders

**Path:** `/backoffice/orders`
**Source:** `src/features/backoffice/modules/orders/`

The core module of the system. Manages the full lifecycle of a repair order — from intake to closing, including payments, services, spare parts, documents, and comments.

### Pages

| Page | Path | Description |
|------|------|-------------|
| Orders list | `/backoffice/orders` | Paginated, sortable, filterable table of all orders |
| Create order | `/backoffice/orders/order-new` | Multi-step form to register a new order |
| Order detail | `/backoffice/orders/:id` | Full order view with all related data |
| Filter settings | `/backoffice/orders/order-filter-settings` | Manage saved search presets |

### Key types

**`Order`** — list item. Contains core fields: device info, customer, manager, status, financial summary, flags.

**`OrderInfo`** — detail view. Extends `Order` and adds:
- `statusHistory` — list of status changes with timestamps and responsible user
- `callHistory` — log of customer call attempts
- `services` — repair operations added to the order
- `products` — spare parts added to the order
- `payments` — payment transactions (prepayments, payments, refunds)
- `transactions` — full financial transaction log
- `comments` — internal comments with optional image attachments
- `documents` — generated PDF documents (intake receipt, closing receipt)

**`OrderProduct`** / **`NewOrderProduct`** — spare part line item. `NewOrderProduct` omits server-generated fields.

**`OrderService`** / **`NewOrderService`** — repair service line item.

**`OrderPayment`** / **`NewOrderPayment`** — payment transaction. Types: `prepayment`, `payment`, `refund`. Methods: `cash`, `card`.

**`OrderSearchPreset`** — saved filter configuration for quick access to frequent searches.

### Hooks

| Hook | Description |
|------|-------------|
| `useOrder(id)` | Fetches full `OrderInfo` for the detail page |
| `useCreateOrder()` | Mutation to submit a new order form |
| `useEditOrderInfo(orderId, order, onSuccess, formValuesStorage)` | Form state and mutation for editing order device/contact details. Persists unsaved form values in `formValuesStorage` when navigating between orders so changes survive order-to-order transitions. |
| `useOrderEditingState()` | Manages which orders are currently in edit mode. Enforces single-order editing: opening a second order's form while one is already being edited triggers a conflict dialog. Returns `editingOrderIds`, `formValuesStorage`, `editConflict`, and handlers. |
| `useOrderFlags(orderId)` | Mutations to toggle `isUrgent` and `isCalled` flags |
| `useAddOrderItemForm` | Form state for adding a product or service to an order |
| `useOrderItemSubmit` | Submit logic for adding/editing order products and services |
| `useDeleteOrderItem` | Mutation to soft-delete a product or service |
| `usePaymentSubmit` | Mutation to register a payment |
| `useDeletePayment` | Mutation to cancel a payment |
| `useDocumentActions` | Download and print PDF documents |
| `useOrderSearchPresets` | CRUD for saved filter presets; reordering via drag-and-drop |
| `useLeaveGuard` | Blocks page navigation if the create-order form has unsaved changes |
| `useOrderFormDefaults` | Computes default values for the create-order form |
| `useOrdersSocket()` | Subscribes to `backoffice.orders` WebSocket channel. Keeps the order list in sync in real time. |
| `useOrderSocket(id)` | Subscribes to `backoffice.orders.{id}` WebSocket channel. Keeps the order detail cache in sync in real time. |

### Real-time updates

Order data updates in real time via WebSocket (Ably). See [Real-time Updates](architecture.md#real-time-updates-websockets) in the architecture doc for the full event and payload table.

- `useOrdersSocket()` is mounted on the orders **list** page — keeps the table rows in sync
- `useOrderSocket(orderId)` is mounted on the order **detail** page — patches `OrderInfo` in the cache as events arrive

---

### Filter persistence

When opening an order from the list, the orders list passes its current query string (`location.search`) to the order detail page via React Router's `state.back`:

```ts
// OrdersPage — on row click
navigate(ORDERS_LINKS.detail(order.id), {
  state: { back: locationSearchRef.current },
});
```

The order detail page reads `state.back` and uses it when navigating back — via the back button, via `Escape`, or via any other back-navigation in the page:

```ts
// OrderPage
const backSearch = (location.state as { back?: string } | null)?.back ?? "";

navigate(ORDERS_LINKS.root() + backSearch);  // restores filters + pagination
```

This pattern propagates through `CustomerOrdersSection` as well: when the section is rendered inside an order detail page, it forwards `backSearch` as a `state.back` prop on its order links. This means navigating from `customer → order 2` while already on `order 1` still returns to the filtered list correctly.

### Order history sidebar

The order detail page shows a chronological event log in a sidebar (`HistorySidebar`) on desktop and a bottom drawer (`MobileHistoryDrawer`) on mobile.

The history is built by `buildOrderHistory(orderInfo)` in `pages/order-page/services.ts` — same function as on the website track page. It merges status changes, payments, products, and services into a unified `OrderHistoryItem[]` sorted newest-first.

### Status system

Order statuses are dynamic — they are managed in the Dictionaries module, not hardcoded.
Each status has a `key`, localized names (`nameRu`, `nameUa`), a display color, and an `isSystem` flag.
System statuses cannot be deleted.

---

## Customers

**Path:** `/backoffice/customers`
**Source:** `src/features/backoffice/modules/customers/`

Manages the customer database. Each customer can have multiple phone numbers, a portal account, a Telegram link, and a rating.

### Pages

| Page | Path | Description |
|------|------|-------------|
| Customers list | `/backoffice/customers` | Paginated, searchable table |
| Customer detail | `/backoffice/customers/:id` | Full customer profile with phone, Telegram, ratings |

### Key types

**`Customer`** — list item. Core fields: name, portal login, email, phones, status, rating, last order date.

**`CustomerInfo`** — detail view. Extends `Customer` with:
- `telegram` — linked Telegram account info, QR code, invite link
- order history is shown via `CustomerOrdersSection` (fetched separately, not part of the type)

**`Phone`** — a customer's phone number. One phone is always marked `isPrimary`.

**`Telegram`** — Telegram connection state: `chatId`, `linkedAt`, `link`, `qrCode`.

**`RatingValue`** — `1 | 2 | 3 | 4 | 5 | null`. Ratings are set by employees, not customers.

### Hooks

| Hook | Description |
|------|-------------|
| `useCustomer(id)` | Fetches full `CustomerInfo` |
| `useCustomerPhones(customerId)` | Add, delete, and set primary phone number |
| `useCustomerRating(customerId)` | Set the customer rating (1–5) |
| `useCustomerStatus(customerId)` | Toggle customer status: `active` / `blocked` |
| `useCustomerTelegram(customerId)` | Generate or revoke Telegram invite link |
| `useCustomerOrders(customerId)` | Fetches paginated order history for a customer. Returns `{ orders, isLoading, isError, page, lastPage, setPage }` |

### Customer order history

The customer detail page shows a list of the customer's orders via `CustomerOrdersSection`.

`CustomerOrdersSection` accepts an optional `backSearch` prop — the current orders list query string — so that navigating from a customer's order into the order detail and then pressing "back" correctly restores the original filter state on the orders list (see [filter persistence](#filter-persistence) in the Orders section).

Each row highlights the currently open order (`currentOrderId`) and links to the order detail page.

---

## Users

**Path:** `/backoffice/users`
**Source:** `src/features/backoffice/modules/users/`

Manages employee accounts. Only `head_manager` can access this module.

### Pages

| Page | Path | Description |
|------|------|-------------|
| Users list | `/backoffice/users` | Table of all employees |
| User detail | `/backoffice/users/:id` | Employee profile: role, location, commission rates |

### Key types

**`User`** — employee account. Fields: name, email, `role`, `status`, `locale`, `theme`, `avatarUrl`, assigned `location`, commission rates (`servicesPercent`, `productsPercent`, `intakePercent`).

**`Me`** — extends `User` with:
- `balance` — current balance string
- `searchPresets` — the current user's saved filter presets

**`SearchPreset<TFilters>`** — a saved search/filter configuration. Generic over the filter shape.

### Roles

| Role | Description |
|------|-------------|
| `manager` | Regular employee — manages orders at an assigned location |
| `head_manager` | Admin — full access including user management |
| `client` | Customer portal account — no backoffice access |

### Hooks

| Hook | Description |
|------|-------------|
| `useUser(id)` | Fetches a single user's profile |
| `useUserRate(userId)` | Mutation to update commission percentages |
| `useUpdateLocale()` | Mutation to change the current user's language |
| `useUpdateTheme()` | Mutation to change the current user's theme |

---

## Dictionaries

**Path:** `/backoffice/dictionaries/*`
**Source:** `src/features/backoffice/modules/dictionaries/`

Reference data used across all modules. All dictionary pages are built from the same two factory abstractions — adding a new one takes minutes.

### Managed entities

| Page | Path | What it manages |
|------|------|----------------|
| Device Types | `/dictionaries/device-types` | Categories of devices (phone, laptop, monitor…) |
| Manufacturers | `/dictionaries/manufacturers` | Device brands (Apple, Samsung…) |
| Device Models | `/dictionaries/device-models` | Specific models, linked to manufacturer and type |
| Issue Types | `/dictionaries/issue-types` | Types of complaints the customer reports |
| Device Conditions | `/dictionaries/device-conditions` | Condition at intake (scratches, cracks…) |
| Intake Notes | `/dictionaries/intake-notes` | Standard intake remarks |
| Services | `/dictionaries/services` | Repair operations available to add to orders |
| Products | `/dictionaries/products` | Spare parts available to add to orders |
| Suppliers | `/dictionaries/suppliers` | Suppliers for spare parts |
| Accessories | `/dictionaries/accessories` | Accessories accepted with device (case, remote…) |
| Order Statuses | `/dictionaries/order-statuses` | Custom statuses with color and system flag |
| Locations | `/dictionaries/locations` | Service center branches with address and schedule |
| Bank Cards | `/dictionaries/bank-cards` | Bank cards used for card payments |

### Factory pattern

Most dictionaries are simple `{ id, name }` lists. The module provides two factory functions and one reusable page component so that each dictionary needs almost no boilerplate.

#### `createDictionaryApi(routes)` — `api/createDictionaryApi.ts`

Creates a standard CRUD API object for any simple `{ id, name }` dictionary.
Pass only the URL builders — everything else (pagination, sorting, filtering, Zod validation) is handled automatically.

```ts
// api/index.ts
export const accessoriesApi = createDictionaryApi({
  list: () => DICTIONARIES_API.accessories(),
  item: (id) => DICTIONARIES_API.accessory(id),
});
```

Returns: `{ getAll, create, update, remove }`.

#### `createTypedDictionaryApi(routes, schema, map?)` — same file

Use when the dictionary has a non-standard shape (extra fields, nested objects).
Pass a custom Zod schema and an optional mapper function.

```ts
// api/index.ts — OrderStatus has color, isSystem, localizedNames
export const orderStatusesApi = createTypedDictionaryApi(
  { list: () => DICTIONARIES_API.orderStatuses(), item: (id) => DICTIONARIES_API.orderStatus(id) },
  OrderStatusDtoSchema,
);

// Location has a custom payload shape and needs an adapter
export const locationApi = {
  ...createTypedDictionaryApi(
    { list: () => DICTIONARIES_API.locations(), item: (id) => DICTIONARIES_API.location(id) },
    LocationDtoSchema,
    mapLocationDtoToLocation,
  ),
  // override create/update with custom payload type
  create: async (data: LocationPayload) => { ... },
  update: async (id, data: LocationPayload) => { ... },
};
```

#### `DictionaryTablePage` — `components/DictionaryTablePage.tsx`

A ready-made page component: `SmartTable` + add / edit / delete dialogs, all wired up.
Pass `api`, `queryKeyFn`, and `columns` — the rest is automatic.

```tsx
// pages/Accessories.tsx
const columns: ColumnConfig<DictionaryItem>[] = [
  { key: "name", field: "name", labelKey: "dictionaries.table_fields.name", sortable: true },
];

const AccessoriesPage = () => (
  <DictionaryTablePage
    titleKey="sidebar.dictionaries_list.accessories"
    api={accessoriesApi}
    queryKeyFn={queryKeys.dictionaries.accessories}
    columns={columns}
  />
);
```

### Adding a new dictionary page

Checklist for a new simple `{ id, name }` dictionary (e.g. `colors`):

- [ ] `api/endpoints.ts` — add `colors` and `color(id)` entries to `DICTIONARIES_API`
- [ ] `api/index.ts` — add `export const colorsApi = createDictionaryApi({ list: ..., item: ... })`
- [ ] `shared/api/queryKeys.ts` — add `colors: makeEntityKey(["dictionaries"], "colors")` inside `dictionaries`
- [ ] `routes.ts` — add `colors: "dictionaries/colors"` to `DICTIONARIES_ROUTES`
- [ ] `navigation.ts` — add `colors: () => \`${BASE}/colors\`` to `DICTIONARIES_LINKS`
- [ ] `pages/Colors.tsx` — create page using `DictionaryTablePage` (copy any simple page as a template)
- [ ] Register the route in the router config (`app/`)
- [ ] Add sidebar link and translation key

For non-standard dictionaries (custom fields, special create form), use `createTypedDictionaryApi` and write a custom page — see `Locations.tsx` and `OrderStatuses.tsx` as examples.

### Key types

**`DictionaryItem`** — base type for simple entries: `{ id, name }`.

**`Location`** — service center branch. Contains full address (localized in `ru`/`ua`), phone, and weekly schedule as a `Record<WeekDay, DaySlot | null>`.

**`StatusColor`** — union of available color keys for order statuses.

---

## Profile

**Path:** `/backoffice/profile`
**Source:** `src/features/backoffice/modules/profile/`

The current user's own profile page. Available to all authenticated backoffice users.

### Features

- Edit personal info (name, avatar)
- Change password
- Switch interface language (`ru` / `uk`)
- Switch theme (`light` / `dark` / `system`)
- View own role and assigned location

Profile data is fetched via `queryKeys.users.me()` — the same query used throughout the app to identify the current user.
