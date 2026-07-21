# Shared Utilities & Components

**Before writing a new utility, hook, or component — check this document first.**

Everything listed here is ready to use. Reimplementing any of it is a bug.

## Table of Contents

- [Hooks](#hooks)
- [Utilities](#utilities)
- [Constants](#constants)
- [Error Handling Helpers](#error-handling-helpers)
- [UI Components](#ui-components)
- [Error & State Components](#error--state-components)
- [Common Components](#common-components)
- [Widgets](#widgets)

---

## Hooks

All shared hooks live in `src/shared/hooks/`.

### `useDebounce(value, delay)`

Debounces any value. Returns the debounced value after the specified delay in ms.

```ts
import { useDebounce } from "@/shared/hooks/useDebounce";

const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);
```

Use `SEARCH_DEBOUNCE_MS` (300ms) for search inputs and `FILTER_DEBOUNCE_MS` (400ms) for filter inputs.

---

### `useIsMobile(breakpoint?)`

Returns `true` if the viewport width is below the breakpoint (default: 767px). Reacts to resize events.

```ts
import { useIsMobile } from "@/shared/hooks/useMobile";

const isMobile = useIsMobile();
```

---

### `useCopyToClipboard()`

Copies text to the clipboard. Returns `{ copied, copy }`.
`copied` is `true` for 2 seconds after a successful copy, then resets automatically.
Shows an error toast if the clipboard API fails.

```ts
const { copied, copy } = useCopyToClipboard();

<button onClick={() => copy(order.id.toString())}>
  {copied ? "Copied!" : "Copy"}
</button>
```

---

### `useLocalizedName()`

Returns a function that picks the correct locale string from an object with `nameRu` / `nameUa` fields.

```ts
import { useLocalizedName } from "@/shared/hooks/useLocalizedName";

const getLocalizedName = useLocalizedName();

getLocalizedName(status); // → status.nameRu or status.nameUa depending on current language
```

---

### `useLocalize()`

Returns a function that picks between two raw strings based on the current language.
Use when you have inline strings (not an object with named fields).

```ts
import { useLocalize } from "@/shared/hooks/useLocalize";

const localize = useLocalize();

localize(location.cityRu, location.cityUa);
```

---

### `useVisualViewportBottom()`

Returns the distance in pixels between the bottom of the visual viewport and the bottom of the layout viewport.
Used to push UI above the mobile keyboard when it appears.

---

### `useKeyboardShortcut({ key, shiftKey?, enabled?, ignoreWhenTyping?, ignoreWhenDialogOpen?, onTrigger })`

Registers a global `keydown` shortcut. By default ignores keystrokes while typing in an input/textarea/select, and while any Radix dialog (`[role="dialog"]`) is open.

```ts
import { useKeyboardShortcut } from "@/shared/hooks/useKeyboardShortcut";

useKeyboardShortcut({ key: "Escape", onTrigger: closeModal });
```

---

### `usePullToRefresh(containerRef)`

Mobile-only pull-to-refresh gesture on a scrollable container. Invalidates all React Query caches once the pull threshold is met. Returns `{ progress, status }` (`status` is one of `PULL_TO_REFRESH_STATUS`) — drive `PullToRefreshIndicator`/`PullToRefreshBackdrop`/`PullToRefreshLoaderFrame` (`shared/components/`) with these values.

---

### `useScrollLock()`

Locks `document.body` scroll for as long as the calling component is mounted (restores the previous `overflow` value on unmount). Use in modals/drawers that must prevent background scroll.

---

## Utilities

All utilities live in `src/shared/lib/`.

### `cn(...classes)`

Merges Tailwind class names conditionally. Always use this instead of string concatenation.

```ts
import { cn } from "@/shared/lib/utils";

<div className={cn("base-class", isActive && "active-class", className)} />
```

---

### `formatDate(isoString)` / `formatDateTime(isoString)` / `stripNonDigits(value)`

All in `shared/lib/utils.ts`, alongside `cn`.

`formatDate` formats an ISO datetime string to `dd.MM.yyyy`; `formatDateTime` formats to `dd.MM.yyyy HH:mm`. Both return `null` for empty or invalid input. `stripNonDigits` removes all non-digit characters from a string (used by phone formatting/validation).

```ts
import { formatDate, formatDateTime, stripNonDigits } from "@/shared/lib/utils";

formatDate(order.createdAt);     // → "01.06.2025"
formatDate(null);                // → null
formatDateTime(order.createdAt); // → "01.06.2025 14:30"
stripNonDigits("+380 (67) 123-45-67"); // → "380671234567"
```

---

### `formatMoney(value)`

Formats an amount string/number as `"1 234,00 ₴"` (2 decimal places). See the [Money / Amount Fields](architecture.md#money--amount-fields) rule in architecture.md — use with `MoneyAmount` for standard debt/positive styling.

```ts
import { formatMoney } from "@/shared/lib/utils";

formatMoney("1500"); // → "1 500,00 ₴"
```

---

### `assertNever(x)`

Exhaustiveness check for switch statements over union types.
Throws at runtime if a case is unhandled; fails at compile time if the type is not fully covered.

```ts
import { assertNever } from "@/shared/lib/assertNever";

switch (role) {
  case ROLES.CLIENT: return "...";
  case ROLES.MANAGER: return "...";
  case ROLES.HEAD_MANAGER: return "...";
  default: return assertNever(role); // TypeScript error if a case is missing
}
```

---

### `zodEnumFromConst(obj)`

Converts an `as const` object to a Zod enum. Use in DTO schemas instead of `z.enum([...])`.

```ts
import { zodEnumFromConst } from "@/shared/lib/zod-helpers";
import { PAYMENTS } from "@/shared/types";

type: zodEnumFromConst(PAYMENTS), // ✅
type: z.enum(["prepayment", "payment", "refund"]), // ❌
```

---

### `storageGet(key)` / `storageSet(key, value)`

Safe localStorage wrappers. Swallow errors silently (private browsing, quota exceeded).
Use these instead of `localStorage.getItem/setItem` directly.

```ts
import { storageGet, storageSet } from "@/shared/lib/storage";
```

---

### `phone.ts`

Ukrainian mobile phone helpers, used by phone validation/formatting across the app:

- `MOBILE_OPERATOR_CODES` — the set of supported operator prefixes (Vodafone, Kyivstar, lifecell)
- `isSupportedMobileOperator(phone)` — checks a `+380XXXXXXXXX` phone's operator code against `MOBILE_OPERATOR_CODES`
- `extractLocalPhoneDigits(chars)` — normalizes `380...`/`38...`-prefixed input to a local `0...` digit string, for masked phone inputs

---

### `pagination.ts`

`getPageNumbers(currentPage, lastPage)` — computes the page-number list (with `"ellipsis"` entries) for a pagination control, collapsing runs of pages beyond a small window around the current page.

---

### `imageCompression.ts`

`IMAGE_COMPRESSION_OPTIONS` — options passed to `browser-image-compression` (`maxSizeMB: 2`, `maxWidthOrHeight: 1920`, `useWebWorker: true`). Used before uploading avatars/work photos.

---

### `pullToRefresh.ts`

Pure helpers backing `usePullToRefresh` (see [Hooks](#hooks)): `PULL_TO_REFRESH_STATUS`, `PULL_THRESHOLD_PX` (70), `PULL_MAX_DISTANCE_PX` (120), `PULL_RESISTANCE` (0.5), `calculatePullDistance(deltaY, maxDistance)`, `isPullThresholdMet(distance, threshold)`.

---

### `zod-helpers.ts` — `phoneField(message?)` / `optionalPhoneField(message?)`

In addition to `zodEnumFromConst` (below), this file exports Zod field validators for Ukrainian phone numbers — format check via `phoneRegex` plus operator check via `isSupportedMobileOperator`. `optionalPhoneField` treats an empty string as `undefined`.

```ts
import { phoneField, optionalPhoneField } from "@/shared/lib/zod-helpers";

phone: phoneField(),
extraPhone: optionalPhoneField(),
```

---

### `errors/getErrorDescription(error, eventId?)`

Formats an error for display: in dev, the raw error message/stringified value; in prod, `"Error ID: <eventId>"` if a Sentry event ID was captured, otherwise `undefined`. Used by error pages to show a support-friendly reference without leaking internals in production.

---

### `errors/serverMessageMap.ts` — `getSharedServerMessageMap()`

Returns a `Record<string, string>` mapping known raw server error strings to translated messages (e.g. "The name has already been taken." → localized). Shared by `notifyError` and `handleFormError` so the same server message is translated consistently everywhere it can appear.

---

## Constants

From `src/shared/lib/constants.ts`:

| Constant | Value | Use for |
|----------|-------|---------|
| `SEARCH_DEBOUNCE_MS` | 300ms | Debounce delay for search inputs |
| `FILTER_DEBOUNCE_MS` | 400ms | Debounce delay for filter inputs |
| `SEARCH_PAGE_SIZE` | 30 | Page size for search/autocomplete requests |
| `QUERY_STALE_TIME` | 5 min | React Query default stale time |
| `QUERY_GC_TIME` | 10 min | React Query default GC time |
| `statusColorMap` | object | Maps status color keys → Tailwind `bg-*` classes |
| `statusTextColorMap` | object | Maps status color keys → Tailwind `text-*` classes |
| `emailRegex` | RegExp | Email validation pattern |
| `phoneRegex` | RegExp | Ukrainian phone format validation (`+380XXXXXXXXX`) |
| `ACCESSORY_QUICK_SELECT` | array | Quick-select labels for common accessory values |
| `LANG_STORAGE_KEY` | string | localStorage key for language preference |
| `THEME_STORAGE_KEY` | string | localStorage key for theme preference |

---

## WebSocket / Echo

The Echo singleton for WebSocket connections (Ably via `@ably/laravel-echo`) is managed in `src/shared/lib/`.

### `initEcho(token)` / `getEcho()` / `destroyEcho()`

Lifecycle functions from `shared/lib/echo.ts`.

```ts
import { initEcho, getEcho, destroyEcho } from "@/shared/lib/echo";

// called by useAuth after login
await initEcho(token);

// called at the top of a socket hook
const echo = getEcho();
if (!echo) return;

// called by sessionManager on logout
destroyEcho();
```

**Do not import from `echoFactory.ts` directly** — it carries all Ably code and is lazy-loaded. Always go through `echo.ts`.

Connection error handling (Sentry capture + error toasts for `failed` / `suspended` states) is wired up inside `echoFactory.ts` and fires automatically for every connection — no per-hook handling needed.

---

## Error Handling Helpers

### `isApiError(error)` / `notifyError(error)` — `src/shared/lib/errors/services.ts`

`isApiError` is a type guard — narrows `unknown` to `ApiError`. Use before branching on status or data.

```ts
if (isApiError(error) && error.status === 422) { ... }
```

`notifyError` shows an error toast. Handles 403 with a localized "forbidden" message automatically.
For mutations without `onError`, this is called automatically by the query client.

### `handleFormError(error, setError, options?)` — `src/shared/lib/errors/handleFormError.ts`

Maps 422 server validation errors to React Hook Form fields. See [architecture.md](architecture.md#error-handling) for details. Lives in its own file, separate from `isApiError`/`notifyError`.

### Sentry — `src/shared/lib/sentry.ts`

`initSentry()`, `captureError()`, `captureErrorWithId()`, and the `silentErrorStatuses` request option. See the full write-up in [architecture.md](architecture.md#error-tracking-sentry).

---

## UI Components

Generic primitives from `src/shared/components/ui/`. These are Radix UI components with Tailwind styling.

| Component | File | Notes |
|-----------|------|-------|
| `Button` | `button.tsx` | Variants: `default`, `destructive`, `outline`, `ghost`, `link` |
| `Input` | `input.tsx` | Standard text input |
| `Textarea` | `textarea.tsx` | Multiline text |
| `Label` | `label.tsx` | Form label, connects to input via `htmlFor` |
| `Select` | `select.tsx` | Radix-based dropdown select |
| `Checkbox` | `checkbox.tsx` | Radix-based checkbox |
| `Switch` | `switch.tsx` | Radix-based toggle switch |
| `Dialog` | `dialog.tsx` | Modal dialog — use for confirmations and forms |
| `Sheet` | `sheet.tsx` | Slide-in panel (drawer) from any side |
| `Tooltip` | `tooltip.tsx` | Hover tooltip |
| `Badge` | `badge.tsx` | Inline status/label chips |
| `Card` | `card.tsx` | Content card with header/content/footer slots |
| `Table` | `table.tsx` | HTML table primitives with Tailwind styles |
| `Pagination` | `pagination.tsx` | Page navigation |
| `Progress` | `progress.tsx` | Progress bar |
| `Skeleton` | `skeleton.tsx` | Loading placeholder |
| `Separator` | `separator.tsx` | Horizontal/vertical divider |
| `Dropdown Menu` | `dropdown-menu.tsx` | Radix dropdown with items, groups, separators |
| `Collapsible` | `collapsible.tsx` | Expandable/collapsible section |
| `Calendar` | `calendar.tsx` | Date picker calendar (react-day-picker) |
| `Avatar` | `avatar.tsx` | User avatar with fallback initials |
| `Breadcrumb` | `breadcrumb.tsx` | Page breadcrumb navigation |
| `Sonner` | `sonner.tsx` | Toast container (Sonner) — already mounted in the app root |
| `Sidebar` | `sidebar.tsx` | App sidebar layout primitive |

---

## Error & State Components

From `src/shared/components/errors/`.

### `QueryPageGuard`

Wraps a page-level query to handle loading and error states in a consistent way.
Use this on any page that depends on a single primary query.

```tsx
import { QueryPageGuard } from "@/shared/components/errors/QueryPageGuard";

// In a page component:
const orderQuery = useOrderQuery(id);

return (
  <QueryPageGuard
    isLoading={orderQuery.isLoading}
    isError={orderQuery.isError}
    error={orderQuery.error}
    onRetry={orderQuery.refetch}
  >
    <OrderDetail order={orderQuery.data} />
  </QueryPageGuard>
);
```

Props: `isLoading`, `isError`, `error`, `onRetry?`, `loadingFallback?`, `title?`, `unknownMessage?`, `children`.

---

### `ErrorPage` (PageError)

Generic error page with icon, title, description, and optional retry button.
Used internally by `QueryPageGuard`. Can also be used standalone.

---

### `ForbiddenPage`

Shown when the user tries to access a resource they don't have permission for.

### `NotFound`

404 page stub for unmatched backoffice routes. Currently placeholder content only (not yet styled to match `ErrorPage`).

---

## Common Components

Generic reusable pieces from `src/shared/components/common/` — not primitives (those are in `ui/`), but not complex enough to be a widget either.

| Component | Purpose |
|-----------|---------|
| `MoneyAmount` | Standard debt/positive amount styling with optional `prefix`. See [Money / Amount Fields](architecture.md#money--amount-fields) |
| `LocationCheckboxGroup` | Single-select-styled-as-checkboxes location picker. Takes `clearable` to allow unchecking the selected location (used by the orders filter settings form's location filter — see [backoffice.md](backoffice.md#orders)) |
| `StatusBadge` | Generic status pill using `statusColorMap`/`statusTextColorMap`, with `isPending` (spinner) and `selectable` (chevron) states |
| `FormField` | `Input` wrapper that renders a `FieldError` message below the input |
| `Loader` | Full-section loading spinner (`react-loader-spinner` `MutatingDots`) |
| `UserStatusButton` | Toggle button for a user's active/blocked status, lock/unlock icon |
| `buttons/` | Icon-only action buttons used in table rows and forms: `AcceptButton`, `CancelButton`, `DeleteButton`, `EditButton`, `CreateOrderForCustomerButton` |

---

## Widgets

Compound components too complex to live in `shared/components/` but reusable across features.

### `SearchableSelect` — `src/widgets/searchable-select`

An autocomplete select that fetches options asynchronously as the user types.
Supports custom option rendering, inline item creation, and keyboard navigation.

Key props:

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Current input value |
| `onChange` | `(value: string) => void` | Called on every keystroke |
| `onSelect` | `(option) => void` | Called when an option is chosen |
| `fetchItems` | `(search: string) => Promise<Option[]>` | Async data fetcher |
| `queryKey` | `readonly unknown[]` | React Query key for the fetch |
| `onCreateItem` | `(name: string) => Promise<void>` | Enables inline item creation |
| `clearOnSelect` | `boolean` | Clears the input after selection |
| `dropUp` | `boolean` | Opens the list above the input |

```tsx
import { SearchableSelect } from "@/widgets/searchable-select";

<SearchableSelect
  value={search}
  onChange={setSearch}
  onSelect={(opt) => form.setValue("customerId", opt.id)}
  fetchItems={(q) => customersApi.search(q)}
  queryKey={queryKeys.customers.list()}
  placeholder={t("orders.form.customer")}
/>
```

---

### `MultiSearchableSelect` — `src/widgets/multi-searchable-select`

Same as `SearchableSelect` but allows selecting multiple values. Selected items are shown as dismissible badges.
Supports quick-select labels for common values.

Key props: same as `SearchableSelect`, plus:

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string[]` | Array of selected values |
| `onChange` | `(value: string[]) => void` | Called when selection changes |
| `quickSelectLabels` | `string[]` | Shortcut buttons for common values |

---

### `PersonCard` — `src/features/backoffice/widgets/person-card`

A card layout for displaying a person (customer, user) with avatar, info, meta, and action slots.

```tsx
import { PersonCard } from "@/features/backoffice/widgets/person-card/PersonCard";

<PersonCard
  avatarSlot={<UserAvatar user={customer} />}
  infoSlot={<CustomerInfo customer={customer} />}
  metaSlot={<CustomerStats customer={customer} />}
  rightAction={<EditButton />}
/>
```

Slots: `avatarSlot`, `infoSlot`, `metaSlot?`, `commentSlot?`, `leftAction?`, `rightAction?`, `children?`.

---

### `SmartTable` — `src/features/backoffice/widgets/table`

The main data table for backoffice list pages. Handles pagination, sorting, filtering, and row actions out of the box.

Used by orders, customers, users, and dictionaries list pages.
Accepts a `columns` config and a query hook via `SmartTableApi`. See existing list pages for usage examples.

---

### `AbilityBadge` — `src/widgets/ability-badge`

Colored badge for a single permission/ability. `abilityColors.ts` maps ability categories to colors; `abilityGroups.ts` (`groupPermissionsByCategory`) groups a flat permission list by category. Used by the [Roles & Permissions](backoffice.md#roles--permissions) editor.

---

### `Lightbox` — `src/widgets/lightbox`

Fullscreen image viewer (Radix `Dialog` based) with keyboard (arrow key) navigation between images. Used by `work-card` for before/after/additional photos.

---

### `WorkCard` — `src/widgets/work-card`

Renders one portfolio entry: device photos (`WorkMedia`, opens `Lightbox` via `useWorkGallery`) and text info (`WorkInfo`). The public site (separate `aps-website` repo) has its own copy for actually rendering the Works page; in this repo it's used only by the backoffice [Works module's](backoffice.md#works) `WorkPreviewModal`, to preview how an entry will look there before publishing.

Styled with its own `ws-*` design-token scope (`work-card.css`, `.ws-theme-dark`/`.ws-theme-light`), mirroring the public site's palette so the preview is representative. These tokens are local to this widget — do not use `ws-*` classes elsewhere in the backoffice.

```tsx
import { WorkCard } from "@/widgets/work-card";

<WorkCard work={work} isReverse={index % 2 === 1} />
```
