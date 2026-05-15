import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ruCommon from "./locales/ru/common.json";
import ruWebsite from "./locales/ru/website.json";
import ukCommon from "./locales/uk/common.json";
import ukWebsite from "./locales/uk/website.json";

i18n.use(initReactI18next).init({
  resources: {
    ru: { common: ruCommon, website: ruWebsite },
    uk: { common: ukCommon, website: ukWebsite },
  },
  lng: "ru",
  fallbackLng: "ru",
  ns: ["common", "website"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
