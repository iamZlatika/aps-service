import { WEBSITE_ROUTES } from "@/features/website/routes";

export const NAV_TABS = [
  { labelKey: "nav.home", to: WEBSITE_ROUTES.home, end: true },
  { labelKey: "nav.contacts", to: WEBSITE_ROUTES.contacts, end: false },
  { labelKey: "nav.works", to: WEBSITE_ROUTES.works, end: false },
  { labelKey: "nav.reviews", to: WEBSITE_ROUTES.reviews, end: false },
] as const;
