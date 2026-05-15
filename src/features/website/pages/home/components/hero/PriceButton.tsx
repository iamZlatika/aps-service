import { useTranslation } from "react-i18next";

export const PriceButton = () => {
  const { t } = useTranslation("website");

  return (
    <button type="button" className="ws-btn ws-btn-ghost">
      {t("hero.ctaPricelist")}
    </button>
  );
};
