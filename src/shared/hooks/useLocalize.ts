import { useTranslation } from "react-i18next";

export function useLocalize(): (ru: string, ua: string) => string {
  const { i18n } = useTranslation();
  const isUk = i18n.language === "uk";
  return (ru, ua) => (isUk ? ua : ru);
}
