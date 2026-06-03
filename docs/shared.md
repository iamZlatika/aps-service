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

## Utilities

All utilities live in `src/shared/lib/`.

### `cn(...classes)`

Merges Tailwind class names conditionally. Always use this instead of string concatenation.

```ts
import { cn } from "@/shared/lib/utils";

<div className={cn("base-class", isActive && "active-class", className)} />
```

---

### `formatDate(isoString)`

Formats an ISO datetime string to `dd.MM.yyyy`. Returns `null` for empty or invalid input.

```ts
import { formatDate } from "@/shared/lib/utils";

formatDate(order.createdAt); // → "01.06.2025"
formatDate(null);            // → null
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
| `LANG_STORAGE_KEY` | string | localStorage key for language preference |
| `THEME_STORAGE_KEY` | string | localStorage key for theme preference |

---

## Error Handling Helpers

From `src/shared/lib/errors/services.ts`:

### `isApiError(error)`

Type guard — narrows `unknown` to `ApiError`. Use before branching on status or data.

```ts
if (isApiError(error) && error.status === 422) { ... }
```

### `notifyError(error)`

Shows an error toast. Handles 403 with a localized "forbidden" message automatically.
For mutations without `onError`, this is called automatically by the query client.

### `handleFormError(error, setError, options?)`

Maps 422 server validation errors to React Hook Form fields. See [architecture.md](architecture.md#error-handling) for details.

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
