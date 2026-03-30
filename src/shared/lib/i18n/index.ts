import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ruCommon from "./locales/ru/common.json";
import ukCommon from "./locales/uk/common.json";

i18n.use(initReactI18next).init({
  resources: {
    ru: { common: ruCommon },
    uk: { common: ukCommon },
  },
  lng: "ru",
  fallbackLng: "ru",
  ns: ["common"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
