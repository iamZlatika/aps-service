import { useTranslation } from "react-i18next";

import { WarehouseResultRow } from "@/features/warehouse/components/picker/WarehouseResultRow.tsx";
import type { WarehouseSearchResult } from "@/features/warehouse/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";

interface SelectedWarehouseLineProps {
  result: WarehouseSearchResult;
  onChange: () => void;
}

export const SelectedWarehouseLine = ({
  result,
  onChange,
}: SelectedWarehouseLineProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2 rounded-md border bg-muted/40 p-3">
      <WarehouseResultRow result={result} />
      <Button
        type="button"
        variant="link"
        size="sm"
        className="h-auto self-start p-0"
        onClick={onChange}
      >
        {t("warehouse.picker.change")}
      </Button>
    </div>
  );
};
