import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation";
import { Button } from "@/shared/components/ui/button.tsx";

const ForbiddenPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex max-w-md flex-col items-center text-center gap-4">
        <AlertTriangle className="h-10 w-10 text-destructive" />

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">
            {t("errors.forbidden_title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("errors.forbidden_description")}
          </p>
        </div>

        <Button
          onClick={() => navigate(ORDERS_LINKS.root(), { replace: true })}
        >
          {t("errors.go_to_orders")}
        </Button>
      </div>
    </div>
  );
};

export default ForbiddenPage;
