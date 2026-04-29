import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import SearchableSelect from "@/features/backoffice/modules/orders/components/searchable-select";
import { useAddLineItemForm } from "@/features/backoffice/modules/orders/hooks/useAddLineItemForm.ts";
import { useLineItemSubmit } from "@/features/backoffice/modules/orders/hooks/useLineItemSubmit.ts";
import type { OrderLineItem } from "@/features/backoffice/modules/orders/types.ts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

type LineItemType = "product" | "service";

interface AddLineItemModalProps {
  orderId: number;
  type: LineItemType;
  open: boolean;
  onClose: () => void;
  editItem?: OrderLineItem;
}

const AddLineItemModal = ({
  orderId,
  type,
  open,
  onClose,
  editItem,
}: AddLineItemModalProps) => {
  const { t } = useTranslation();

  const initialValues = editItem
    ? {
        name: editItem.name,
        price: editItem.price,
        quantity: editItem.quantity,
        managerId: editItem.manager?.id,
        ...(editItem.type === "product"
          ? {
              purchasePrice: editItem.purchasePrice ?? "",
              supplierName: editItem.supplierName ?? "",
            }
          : {
              costPrice: editItem.costPrice ?? "",
            }),
      }
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
  } = useAddLineItemForm({ type, initialValues });

  const { onSubmit, isPending } = useLineItemSubmit({
    orderId,
    type,
    editItemId: editItem?.id,
    onSuccess: onClose,
  });

  const title = editItem
    ? type === "product"
      ? t("orders.orderTable.editProduct")
      : t("orders.orderTable.editService")
    : type === "product"
      ? t("orders.orderTable.addProduct")
      : t("orders.orderTable.addService");

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
              <p className="text-sm text-destructive">{errors.price.message}</p>
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
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(val) =>
                    field.onChange(val ? Number(val) : undefined)
                  }
                  disabled={!users.length || isLoadingUsers}
                >
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue
                      placeholder={isLoadingUsers ? t("loader.default") : "..."}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
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

export default AddLineItemModal;
