# Website

The public-facing part of the application. Accessible to anyone without authentication.
Lives at the root URL and is styled independently from the backoffice with its own design tokens and theme system.

**Source:** `src/features/website/`

## Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Landing page: hero with quick status check, device types, PC build section |
| Contacts | `/contacts` | Service center locations with addresses, phones, and maps |
| About | `/about` | About-us page |
| Works | `/works` | Portfolio / completed works showcase |
| Reviews | `/reviews` | Customer reviews, aggregated across all locations |
| Price List | `/price-list` | Full device repair price list with category navigation |
| Warranty | `/warranty` | Warranty terms, storage rates, and related info cards |
| Track | `/track/:token` | Full order tracking page by unique token |
| User Account | `/account` | Personal account — order history, profile, phone/Telegram management. Requires customer auth |
| Account order detail | `/account/orders/:id` | Single order's detail within the account |
| Account profile | `/account/profile` | Edit avatar, name, email, password, phones, Telegram link |

Also present: standalone auth pages under `/auth/*` (email verify, confirm account, confirm email change, reset password, Google OAuth callback — see [Auth pages](#auth--utility-pages)), and utility pages `not-found`, `maintenance`, `blocked`.

---

## Routing

```ts
// routes.ts
export const WEBSITE_ROUTES = {
  home: "/",
  contacts: "/contacts",
  works: "/works",
  reviews: "/reviews",
  track: "/track/:token",   // token is the order tracking identifier
  priceList: "/price-list",
  warranty: "/warranty",
  about: "/about",
  emailVerify: "/auth/email-verify",
  confirmAccount: "/auth/confirm-account",
  confirmEmailChange: "/auth/confirm-email-change",
  resetPassword: "/auth/reset-password",
  googleCallback: "/auth/google/callback",
} as const;
```

Static links are in `WEBSITE_LINKS`. The `track` route is not in `WEBSITE_LINKS` because it requires a dynamic token — build it manually when needed.

**Account routes are not in `WEBSITE_ROUTES`** — they live in their own module `routes.ts` files, next to the account modules themselves:

```ts
// modules/account/routes.ts
export const CUSTOMER_ACCOUNT_ROUTES = { root: "/account" } as const;

// modules/orders/routes.ts
export const CUSTOMER_ORDERS_ROUTES = { detail: "/account/orders/:id" } as const;

// modules/profile/routes.ts
export const CUSTOMER_PROFILE_ROUTES = { root: "/account/profile" } as const;
```

---

## Pages in detail

### Home (`/`)

Three sections:

- **Hero** — tagline, active order count (fetched live), button to the personal account, and a "Track order" button that opens `TrackStatusModal`
- **Devices** — cards for each device category the service handles
- **PC Build** — PC assembly service promo section

**`TrackStatusModal`** — a dialog on the home page where the customer enters an order number to get a quick status preview (`OrderPreview`). Shows order number, current status badge, and device specs. This is separate from the full tracking page: it uses `useOrderStatus` (a mutation, not a query). Clicking through opens the full `/track/:token` page.

---

### Track (`/track/:token`)

Full order tracking by a unique token (different from the order number — the token is a shareable link).

Displays:
- Order number, current status badge (`StatusBadge`)
- Issue type and estimated cost
- Full order history accordion (`OrderHistoryAccordion`) — statuses, payments, products, services sorted by date
- Device specs table (`TrackSpecsTable`)

The history is built in `lib/orderHistory.ts` via `buildOrderHistory(track)` — merges all four event sources and sorts them newest-first. Called through `useMemo` in the page component.

Uses `useOrderTracking(token)` which fetches the full `Track` type.

---

### Price List (`/price-list`)

Full repair price list grouped by device category.

- **Sticky category nav** — horizontal pill bar that stays fixed below the site header while scrolling. Built from API data as it loads. On mobile, pills wrap to multiple lines.
- **Category sections** — each section has a device icon, category title, and a list of `PriceRow` items (name + optional note + price).
- **Scroll-spy** — `usePricePageNav` uses `IntersectionObserver` to highlight the active category in the nav as the user scrolls.
- **Pagination** — the API returns max 100 items per page. `usePriceListAll` fetches page 1 on mount (Suspense), then the component auto-fetches remaining pages in a `useEffect` without re-suspending.
- **CTA block** — disclaimer note + call button (phone from `useLocations`).

Uses `usePriceListAll` (not `usePriceList`) — the latter is for the modal which filters by category.

---

### Contacts (`/contacts`)

Renders a card per service center location fetched via `useLocations()`.
Each card shows address, phone number, messenger buttons, and a map embed.

`useLocations()` uses `useSuspenseQuery` — the parent component must be wrapped in a `Suspense` boundary.

---

### Works (`/works`)

Portfolio / completed works showcase, populated from the backoffice [Works module](backoffice.md#works). Loads works from the API in pages (`getWorksPage`) via `useSuspenseInfiniteQuery`, rendered with `WorkCard` (`src/widgets/work-card`). Uses the same `ErrorBoundary` + `Suspense` + skeleton pattern as the price list page.

---

### Reviews (`/reviews`)

Google reviews page, now organized **per service-center location** (a "branch"). Two-column layout: sticky aside on the left, tabs + masonry card wall on the right.

- **`ReviewBranchTabs`** — one tab per location, each showing its review count; switching tabs swaps the active location's reviews without a refetch (all locations' reviews are pre-fetched by `useAllLocationReviews`).
- **`ReviewBranchNote`** — shows the active location's address below the tabs.
- **`ReviewsAside`** — score card for the active location: Google spinner icon, computed average rating (`avg.toFixed(1)`), review count, filled/empty stars based on `Math.round(avg)`, distribution bars (5→1) as percentage bars, and a "Leave a review" CTA linking to `location.reviewUrl` (only rendered when the location has one).
- **Card wall** renders one `ReviewCard` per review for the active location, in a CSS masonry layout (`columns: 2`, `break-inside-avoid`). Each card shows a colored letter avatar (color deterministically derived from the author's name via `getAvatarColor`), author name, formatted date, star rating, and review text.

**Service functions** in `lib/service.ts` used here: `getAvatarColor(name)` (maps name to one of 7 palette colors), `computeReviewStats(ratings)` (computes `{ avg, dist }` from a `number[]` in a single reduce pass).

Uses `useLocations()` + `useAllLocationReviews(locations)` (both `useSuspenseQuery`/`useSuspenseQueries`). Page-level loading state shows a skeleton that already renders the `h1#reviews-heading` so `aria-labelledby` resolves during Suspense.

---

### User Account (`/account`)

Personal account for authenticated customers — fully implemented, protected by `CustomerProtectedRoute`. Split across three sibling modules under `src/features/website/modules/`.

#### `modules/account` — `/account`

The account landing page: `AccountHeader` (name/avatar/logout) + `OrdersPanel` (the customer's order list, paginated via `useCustomerOrders`). `VerifyGate`/`AddPhoneGate` prompt an unverified customer to add/verify a phone before the account is fully usable; `TelegramBanner` prompts linking Telegram if not yet linked.

#### `modules/orders` — `/account/orders/:id`

Single order detail for the logged-in customer: device info (`OrderDeviceInfo`), line items (`OrderLineItemsCard`), payments (`OrderPaymentsCard`), documents with download (`OrderDocumentsList`, via `useDownloadOrderDocument`).

**Key types** (`modules/orders/types.ts`): `OrderListItem` (list row), `OrderDetail` (extends `OrderListItem` with `issueType`, `location`, `payments`, `services`, `products`, `documents`), `OrderDocument`, `OrderLineItem`.

**Hooks:** `useCustomerOrders()` (paginated list), `useCustomerOrder(id)` (detail), `useDownloadOrderDocument()`.

#### `modules/profile` — `/account/profile`

Edit profile: avatar upload with crop (`AvatarEditorModal`, `useAvatarEditorFlow`/`useAvatarUpload`/`useAvatarDelete`), name (`useUpdateProfileName`), email change with confirmation flow (`useChangeEmail`), password change (`useChangePassword`), primary + extra phone numbers (`ExtraPhonesSection`, `useAddPhone`/`useDeletePhone`), and Telegram link/QR (`TelegramRow`, `useProfileTelegram`).

**Key types** (`modules/profile/types.ts`): `TelegramLink` — `{ link, qrCode }`.

Phone verification (adding/changing a phone, used by both this module and account onboarding) is shared top-level logic — see `useAddPhoneFlow` in the [Hooks](#hooks) table.

---

### About (`/about`)

Static about-us page: company stats, process steps (`AboutProcess`), partner logos (`AboutPartners`), "why us" section (`AboutWhy`), office list with map pins.

---

### Auth & Utility Pages

Login, registration, and password/email flows live in `src/features/auth/website/` (not `src/features/website/`) but are wired into `WEBSITE_ROUTES` and reachable from the site header/account flows:

- `email-verify`, `confirm-account`, `confirm-email-change`, `reset-password` — standalone pages for links sent by email (e.g. `/auth/email-verify`)
- `google-callback` — handles the redirect back from Google OAuth
- Login, registration, and forgot-password are **modals** (`LoginModal`, `RegistrationModal`, `ForgotPasswordModal`), not routed pages — opened via `useModalParam`, e.g. `?modal=login`

Utility pages in `src/features/website/pages/`:

| Page | Purpose |
|------|---------|
| `not-found` | 404 page with links back to key sections |
| `maintenance` | Shown when the API returns 503 (see [architecture.md](architecture.md#api-layer) — the interceptor redirects here automatically) |
| `blocked` | Shown when a request is flagged as security-blocked (see `isSecurityBlockedResponse` in [architecture.md](architecture.md#api-layer)) |

---

## API

All public endpoints are under `/api` (no `/backoffice` prefix — no auth required).

```ts
// api/endpoints.ts
const BASE = "/api";

WEBSITE_API = {
  locations: ()                        => `${BASE}/dictionaries/locations`,
  track: (token: string)               => `${BASE}/orders/track/${token}`,
  status: (orderNumber)                => `${BASE}/orders/status/${orderNumber}`,
  landing: ()                          => `${BASE}/landing`,
  priceList: ()                        => `${BASE}/dictionaries/price-list`,
  landingWorks: ()                     => `${BASE}/landing/works`,
  reviews: (locationId: number)        => `${BASE}/landing/reviews/${locationId}`,
}
```

`getOrderStatus` silences 404s from Sentry via `silentErrorStatuses: [404]` (see [architecture.md](architecture.md#error-tracking-sentry)) — a not-found order number is an expected user input, not a bug.

| Method | What it returns |
|--------|----------------|
| `getOrderTracking(token)` | Full `Track` object for the tracking page |
| `getOrderStatus(orderNumber)` | `OrderPreview` — lightweight, for the quick-check modal |
| `getLocationsInfo()` | `Location[]` — all service center branches |
| `getLanding()` | `LandingData` — landing page data (active order count, category min prices) |
| `getPriceList(categories)` | `PriceListItem[]` — price list items filtered by category keys. Used by the device price modal. |
| `getPriceListPage(page)` | `{ items: PriceListItem[], lastPage: number }` — one page (100 items) of the full unfiltered price list. Used by `usePriceListAll`. |
| `getWorksPage(page)` | `{ items: Work[], lastPage: number }` — one page of portfolio works. |
| `getReviews(locationId)` | `Review[]` — Google reviews for one location. Called once per location by `useAllLocationReviews`. |

### Account API (customer-auth only)

The account modules (`modules/account`, `modules/orders`, `modules/profile`) each have their own API surface — not part of `WEBSITE_API`, since these endpoints require the customer auth token:

```ts
// modules/orders/api/endpoints.ts
const BASE = "/api/orders";
CUSTOMER_ORDERS_API = {
  orders: ()                                   => BASE,
  order: (id: number)                          => `${BASE}/${id}`,
  downloadDocument: (orderId, documentId)      => `${BASE}/${orderId}/documents/${documentId}/download`,
}

// modules/profile/api/endpoints.ts
const BASE = "/api/profile";
CUSTOMER_PROFILE_API = {
  update: ()                    => BASE,
  avatar: ()                    => `${BASE}/avatar`,
  changePassword: ()            => `${BASE}/password`,
  changeEmail: ()                => `${BASE}/email/change`,
  primaryPhone: ()              => `${BASE}/phone`,
  phones: ()                    => `${BASE}/phones`,
  phoneById: (id: number)       => `${BASE}/phones/${id}`,
  generateTelegramLink: ()      => `${BASE}/telegram/generate-link`,
  revokeTelegramLink: ()        => `${BASE}/telegram/revoke-link`,
}
```

---

## Key types

Website-specific types live in `src/features/website/types.ts`.
Shared entity types (used across features) live in `src/entities/`.

### Track domain types (mapped from server)

**`Track`** — full order data for the tracking page. Includes device specs, financial info, products, services, payments, status history, and flags.

**`OrderPreview`** — lightweight version for the quick-check modal. `Pick<Track, "orderNumber" | "status" | "manufacturer" | "deviceType" | "deviceModel" | "issueType">`.

**`TrackStatusHistoryItem`** — single status history entry: `{ status, createdAt }`.

**`TrackProduct`** / **`TrackService`** — spare part / repair operation from the server. Include `createdAt`, `completedAt`, `deletedAt`, `sum`.

**`TrackPayment`** — payment transaction: type (`prepayment` | `payment` | `refund`), method, amount, date.

**`LandingData`** — data returned by the landing endpoint: `activeCount` (number of active orders) and `prices` (`CategoryMinPrice[]` — minimum price per device category shown in hero).

**`PriceListItem`** — repair service entry from the price list. Lives in `src/entities/price-list/types.ts`. Includes `id`, `name`, `categoryKey`, `price`, and optional `sortOrder`.

**`Review`** — a single Google review. Fields: `id`, `authorName`, `authorPhotoUrl`, `rating` (1–5), `text`, `publishedAt`.

### OrderHistory types (UI layer)

Used by `OrderHistoryAccordion`. Built from `Track` data by `buildOrderHistory()` in `lib/orderHistory.ts`.

**`OrderHistoryItem`** — discriminated union of all event types:
- `OrderHistoryStatus` — status change event with status badge
- `OrderHistoryPayment` — payment event with amount and method
- `OrderHistoryProduct` — product added/deleted event with price table
- `OrderHistoryService` — service added/deleted event with price table

---

## Website Components

Reusable components specific to the website feature. Live in `src/features/website/components/`.

### `StatusBadge` — `components/StatusBadge.tsx`

Displays an order status name as a pill badge. Always uses the ember accent color (orange in dark theme, blue in light theme) — ignores `status.color` from the server. Used on the track page and in the quick-check modal.

```tsx
import { StatusBadge } from "@/features/website/components/StatusBadge";

<StatusBadge status={track.status} />
```

---

### `OrderHistoryAccordion` — `components/OrderHistoryAccordion/`

A collapsible timeline showing all order events sorted newest-first. Used on the track page and will be used in the user account.

Accepts `OrderHistoryItem[]` — build this array with `buildOrderHistory()` from `lib/orderHistory.ts`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `OrderHistoryItem[]` | required | Events to display |
| `titleKey` | `string` | `"track.history.title"` | i18n key for the section heading |
| `visibleCount` | `number` | `4` | Items shown before "show more" |

Renders four event types differently:
- **Status** — small badge (ember if current, muted if past) + "статус змінено" label (not shown for `key === "new"`)
- **Payment** — amount with payment type and method
- **Product** — "Закуплено деталь" label + card with icon, name, qty/price/sum table
- **Service** — "Послугу виконано" label + same card layout

```tsx
import { OrderHistoryAccordion } from "@/features/website/components/OrderHistoryAccordion";
import { buildOrderHistory } from "@/features/website/lib/orderHistory";

const history = useMemo(() => buildOrderHistory(track), [track]);

<OrderHistoryAccordion items={history} />
```

---

### Other reusable components — `components/`

| Component | Purpose |
|-----------|---------|
| `WebsiteLayout` | Root layout — see [Layout](#layout) |
| `WebsiteModal` | Base modal shell used by all website dialogs (contact modal, Telegram subscribe, phone flow) |
| `WebsitePageSeo` / `WebsitePageSeoData` | Renders `<title>`/meta tags per route via `react-helmet-async`, driven by `useWebsiteSeo()` and the route table in `WebsitePageSeoData.ts` |
| `ErrorFallback` (`WebsiteErrorFallback`) | Error-boundary fallback UI for website `Suspense`/`ErrorBoundary` pages (price list, works, reviews) |
| `Loader` (`WebsiteLoader`) | Website-styled loading spinner |
| `CallButton` | "Call us" button, opens `ContactModalContent` |
| `ContactModalContent` | Contact modal body: location list, phones, messengers |
| `MessengerLabelButton` | Labeled Telegram/Viber/WhatsApp button (uses `MESSENGERS`/`MESSENGER_ICONS` from `config.ts`) |
| `TelegramSubscribeModal` | Prompts a logged-in customer to subscribe to order updates via Telegram |
| `ModalHeader` | Shared header (title + close button) for website modals |
| `DeviceIcons` | Icon set for device categories, used on the home page and price list |
| `LangSwitch` | ru/uk language switcher |
| `ThemeSwitch` | light/dark/system theme switcher — wraps `useWebsiteTheme()` |
| `WebsiteLogo` | Site logo, links to home |
| `PhoneFlow/PhoneFlowForm`, `PhoneFlow/AddPhoneOtpForm` | Phone-number entry and OTP-verification form steps, driven by `useAddPhoneFlow` |

**Header subtree** (`components/Header/`): `HeaderAuthArea` (login/register vs. logged-in state), `HeaderCabinetButton` (link to `/account`), `HeaderUserBadge` (avatar + name when logged in), plus the mobile pieces documented under [Layout](#layout).

---

## Hooks

| Hook | Description |
|------|-------------|
| `useOrderTracking(token)` | Fetches `Track` by token. Returns `{ track, isLoading, isError, error, refetch }` |
| `useOrderStatus({ onSuccess })` | Mutation — fetches `OrderPreview` by order number. Used in the quick-check modal |
| `useLocations()` | Fetches all locations via `useSuspenseQuery`. Returns `{ locations }` |
| `useLanding()` | Fetches landing data (`LandingData`) via `useQuery`. Returns `{ landing }` |
| `useActiveCount()` | Reads active order count from `useLanding()`. Returns `{ activeCount }` — does not fetch independently |
| `usePriceList(categories)` | Fetches price list items via `useSuspenseQuery`. Accepts `readonly string[]` of category keys. Returns `{ priceList }`. Used by the device price modal. |
| `usePriceListAll()` | Fetches the complete price list across all pages via `useSuspenseInfiniteQuery` (max 100 items/page). Returns `{ priceList, hasNextPage, isLoadingMore, fetchNextPage }`. The caller is responsible for triggering subsequent pages — call `fetchNextPage()` in a `useEffect` when `hasNextPage && !isLoadingMore`. |
| `useWorks(page)` | Fetches one page of portfolio works via `useSuspenseInfiniteQuery`. Returns `{ works, hasNextPage, isLoadingMore, fetchNextPage }` |
| `useAllLocationReviews(locations)` | Fetches Google reviews for every location in parallel via `useSuspenseQueries`. Returns `LocationReviews[]` (`{ locationId, reviews }`). Replaces the old single-list `useReviews()`, which no longer exists — reviews are per-location now |
| `useModalParam(key)` | Reads/writes a URL search param used to drive modal open state (`?modal=login`, etc). Returns `{ value, set, clear }` |
| `useWebsiteSeo()` | Looks up the current route in `WebsitePageSeoData`'s `WEBSITE_SEO_ENTRIES` and returns localized `{ title, description, canonical }`, or `null` if the route has no SEO entry. Consumed by `WebsitePageSeo` |
| `useAddPhoneFlow({ onSuccess? })` | Orchestrates send-code → verify-code → set-as-primary for adding/changing a phone number, with a resend countdown. Composes `useSendPhoneCode`, `useVerifyPhoneCode`, `useSetPrimaryPhone` |
| `useSendPhoneCode()` | Mutation — sends an OTP to a phone number |
| `useVerifyPhoneCode()` | Mutation — verifies the OTP code, maps server errors to form fields via `handleFormError` |
| `useSetPrimaryPhone()` | Mutation — sets a verified phone as the customer's primary phone |
| `useMobileNav()` | Mobile navigation drawer state: `{ isOpen, open, close }`. Locks scroll and handles Escape key |
| `useWebsiteThemeManager()` | Manages theme selection and persistence — used once inside `WebsiteLayout` |

---

## Layout

`WebsiteLayout` is the root layout component for all website pages. It:
- Provides `WebsiteThemeContext`
- Renders `Header`, page content, and `Footer`

**Header** is fully responsive:
- Desktop: `DesktopNav` + `HeaderInfo` (phones, language switch)
- Mobile: `MobileBar` (logo + hamburger) + `MobileNav` (slide-in drawer) + `MobileBottomBar` (sticky bottom nav)

`WebsiteLayout` tracks the header's rendered height via `ResizeObserver` and writes it to the CSS custom property `--ws-header-height` on the root `.website` element. Pages with their own sticky elements (e.g. the price list category nav) use `top: var(--ws-header-height)` to sit flush below the header at any viewport width.

---

## Theme system

The website has its own theme system, independent from the backoffice.

**Themes:** `light`, `dark`, `system` — defined in `websiteTheme.ts` as `WEBSITE_THEMES`.

**Context:** `WebsiteThemeContext` is provided by `WebsiteLayout`. Use the `useWebsiteTheme()` hook inside any website component to read or change the theme:

```ts
import { useWebsiteTheme } from "@/features/website/websiteTheme";

const { theme, resolvedTheme, setTheme } = useWebsiteTheme();
```

`resolvedTheme` is always `"light"` or `"dark"` (never `"system"`), so it's safe to use for conditional rendering.

Theme preference is persisted to `localStorage` via `storageGet/storageSet` with the `THEME_STORAGE_KEY` constant.

---

## Styling

The website uses a custom set of CSS design tokens defined in `styles/website.css`, all prefixed with `ws-`:

| Token group | Examples |
|-------------|---------|
| Backgrounds | `ws-bg`, `ws-surface` |
| Text | `ws-ink`, `ws-ink-mute` |
| Borders | `ws-line`, `ws-line-soft` |
| Accent | `ws-ember-bright` |
| Typography scale | `ws-sm`, `ws-lg`, `ws-xl` |

These tokens are **only for the website**. Do not use `ws-*` tokens in backoffice components, and do not use backoffice tokens (e.g. `bg-background`, `text-foreground`) inside website components.

Messenger button styles (Telegram, Viber, WhatsApp) are configured in `config.ts` via `MESSENGERS` and `MESSENGER_ICONS`.
