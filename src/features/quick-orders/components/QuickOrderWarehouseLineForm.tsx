import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { NewQuickOrderItemSchema } from "@/features/quick-orders/lib/schema.ts";
import { SelectedWarehouseLine } from "@/features/warehouse/components/picker/SelectedWarehouseLine.tsx";
import { WarehouseLineFields } from "@/features/warehouse/components/picker/WarehouseLineFields.tsx";
import {
  type WarehouseLineFormValues,
  type WarehouseLineSchema,
  warehouseLineSchema,
} from "@/features/warehouse/lib/line.schema.ts";
import {
  getLineCostPrice,
  getWarehouseLineSource,
  isDonorPartSource,
} from "@/features/warehouse/lib/service.ts";
import type { WarehouseSearchResult } from "@/features/warehouse/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { DialogFooter } from "@/shared/components/ui/dialog.tsx";

interface QuickOrderWarehouseLineFormProps {
  result: WarehouseSearchResult;
  onBack: () => void;
  onSave: (item: NewQuickOrderItemSchema) => void;
  onClose: () => void;
}

export const QuickOrderWarehouseLineForm = ({
  result,
  onBack,
  onSave,
  onClose,
}: QuickOrderWarehouseLineFormProps) => {
  const { t } = useTranslation();
  const methods = useForm<
    WarehouseLineFormValues,
    unknown,
    WarehouseLineSchema
  >({
    resolver: zodResolver(warehouseLineSchema()),
    // The card price is only a default — a discount is normal.
    defaultValues: {
      price: result.price ?? "",
      quantity: "1",
      costPrice: result.purchasePrice ?? "",
    },
  });

  const onSubmit = (values: WarehouseLineSchema) => {
    const costPrice = getLineCostPrice(result, values.costPrice);
    onSave({
      ...getWarehouseLineSource(result),
      name: result.name,
      price: values.price,
      quantity: isDonorPartSource(result) ? 1 : values.quantity,
      // Shown in the draft row only; the DTO mapper never sends it for a
      // warehouse line — the backend copies it from the card.
      purchasePrice: costPrice ?? result.purchasePrice ?? "",
      // Donor part only: sent as cost_price, overwrites the part's card.
      costPrice: costPrice ?? "",
      warehouseDonorId: null,
      donorParts: [],
    });
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex min-w-0 flex-1 flex-col gap-4"
      >
        <SelectedWarehouseLine result={result} onChange={onBack} />
        <WarehouseLineFields isSinglePiece={isDonorPartSource(result)} />
        <DialogFooter className="mt-auto">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit">{t("common.add")}</Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
};
