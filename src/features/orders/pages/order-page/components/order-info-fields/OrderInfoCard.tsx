import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useEditOrderInfo } from "@/features/orders/hooks/useEditOrderInfo.ts";
import type { FormValuesStorage } from "@/features/orders/hooks/useOrderEditingState.ts";
import { useOrderFlags } from "@/features/orders/hooks/useOrderFlags.ts";
import type { OrderInfo } from "@/features/orders/types.ts";
import { AcceptButton } from "@/shared/components/common/buttons/AcceptButton.tsx";
import { CancelButton } from "@/shared/components/common/buttons/CancelButton.tsx";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card.tsx";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { Separator } from "@/shared/components/ui/separator.tsx";

import { OrderInfoFields } from "./OrderInfoFields.tsx";

interface OrderInfoCardProps {
  order: OrderInfo;
  isEditing: boolean;
  onStartEditing: () => void;
  onStopEditing: () => void;
  formValuesStorage: FormValuesStorage;
  canManage: boolean;
}

export const OrderInfoCard = ({
  order,
  isEditing,
  onStartEditing,
  onStopEditing,
  formValuesStorage,
  canManage,
}: OrderInfoCardProps) => {
  const { t } = useTranslation();

  const { toggleCalled, calledPending, toggleUrgent, urgentPending } =
    useOrderFlags(order.id);

  const { form, onSubmit, isPending } = useEditOrderInfo(
    order.id,
    order,
    onStopEditing,
    formValuesStorage,
  );

  const handleCancel = () => {
    form.reset();
    onStopEditing();
  };

  return (
    <Card className="p-2 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <CardTitle className="text-xl font-bold">
          {t("orders.orderInfo")}
        </CardTitle>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <AcceptButton
                type="button"
                onClick={onSubmit}
                disabled={isPending}
              />
              <CancelButton onClick={handleCancel} />
            </>
          ) : (
            canManage && (
              <button
                type="button"
                onClick={onStartEditing}
                className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )
          )}
        </div>
      </div>

      <CardContent className="p-0">
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="isCalled"
              checked={order.isCalled}
              onCheckedChange={(checked) => toggleCalled(checked === true)}
              disabled={calledPending || !canManage}
            />
            <Label htmlFor="isCalled">{t("orders.form.isCalled")}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isUrgent"
              checked={order.isUrgent}
              onCheckedChange={(checked) => toggleUrgent(checked === true)}
              disabled={urgentPending || !canManage}
            />
            <Label htmlFor="isUrgent">{t("orders.form.isUrgent")}</Label>
          </div>
        </div>

        <Separator className="mb-4 h-px bg-border" />
        <OrderInfoFields
          register={form.register}
          control={form.control}
          errors={form.formState.errors}
          order={order}
          isEditing={isEditing}
        />
      </CardContent>
    </Card>
  );
};
