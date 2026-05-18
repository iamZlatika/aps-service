import { MoveRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { WEBSITE_ROUTES } from "@/features/website/routes";

export const CabinetButton = () => {
  const { t } = useTranslation("website");

  return (
    <Link
      to={WEBSITE_ROUTES.account}
      className="ws-btn ws-btn-primary justify-center"
    >
      {t("hero.ctaCabinet")}
      <MoveRight className="size-[14px]" />
    </Link>
  );
};
