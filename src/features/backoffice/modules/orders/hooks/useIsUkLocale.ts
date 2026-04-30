import { useTranslation } from "react-i18next";

export function useIsUkLocale(): boolean {
  const { i18n } = useTranslation();
  return i18n.language === "uk";
}
