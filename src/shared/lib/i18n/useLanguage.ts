import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { STORAGE_KEYS } from "@/shared/lib/constants.ts";

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();

  const isBackoffice = pathname.startsWith("/backoffice");
  const storageKey = isBackoffice
    ? STORAGE_KEYS.BACKOFFICE_LANG
    : STORAGE_KEYS.WEBSITE_LANG;

  const changeLanguage = (newLang: string) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem(storageKey, newLang);
  };

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    isBackoffice,
  };
};
