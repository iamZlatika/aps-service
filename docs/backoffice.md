# Backoffice

The backoffice is the internal panel for employees. It lives under `/backoffice` and is accessible only to authenticated users with the `manager` or `head_manager` role.

## Modules

- [Orders](#orders)
- [Customers](#customers)
- [Users](#users)
- [Dictionaries](#dictionaries)
- [Billing](#billing)
- [Referrals](#referrals)
- [Profile](#profile)
- [Works](#works)
- [Roles & Permissions](#roles--permissions)
- [SMS Integration](#sms-integration)
- [Quick Orders](#quick-orders)

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

The filter settings form's location filter uses `LocationCheckboxGroup` (`shared/components/common/`) with `clearable` — unlike its other usages, unchecking the selected location here clears the filter instead of requiring a different location to be picked.

### Key types

**`Order`** — list item. Contains core fields: device info, customer, manager, status, financial summary, flags, `referral` (nullable — the attached [referral](#referrals), if any).

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
| `useChangeOrderStatus` | Mutation to change an order's status |
| `useCloseOrder` | Mutation to close an order |
| `useCreateFilterPreset` | Mutation to save the current filter set as a new search preset |
| `useCreateOrderForCustomer` | Pre-fills and opens the create-order form for a specific customer |
| `useDictionarySection` | Shared logic for the collapsible dictionary-picker sections used in the order form |
| `useFilterFormOptions` | Fetches dictionary options (device types, statuses, etc.) for the filter form |
| `useIsUkLocale` | Returns whether the current locale is Ukrainian |
| `useOrderCustomerTelegramSocket` | Subscribes to Telegram-link updates for the order's customer, patching the order detail cache |

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

### Referral attachment

The create-order form's `AdditionalInfoSection` shows a referral picker (`SearchableSelect` over `referralsApi.getAll`, filtered by `customer_name`) when the current user has `orders_manage` **or** `referrals_manage` — attaching a referral is treated as part of editing the order, not a separate permission. The selected referral's id is submitted as `referralId`.

When an order has a referral, its name and commission % show in the order header and, in the Finance tab, the referral's name is shown instead of the staff member for that referral's own income row (`transaction.referral?.customer.name ?? transaction.user?.name`). See [Referrals](#referrals) for how the payout itself is calculated and tracked.

Because adding/editing/deleting order services and products, and closing an order, all recalculate the referral's pending/completed balance, the corresponding hooks (`useOrderItemSubmit`, `useDeleteOrderItem`, `useChangeOrderStatus`) also invalidate `queryKeys.referrals.all` alongside the orders queries.

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

**`Customer`** — list item. Core fields: name, portal login, email, phones, status, rating, last order date, `isReferral` (`true` if the customer currently has an active [referral](#referrals) record — drives the "Make referral" button vs. a badge on the customer detail page).

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
| `useAddCustomer` | Form state and mutation to create a new customer |
| `useCustomerInfo(id)` | Fetches full `CustomerInfo` |
| `useCustomerSms` | Sends an SMS to a customer and fetches their SMS history |
| `useCustomerTelegramSocket(customerId)` | Subscribes to Telegram-link updates for a customer, patching the customer detail cache |
| `useMergeCustomer` | Mutation to merge duplicate customer records |

### Referral promotion

With `referrals_manage`, the customer detail page header shows either a "Make referral" button (opens `MakeReferralDialog` from the [Referrals](#referrals) module, preset to this customer) or a green "Referral" badge if `customer.isReferral` is already `true`.

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
- `pendingWithdrawals` — sum of own not-yet-decided withdrawal requests (see [Billing](#billing))
- `available` — `balance − pendingWithdrawals`, the ceiling for a new withdrawal request
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
| `useManagerOptions()` | Fetches managers for use in select/autocomplete inputs |
| `usePermissionsSelection()` | Local checkbox-selection state for a set of permissions |
| `useRegisterUserForm` | Form state for the register-employee form |
| `useRegisterUser` | Mutation to register a new employee account |
| `useUpdateUserLocation(userId)` | Mutation to change a user's assigned location |
| `useUpdateUserStatus(userId)` | Mutation to change a user's status |
| `useUserPermissionsEditor(userId)` | Manages per-user permission overrides and the save mutation |

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
| Suppliers | `/dictionaries/suppliers` | Suppliers for spare parts (products) |
| Outsourcers | `/dictionaries/outsourcers` | Outsourced contractors performing services |
| Accessories | `/dictionaries/accessories` | Accessories accepted with device (case, remote…) |
| Order Statuses | `/dictionaries/order-statuses` | Custom statuses with color and system flag |
| Locations | `/dictionaries/locations` | Service center branches with address and schedule |
| Bank Cards | `/dictionaries/bank-cards` | Bank cards used for card payments |
| Price List | `/dictionaries/price-list` | Public repair price list shown on the website |

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

`suppliersApi` and `outsourcersApi` follow the same override pattern — both send a `SupplierPayload` (`name`, `manager_name`, `phone`, `website`) built by the shared `mapSupplierFormDataToPayload` adapter, since `Outsourcer` is structurally identical to `Supplier` (`OutsourcerDtoSchema = SupplierDtoSchema`).

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

## Billing

**Path:** `/backoffice/billing`
**Source:** `src/features/backoffice/modules/billing/`

Employee balances, financial transactions, the shared service balance, and self-service payout requests. Every employee's own balance/transactions are also surfaced on the [Profile](#profile) page's Finance tab, but the underlying components, API, and types all live in this module.

### Pages

| Page | Path | Required ability | Description |
|------|------|-------------------|-------------|
| Balances | `/backoffice/billing/balances` | `billing_view` | All employees' balances; row action to accrue/deduct |
| All Transactions | `/backoffice/billing/transactions` | `billing_view` | Full transaction log across all employees, with filters |
| Withdrawal Requests | `/backoffice/billing/withdrawal-requests` | `billing_view` | Same transaction table, hard-filtered to `type=withdrawal_request&status=pending` |

`/backoffice/billing` itself redirects to Balances. All three pages share `BillingTabs` (the third tab shows a pending-request count badge and is disabled when there are none) and `SystemBalanceCard`.

### Permissions

| Action | Required ability |
|--------|-------------------|
| View balances / all transactions / withdrawal requests | `billing_view` |
| Accrue/deduct an employee's balance, adjust the system balance, approve/reject a withdrawal request | `billing_balance_adjust` |
| Request a withdrawal from your own balance | — (any authenticated employee) |

### Key types

**`Transaction`** — a single balance movement. Fields: `amount` (signed string), `type`, `label`, `status`, `user` (nullable — `null` for system-level transactions), `createdBy`, `orderId`/`orderNumber` (nullable — `null` for manual/system/withdrawal entries), `orderService`/`orderProduct` (nullable — the order line item the transaction is for, when there is one).

`type` values: `intake_order_income`, `service_income`, `products_income`, `system_order_income`, `manual_adjustment`, `withdrawal_request`, `reversal`, `referral_income`.
`status` values: `pending`, `completed`, `rejected` (rejected only applies to withdrawal requests).

`referral_income` transactions (a [referral's](#referrals) cut of an order's profit) never appear in these staff transaction lists — `MyTransactionsFilterBar`/`TransactionCommonFilters` hard-exclude `TRANSACTION_TYPES.REFERRAL_INCOME` so referral money never mixes with staff money in a shared view. They're visible only on the referral's own transactions page.

**`Balance`** — an employee's current balance: `{ id, amount, pendingAmount, user, createdAt, updatedAt }`. `pendingAmount` is the sum of that employee's `pending` transactions (income not yet credited because the order isn't closed) — whole-number amount string, never fractional (see `docs/architecture.md` money rule), shown as a secondary "+ N" column next to `amount`.

**`SystemBalance`** — the shared service balance: `{ amount }`.

**`NewBillingTransaction`** — payload for a manual employee accrual/deduction: `{ userId, amount, description }`. `amount` is signed (`-` = deduct) by the caller before submitting.

**`NewWithdrawalRequest`** — payload for a self-service withdrawal request: `{ amount, description? }`. `amount` is always positive; the backend negates it.

**`NewSystemBalanceTransaction`** — payload for a system-balance deduction: `{ amount, description }`. Posts to the same endpoint as `NewBillingTransaction` but omits `userId` entirely — that's what tells the backend it's a system-level entry.

### API

All transaction-list endpoints (`allTransactions`, `myTransactions`, `withdrawalRequests`) share one `fetchPaginatedTransactions` helper in `api/index.ts` — they differ only in the endpoint URL and, for `withdrawalRequests`, a hardcoded `type`/`status` filter merged in server-side (not user-editable, unlike the other filters).

| Method | Description |
|--------|-------------|
| `billingApi.balances.getAll` | Paginated employee balances |
| `billingApi.allTransactions.getAll` | Paginated transactions, all employees |
| `billingApi.myTransactions.getAll` | Paginated transactions, current user only |
| `billingApi.withdrawalRequests.getAll` | Paginated transactions, forced to pending withdrawal requests |
| `billingApi.getSystemBalance` | Current service balance |
| `billingApi.createTransaction` | Manual accrual/deduction for an employee |
| `billingApi.requestWithdrawal` | Self-service withdrawal request |
| `billingApi.approveWithdrawal` / `rejectWithdrawal` | Approve or reject a pending withdrawal request |
| `billingApi.adjustSystemBalance` | Deduct from the service balance |

### Hooks

| Hook | Description |
|------|-------------|
| `useSystemBalance()` | Fetches the service balance |
| `usePendingWithdrawalsCount()` | Total pending withdrawal requests — drives the tab badge/disabled state and the "Withdrawal Requests" preset button in All Transactions |
| `useAdjustBalanceSubmit(onSuccess)` | Form submit logic for accruing/deducting an employee's balance |
| `useRequestWithdrawalSubmit(onSuccess)` | Form submit logic for requesting a withdrawal |
| `useAdjustSystemBalanceSubmit(onSuccess)` | Form submit logic for deducting from the system balance |
| `useWithdrawalActions()` | `approve(id)` / `reject(id)` mutations, used by both All Transactions and Withdrawal Requests row actions |

### Withdrawal request workflow

1. Any employee can request a payout up to `available` (`balance − pendingWithdrawals`, both returned on `GET /users/me`) via the "request withdrawal" button on the Profile Finance tab. This creates a `pending` `withdrawal_request` transaction — the balance is untouched until it's decided.
2. A manager with `billing_balance_adjust` sees pending requests via the badge on the "Withdrawal Requests" tab, or the same-named preset button in All Transactions (disabled when the count is 0). Both surfaces render the same hard-filtered table.
3. Approving debits the employee's balance and marks the transaction `completed`; rejecting marks it `rejected` and leaves the balance untouched. Both actions invalidate balances, all/my/withdrawal transaction lists, and (if the approver is also the requester) the current user query.

### Shared modal shell

`AdjustBalanceModal`, `RequestWithdrawalModal`, and `AdjustSystemBalanceModal` all wrap the same `AmountDescriptionModal` (Dialog + form + error + footer boilerplate) and only supply the title, submit handler, and their own amount/description fields — the first adds an accrue/deduct toggle, the second an "available" hint line, the third is the plainest of the three.

---

## Referrals

**Path:** `/backoffice/referrals`
**Source:** `src/features/backoffice/modules/referrals/`
**Required ability:** `referrals_manage` (list/detail pages, sidebar link, and route are all gated on it)

A referral is an existing [customer](#customers) promoted to earn a commission on orders attributed to them. When an order has a referral attached, the referral gets a cut of the order's profit — see [Referral attachment](#referral-attachment) in Orders for how that's wired into the order form/detail page.

**Profit distribution order:** intake staff → **referral** → repair master → service (shared balance). Each step takes its percentage from what's left after the previous one — e.g. on 1000 profit with intake 10% / referral 10% / master 50%: intake gets 100, referral gets 10% of the remaining 900 = 90, master gets 50% of the remaining 810 = 405, service keeps the last 405.

### Pages

| Page | Path | Description |
|------|------|-------------|
| Referrals list | `/backoffice/referrals` | Paginated, searchable (`customer_name`) table of all referrals |
| Referral transactions | `/backoffice/referrals/:id/transactions` | A referral's info card (customer, commission, balance, pending balance) + their transaction history |

### Key types

**`Referral`** — `{ id, customer, commissionPercent, balance, pendingBalance, createdBy, createdAt, updatedAt }`. There is no `isActive` flag: a referral either **exists** (active) or has been **demoted** (soft-deleted) — promoting the same customer again restores the same record, same `id`, same balance and transaction history, instead of creating a new one.

- `balance` — already accrued: closed orders' finalized payouts, plus manual adjustments.
- `pendingBalance` — sum of `pending` `referral_income` on the referral's still-open orders; becomes part of `balance` once those orders close. Shown as `"0"` when there's nothing pending (UI hides/dashes it rather than showing `+ 0`).

**`ReferralTransaction`** — same shape as billing's `Transaction`, scoped to a referral: `{ id, amount, type, label, status, orderId, orderNumber, orderService, orderProduct, createdBy, createdAt, updatedAt }`. `type` is `referral_income` (automatic, tied to an order) or `manual_adjustment` (an accrual/deduction made from this module).

**`NewReferral`** — `{ customerId, commissionPercent }`, the promotion payload.

**`EditReferral`** — `{ commissionPercent }` — commission is the only editable field; there's no "deactivate without demoting" state.

**`NewReferralBalanceTransaction`** — `{ amount, description }`. `amount` is a signed string built by `useAdjustReferralBalanceSubmit` from a separate accrue/deduct toggle in the UI (`REFERRAL_DIRECTIONS.ACCRUE` / `DEDUCT`) plus a positive-number form field — the form never lets the user type a `-` directly.

### API

| Method | Description |
|--------|-------------|
| `referralsApi.getAll` | Paginated referral list; also reused as the picker source in the order form and in `MakeReferralDialog`'s customer/referral search (`fetchCustomersForReferral`, `fetchReferralsByName` in `lib/searchFetchers.ts`) |
| `referralsApi.getOne` | Single referral, used on the transactions page header card |
| `referralsApi.create` | Promote a customer to referral |
| `referralsApi.update` | Edit commission percent |
| `referralsApi.demote` | Soft-delete (demote) a referral |
| `referralsApi.transactions.getAll` | Paginated transaction history for one referral |
| `referralsApi.adjustBalance` | Manual accrual/deduction, posts a `completed` transaction immediately (no `pending` stage, unlike order-driven income) |

`createReferralTransactionsApi(referralId)` binds a referral id to a `SmartTable`-compatible `{ getAll }` object, the same pattern `billingApi.withdrawalRequests` uses to pin a shared endpoint's filters.

### Hooks

| Hook | Description |
|------|-------------|
| `useMakeReferral(onSuccess)` | Promotes a customer; invalidates the referral list and that customer's detail query (so `isReferral` flips without a refresh) |
| `useEditReferral(onSuccess)` | Updates commission percent |
| `useDemoteReferral(onSuccess)` | Soft-deletes a referral |
| `useAdjustReferralBalanceSubmit(onSuccess)` | Builds the signed `amount` from the accrue/deduct toggle and submits the manual transaction; invalidates the list, that referral's detail, and its transaction history |

### File layout note

`api/dto.ts`/`lib/adapters.ts` are split from `api/referralResourceDto.ts`/`lib/referralAdapters.ts` specifically to avoid a circular import: the Orders module needs `ReferralDtoSchema`/`mapReferralDtoToReferral` to embed a referral on `OrderResource`, while the Referrals module itself needs Orders' service/product schemas to shape `ReferralTransactionDtoSchema`. The split file has no dependency back on Orders, so Orders can import from it safely.

---

## Profile

**Path:** `/backoffice/profile`
**Source:** `src/features/backoffice/modules/profile/`

The current user's own profile page. Available to all authenticated backoffice users. Split into two tabs (`ProfileTabs`):

| Tab | Path | Contents |
|-----|------|----------|
| Profile | `/backoffice/profile` | Avatar/name/email/roles header, permissions summary, change password |
| Finance | `/backoffice/profile/finance` | Own balance + available-to-withdraw (`MyBalanceCard`), commission rates, own transaction history with filters — see [Billing](#billing) |

### Features

- Edit personal info (name, avatar)
- Change password
- Switch interface language (`ru` / `uk`)
- Switch theme (`light` / `dark` / `system`)
- View own role, assigned location, and commission rates
- Request a balance withdrawal (Finance tab)

Profile data is fetched via `queryKeys.users.me()` — the same query used throughout the app to identify the current user. The `Me` type includes `balance`, `pendingWithdrawals`, and `available` (see [Billing](#billing)).

---

## Works

**Path:** `/backoffice/works`
**Source:** `src/features/backoffice/modules/works/`

Manages the portfolio of completed repair/upgrade works shown on the public website's Works page.

### Pages

| Page | Path | Description |
|------|------|-------------|
| Works list | `/backoffice/works` | Table of all works, with publish/unpublish and delete row actions |
| Create work | `/backoffice/works/create` | Multi-section form: device info, work content, before/after/main/additional photos |
| Edit work | `/backoffice/works/:id/edit` | Edit an existing work entry |

### Key types

**`Work`** (`src/entities/work/`) — shared entity, also consumed by `widgets/work-card` on the website: device info, `type` (`repair` / `upgrade`), localized reason/description, `photos` (`before` / `after` / `main` / `additional`).

**`BackofficeWork`** — extends `Work` with `isPublished`.

### Hooks

| Hook | Description |
|------|-------------|
| `useCreateWork` | Form state and mutation for creating a new work entry |
| `useEditWork` | Fetches an existing work and submits edits |
| `usePublishWork` | Mutation to toggle `isPublished` |
| `useDeleteWork` | Mutation to delete a work entry |

---

## Roles & Permissions

**Path:** `/backoffice/roles-permissions`
**Source:** `src/features/backoffice/modules/roles-permissions/`

Manages which permissions are assigned to each role. A single page: select a role, toggle its permissions grouped by category (`RolePermissionsCard`, categories from `widgets/ability-badge/abilityGroups`).

### Key types

**`Permission`** / **`RoleWithPermissions`** (`src/entities/role/`) — shared entity types. `RoleWithPermissions` holds `permissions` as a flat array of permission names.

### Hooks

| Hook | Description |
|------|-------------|
| `usePermissions()` | Fetches all available permissions |
| `useRoles()` | Fetches all roles with their assigned permissions |
| `useRolePermissionsEditor()` | Combines `usePermissions`/`useRoles`, manages the selected role and permission toggles, and the save mutation |

---

## SMS Integration

**Path:** `/backoffice/integrations` (route slug `integrations` — differs from the module folder name `sms-integration`)
**Source:** `src/features/backoffice/modules/sms-integration/`

Shows the SMS provider balance and a log of sent SMS messages (order/customer notifications).

### Key types

**`SmsBalance`** — `{ amount, lowBalanceThreshold, isLow }`.

**`SmsMessage`** — a single sent SMS: `provider`, `phone`, `text`, delivery `status`, `providerStatus`, `price`, `segments`, linked `customer` (nullable).

### Hooks

| Hook | Description |
|------|-------------|
| `useSmsBalance()` | Fetches the SMS provider balance. `isUnavailable` is `true` when the provider responds with 503 (integration not configured) |

---

## Quick Orders

**Path:** `/backoffice/quick-orders`
**Source:** `src/features/backoffice/modules/quick-orders/`

A lightweight order type for walk-in sales that skips the full repair-order lifecycle (no device intake, no status history) — just services/products, payment, and totals.

### Pages

| Page | Path | Description |
|------|------|-------------|
| Quick orders list | `/backoffice/quick-orders` | Paginated, filterable table |
| Create quick order | `/backoffice/quick-orders/new` | Form to register a new quick order |
| Quick order detail | `/backoffice/quick-orders/:id` | Detail view with a Finance tab (`QuickOrderFinanceTab`) |

### Key types

**`QuickOrder`** — list item: `number`, `manager`, `location`, `paymentMethod`, totals (`totalPrice`, `totalCost`, `totalIncome`).

**`QuickOrderDetail`** — extends `QuickOrder` with `services`, `products`, `transactions`, `comment`, `createdBy`.

### Hooks

| Hook | Description |
|------|-------------|
| `useQuickOrder(id)` | Fetches `QuickOrderDetail` |
| `useAddQuickOrder` | Form state and mutation to create a quick order |
| `useDeleteQuickOrder` | Mutation to delete a quick order |
| `useQuickOrderFormDefaults` | Fetches users/locations for the create form's defaults |
| `useQuickOrderItemForm` | Form state for adding a product or service line item |
