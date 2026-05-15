import { MoveRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export const CabinetButton = () => {
  const { t } = useTranslation("website");

  return (
    <button type="button" className="ws-btn ws-btn-primary">
      {t("hero.ctaCabinet")}
      <MoveRight className="size-[14px]" />
    </button>
  );
};
