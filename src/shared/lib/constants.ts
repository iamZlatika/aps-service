import { type Language } from "@/shared/types.ts";

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const DEFAULT_LANGUAGES: {
  backoffice: Language;
  client: Language;
} = {
  backoffice: (import.meta.env.VITE_BACKOFFICE_LANGUAGE as Language) || "ru",
  client: (import.meta.env.VITE_CLIENT_LANGUAGE as Language) || "uk",
};

export const STORAGE_KEYS = {
  BACKOFFICE_LANG: "backoffice_lang",
  WEBSITE_LANG: "website_lang",
};
