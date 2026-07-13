import { WEBSITE_LINKS } from "@/features/website/navigation";

export const NAV_TABS = [
  { labelKey: "nav.home", to: WEBSITE_LINKS.home, end: true },
  { labelKey: "nav.contacts", to: WEBSITE_LINKS.contacts, end: false },
  { labelKey: "nav.works", to: WEBSITE_LINKS.works, end: false },
  { labelKey: "nav.reviews", to: WEBSITE_LINKS.reviews, end: false },
  { labelKey: "nav.priceList", to: WEBSITE_LINKS.priceList, end: false },
  { labelKey: "nav.warranty", to: WEBSITE_LINKS.warranty, end: false },
  { labelKey: "nav.about", to: WEBSITE_LINKS.about, end: false },
] as const;
