import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { WEBSITE_LINKS } from "@/features/website/navigation";

export const PriceButton = () => {
  const { t } = useTranslation("website");

  return (
    <Link
      to={WEBSITE_LINKS.priceList}
      className="ws-btn ws-btn-ghost justify-center"
    >
      {t("hero.ctaPricelist")}
    </Link>
  );
};
