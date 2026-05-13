import { AlertCircle } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  getOrderItemInitialValues,
  getOrderItemModalTitle,
} from "@/features/backoffice/modules/orders/components/info-table/services.ts";
import { ManagerSelect } from "@/features/backoffice/modules/orders/components/ManagerSelect.tsx";
import { useAddOrderItemForm } from "@/features/backoffice/modules/orders/hooks/useAddOrderItemForm.ts";
import { useOrderItemSubmit } from "@/features/backoffice/modules/orders/hooks/useOrderItemSubmit.ts";
import type {
  OrderItem,
  OrderItemType,
} from "@/features/backoffice/modules/orders/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import SearchableSelect from "@/widgets/searchable-select";

interface AddOrderItemModalProps {
  orderId: number;
  type: OrderItemType;
  open: boolean;
  onClose: () => void;
  editItem?: OrderItem;
  readOnly?: boolean;
}

const AddOrderItemModal = ({
  orderId,
  type,
  open,
  onClose,
  editItem,
  readOnly,
}: AddOrderItemModalProps) => {
  const { t } = useTranslation();

  const initialValues = editItem
    ? getOrderItemInitialValues(editItem)
    : undefined;

  const {
    control,
    register,
    handleSubmit,
    errors,
    users,
    isLoadingUsers,
    fetchNameItems,
    nameQueryKey,
    onCreateNameItem,
    fetchSuppliers,
    onCreateSupplier,
  } = useAddOrderItemForm({ type, initialValues });

  const { onSubmit, isPending } = useOrderItemSubmit({
    orderId,
    type,
    editItemId: editItem?.id,
    onSuccess: onClose,
  });

  const title = getOrderItemModalTitle(t, type, !!editItem);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent onEscapeKeyDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {readOnly && (
          <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {type === "product"
              ? t("orders.orderTable.readOnly.product")
              : t("orders.orderTable.readOnly.service")}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <fieldset disabled={readOnly} className="contents">
            <div className="flex flex-col gap-1">
              <Label>{t("orders.orderTable.form.name")}</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    fetchItems={fetchNameItems}
                    queryKey={nameQueryKey}
                    onCreateItem={onCreateNameItem}
                    error={errors.name}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>{t("orders.orderTable.form.price")}</Label>
              <Input {...register("price")} inputMode="decimal" />
              {errors.price && (
                <p className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>
            {type === "product" && (
              <div className="flex flex-col gap-1">
                <Label>{t("orders.orderTable.form.purchasePrice")}</Label>
                <Input {...register("purchasePrice")} inputMode="decimal" />
              </div>
            )}
            {type === "service" && (
              <div className="flex flex-col gap-1">
                <Label>{t("orders.orderTable.form.costPrice")}</Label>
                <Input {...register("costPrice")} inputMode="decimal" />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Label>{t("orders.orderTable.form.quantity")}</Label>
              <Input
                {...register("quantity")}
                type="number"
                inputMode="numeric"
                min={1}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </div>
            {type === "product" && (
              <div className="flex flex-col gap-1">
                <Label>{t("orders.orderTable.form.supplierName")}</Label>
                <Controller
                  name="supplierName"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      fetchItems={fetchSuppliers}
                      queryKey={queryKeys.dictionaries.suppliers()}
                      onCreateItem={onCreateSupplier}
                    />
                  )}
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Label>{t("orders.orderTable.form.executor")}</Label>
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
            </div>
          </fieldset>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {editItem ? t("common.save") : t("common.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderItemModal;
