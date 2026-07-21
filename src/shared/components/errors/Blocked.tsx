import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

const BlockedPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive" />

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{t("errors.blocked_title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("errors.blocked_description")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockedPage;
