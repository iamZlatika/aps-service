import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useQuickOrderDonorLine } from "@/features/quick-orders/hooks/useQuickOrderDonorLine.ts";
import type { NewQuickOrderItemSchema } from "@/features/quick-orders/lib/schema.ts";
import { DonorSaleFields } from "@/features/warehouse/components/order-actions/DonorSaleFields.tsx";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { stripNonDigits } from "@/shared/lib/utils.ts";

interface QuickOrderDonorDialogProps {
  onSave: (line: NewQuickOrderItemSchema) => void;
  onClose: () => void;
}

export const QuickOrderDonorDialog = ({
  onSave,
  onClose,
}: QuickOrderDonorDialogProps) => {
  const { t } = useTranslation();
  const { methods, onSubmit } = useQuickOrderDonorLine({
    onSave: (line) => {
      onSave(line);
      onClose();
    },
  });
  const {
    register,
    formState: { errors },
  } = methods;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("warehouse.orderActions.sellDonor")}</DialogTitle>
          <DialogDescription>
            {t("warehouse.orderActions.sellDonorDescription")}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DonorSaleFields />
            <div className="flex flex-col gap-1">
              <Label>{t("warehouse.orderActions.sellPrice")}</Label>
              <FormField
                inputMode="numeric"
                onInput={(e) => {
                  e.currentTarget.value = stripNonDigits(e.currentTarget.value);
                }}
                error={errors.price}
                {...register("price")}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button type="submit">{t("common.add")}</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
