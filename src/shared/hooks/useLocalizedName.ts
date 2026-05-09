import { useTranslation } from "react-i18next";

type LocalizedItem = { nameRu: string; nameUa: string };

export function useLocalizedName() {
  const { i18n } = useTranslation();
  const isUk = i18n.language === "uk";
  return (item: LocalizedItem) => (isUk ? item.nameUa : item.nameRu);
}
