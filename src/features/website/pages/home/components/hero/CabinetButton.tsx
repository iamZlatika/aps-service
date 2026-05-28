import { MoveRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CabinetButtonProps {
  onClick: () => void;
}

export const CabinetButton = ({ onClick }: CabinetButtonProps) => {
  const { t } = useTranslation("website");

  return (
    <button
      type="button"
      onClick={onClick}
      className="ws-btn ws-btn-primary justify-center"
    >
      {t("hero.ctaCabinet")}
      <MoveRight className="size-3.5" />
    </button>
  );
};
