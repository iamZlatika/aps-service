import { WEBSITE_ROUTES } from "@/features/website/routes";

export type WebsiteSeoEntry = {
  path: string;
  titleKey: string;
  descriptionKey: string;
};

export const WEBSITE_SEO_ENTRIES: readonly WebsiteSeoEntry[] = [
  {
    path: WEBSITE_ROUTES.home,
    titleKey: "seo.home.title",
    descriptionKey: "seo.home.description",
  },
  {
    path: WEBSITE_ROUTES.priceList,
    titleKey: "seo.priceList.title",
    descriptionKey: "seo.priceList.description",
  },
  {
    path: WEBSITE_ROUTES.works,
    titleKey: "seo.works.title",
    descriptionKey: "seo.works.description",
  },
  {
    path: WEBSITE_ROUTES.reviews,
    titleKey: "seo.reviews.title",
    descriptionKey: "seo.reviews.description",
  },
  {
    path: WEBSITE_ROUTES.about,
    titleKey: "seo.about.title",
    descriptionKey: "seo.about.description",
  },
  {
    path: WEBSITE_ROUTES.contacts,
    titleKey: "seo.contacts.title",
    descriptionKey: "seo.contacts.description",
  },
  {
    path: WEBSITE_ROUTES.warranty,
    titleKey: "seo.warranty.title",
    descriptionKey: "seo.warranty.description",
  },
];
