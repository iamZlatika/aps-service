import { Controller, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ManagerSelect } from "@/features/orders/components/ManagerSelect.tsx";
import { useManagerOptions } from "@/features/users/hooks/useManagerOptions.ts";
import { DonorSaleFields } from "@/features/warehouse/components/order-actions/DonorSaleFields.tsx";
import { useSellDonor } from "@/features/warehouse/hooks/useSellDonor.ts";
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

interface SellDonorDialogProps {
  orderId: number;
  onClose: () => void;
}

/** The name comes from the donor card; the purchase is computed from the pick. */
export const SellDonorDialog = ({ orderId, onClose }: SellDonorDialogProps) => {
  const { t } = useTranslation();
  const { users, isLoadingUsers } = useManagerOptions({ activeOnly: true });
  const { methods, onSubmit, isPending } = useSellDonor({
    orderId,
    onSuccess: onClose,
  });
  const {
    control,
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
            <div className="flex flex-col gap-1">
              <Label>{t("warehouse.orderActions.manager")}</Label>
              <Controller
                name="managerId"
                control={control}
                render={({ field }) => (
                  <ManagerSelect
                    value={field.value}
                    onChange={field.onChange}
                    users={users}
                    isLoading={isLoadingUsers}
                  />
                )}
              />
              {errors.managerId && (
                <p className="text-sm text-destructive">
                  {errors.managerId.message}
                </p>
              )}
            </div>
            {errors.root && (
              <p className="text-sm text-destructive">{errors.root.message}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {t("warehouse.orderActions.sellDonorConfirm")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
