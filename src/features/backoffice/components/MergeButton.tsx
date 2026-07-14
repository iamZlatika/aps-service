import { RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button";

interface MergeButtonProps {
  onClick: () => void;
}

export const MergeButton = ({ onClick }: MergeButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button variant="outline" className="h-9" onClick={onClick}>
      <RefreshCcw className="mr-2 h-4 w-4" />
      {t("table.merge_button")}
    </Button>
  );
};
