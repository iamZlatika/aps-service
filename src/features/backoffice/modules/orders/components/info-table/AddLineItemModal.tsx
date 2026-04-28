import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAddLineItem } from "@/features/backoffice/modules/orders/hooks/useAddLineItem.ts";
import {
  type NewLineItemFormValues,
  type NewLineItemSchema,
  newLineItemSchema,
} from "@/features/backoffice/modules/orders/lib/schema.ts";
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

type LineItemType = "product" | "service";

interface AddLineItemModalProps {
  orderId: number;
  type: LineItemType;
  open: boolean;
  onClose: () => void;
}

const AddLineItemModal = ({
  orderId,
  type,
  open,
  onClose,
}: AddLineItemModalProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewLineItemFormValues, unknown, NewLineItemSchema>({
    resolver: zodResolver(newLineItemSchema()),
    defaultValues: { quantity: 1 },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const { onSubmit, isPending } = useAddLineItem(orderId, type, handleClose);

  const title =
    type === "product"
      ? t("orders.orderTable.addProduct")
      : t("orders.orderTable.addService");

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>{t("orders.orderTable.form.name")}</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
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
              <Input {...register("supplierName")} />
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {t("common.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLineItemModal;
