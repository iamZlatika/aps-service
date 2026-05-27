import { WEBSITE_LINKS } from "@/features/website/navigation";

export const NAV_TABS = [
  { labelKey: "nav.home", to: WEBSITE_LINKS.home, end: true },
  { labelKey: "nav.contacts", to: WEBSITE_LINKS.contacts, end: false },
  { labelKey: "nav.works", to: WEBSITE_LINKS.works, end: false },
  { labelKey: "nav.reviews", to: WEBSITE_LINKS.reviews, end: false },
] as const;
