import { WEBSITE_ROUTES } from "@/features/website/routes";

export const WEBSITE_LINKS = {
  home: WEBSITE_ROUTES.home,
  contacts: WEBSITE_ROUTES.contacts,
  works: WEBSITE_ROUTES.works,
  reviews: WEBSITE_ROUTES.reviews,
  priceList: WEBSITE_ROUTES.priceList,
  warranty: WEBSITE_ROUTES.warranty,
  about: WEBSITE_ROUTES.about,
} as const;
