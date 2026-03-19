import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { AuthRoutes } from "@/features/auth/api/routes.ts";
import { DEFAULT_LANGUAGES, STORAGE_KEYS } from "@/shared/lib/constants.ts";

import ruCommon from "./locales/ru/common.json";
import ukCommon from "./locales/uk/common.json";

const getInitialLanguage = () => {
  const isBackoffice = window.location.pathname.startsWith(
    AuthRoutes.backofficeRoot(),
  );
  const storageKey = isBackoffice
    ? STORAGE_KEYS.BACKOFFICE_LANG
    : STORAGE_KEYS.WEBSITE_LANG;
  const defaultLang = isBackoffice
    ? DEFAULT_LANGUAGES.backoffice
    : DEFAULT_LANGUAGES.client;

  return localStorage.getItem(storageKey) || defaultLang;
};

i18n.use(initReactI18next).init({
  resources: {
    ru: { common: ruCommon },
    uk: { common: ukCommon },
  },
  lng: getInitialLanguage(),
  fallbackLng: "ru",
  ns: ["common"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
