import { Frown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/components/ui/button.tsx";

const ForbiddenPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex max-w-md flex-col items-center text-center gap-6">
        <Frown className="h-16 w-16 text-muted-foreground" />

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {t("errors.forbidden_title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("errors.forbidden_description")}
          </p>
        </div>

        <Button onClick={() => navigate(-1)}>{t("errors.go_back")}</Button>
      </div>
    </div>
  );
};

export default ForbiddenPage;
