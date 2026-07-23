import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardTitle } from "@/shared/components/ui/card.tsx";
import { cn } from "@/shared/lib/utils.ts";

interface KpiTileProps {
  label: string;
  children: ReactNode;
  isNowLabel?: boolean;
  className?: string;
}

export const KpiTile = ({
  label,
  children,
  isNowLabel,
  className,
}: KpiTileProps) => {
  const { t } = useTranslation();

  return (
    <Card className={className}>
      <CardContent className="p-4 flex flex-col gap-1">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          {label}
          {isNowLabel && (
            <span
              className={cn(
                "rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground",
              )}
            >
              {t("statistics.now_label")}
            </span>
          )}
        </CardTitle>
        <div className="text-xl font-bold">{children}</div>
      </CardContent>
    </Card>
  );
};
