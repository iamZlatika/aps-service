import { FileQuestion } from "lucide-react";
import { useTranslation } from "react-i18next";

export const StatisticsEmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
      <FileQuestion className="h-8 w-8" />
      <span className="text-sm">{t("statistics.empty_period")}</span>
    </div>
  );
};
