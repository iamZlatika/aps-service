import { MoveRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { WEBSITE_LINKS } from "@/features/website/navigation";

export const CabinetButton = () => {
  const { t } = useTranslation("website");

  return (
    <Link
      to={WEBSITE_LINKS.account}
      className="ws-btn ws-btn-primary justify-center"
    >
      {t("hero.ctaCabinet")}
      <MoveRight className="size-3.5" />
    </Link>
  );
};
