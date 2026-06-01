# Website

The public-facing part of the application. Accessible to anyone without authentication.
Lives at the root URL and is styled independently from the backoffice with its own design tokens and theme system.

**Source:** `src/features/website/`

## Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Landing page: hero with quick status check, device types, PC build section |
| Contacts | `/contacts` | Service center locations with addresses, phones, and maps |
| Reviews | `/reviews` | Customer reviews |
| Track | `/track/:token` | Full order tracking page by unique token |
| User Account | `/account` | Personal account — in development |

---

## Routing

```ts
// routes.ts
export const WEBSITE_ROUTES = {
  home: "/",
  contacts: "/contacts",
  reviews: "/reviews",
  account: "/account",
  track: "/track/:token",   // token is the order tracking identifier
} as const;
```

Static links are in `WEBSITE_LINKS`. The `track` route is not in `WEBSITE_LINKS` because it requires a dynamic token — build it manually when needed.

---

## Pages in detail

### Home (`/`)

Three sections:

- **Hero** — tagline, active order count (fetched live), button to the personal account, and a "Track order" button that opens `TrackStatusModal`
- **Devices** — cards for each device category the service handles
- **PC Build** — PC assembly service promo section

**`TrackStatusModal`** — a dialog on the home page where the customer enters an order number to get a quick status preview (`OrderPreview`). This is separate from the full tracking page: it uses `useOrderStatus` (a mutation, not a query) and shows only basic info. Clicking through opens the full `/track/:token` page.

---

### Track (`/track/:token`)

Full order tracking by a unique token (different from the order number — the token is a shareable link).

Displays:
- Order number and current status badge
- Issue type and estimated cost
- Device specs table (type, manufacturer, model, accessories)
- Status change history (collapsible accordion)
- Intake note

Uses `useOrderTracking(token)` which fetches the full `Track` type.

---

### Contacts (`/contacts`)

Renders a card per service center location fetched via `useLocations()`.
Each card shows address, phone number, messenger buttons, and a map embed.

`useLocations()` uses `useSuspenseQuery` — the parent component must be wrapped in a `Suspense` boundary.

---

### User Account (`/account`)

Not yet implemented. Planned features:
- List of the customer's orders
- Order management actions
- Telegram subscription management

---

## API

All public endpoints are under `/api` (no `/backoffice` prefix — no auth required).

```ts
// api/endpoints.ts
const BASE = "/api";

WEBSITE_API = {
  locations: ()             => `${BASE}/dictionaries/locations`,
  track: (token: string)    => `${BASE}/orders/track/${token}`,
  status: (orderNumber)     => `${BASE}/orders/status/${orderNumber}`,
  activeCount: ()           => `${BASE}/orders/active-count`,
}
```

| Method | What it returns |
|--------|----------------|
| `getOrderTracking(token)` | Full `Track` object for the tracking page |
| `getOrderStatus(orderNumber)` | `OrderPreview` — lightweight, for the quick-check modal |
| `getLocationsInfo()` | `Location[]` — all service center branches |
| `getActiveCount()` | `number` — count of currently active orders |

---

## Key types

**`Track`** — full order data for the tracking page. Includes device specs, financial info, status history, flags (`isUrgent`, `isCalled`).

**`OrderPreview`** — a subset of `Track` for the quick status modal: order number, status, device info, issue type, status history. Derived with `Pick<Track, ...>`.

**`TrackStatusHistoryItem`** — a single entry in the status history: `{ status, createdAt }`.

---

## Hooks

| Hook | Description |
|------|-------------|
| `useOrderTracking(token)` | Fetches `Track` by token. Returns `{ track, isLoading, isError, error, refetch }` |
| `useOrderStatus({ onSuccess })` | Mutation — fetches `OrderPreview` by order number. Used in the quick-check modal |
| `useLocations()` | Fetches all locations via `useSuspenseQuery`. Returns `{ locations }` |
| `useActiveCount()` | Fetches active order count for the hero. Returns `{ activeCount }` |
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
