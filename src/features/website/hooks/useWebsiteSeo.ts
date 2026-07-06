import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { WEBSITE_SEO_ENTRIES } from "@/features/website/components/WebsitePageSeoData";

type WebsiteSeo = {
  title: string;
  description: string;
  canonical: string;
};

export const useWebsiteSeo = (): WebsiteSeo | null => {
  const { pathname } = useLocation();
  const { t } = useTranslation("website");

  const entry = WEBSITE_SEO_ENTRIES.find((item) => item.path === pathname);
  if (!entry) return null;

  return {
    title: t(entry.titleKey),
    description: t(entry.descriptionKey),
    canonical: `${import.meta.env.VITE_SITE_URL}${pathname}`,
  };
};
