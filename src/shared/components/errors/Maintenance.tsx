import { Cog } from "lucide-react";
import { useTranslation } from "react-i18next";

const MaintenancePage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <Cog className="h-16 w-16 animate-spin text-muted-foreground [animation-duration:6s]" />

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {t("errors.maintenance_title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("errors.maintenance_description")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
