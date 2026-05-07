import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { ManagerSelect } from "@/features/backoffice/modules/orders/components/ManagerSelect.tsx";
import { usePaymentSubmit } from "@/features/backoffice/modules/orders/hooks/usePaymentSubmit.ts";
import {
  type NewPaymentFormValues,
  type NewPaymentSchema,
  newPaymentSchema,
} from "@/features/backoffice/modules/orders/lib/schema.ts";
import { usersApi } from "@/features/backoffice/modules/users/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { PAYMENT_METHODS, PAYMENTS, type PaymentType } from "@/shared/types.ts";

interface AddPaymentModalProps {
  orderId: number;
  type: PaymentType;
  open: boolean;
  onClose: () => void;
}

const AddPaymentModal = ({
  orderId,
  type,
  open,
  onClose,
}: AddPaymentModalProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => usersApi.getAll(1, 100),
  });
  const users = usersData?.items ?? [];

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPaymentFormValues, unknown, NewPaymentSchema>({
    resolver: zodResolver(newPaymentSchema()),
    defaultValues: {
      type,
      method: PAYMENT_METHODS.CASH,
      managerId: user?.id,
    },
  });

  const { onSubmit, isPending } = usePaymentSubmit({
    orderId,
    onSuccess: onClose,
  });

  const isRefund = type === PAYMENTS.REFUND;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent onEscapeKeyDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{t(`orders.payments.types.${type}`)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>{t("orders.payments.table.amount")}</Label>
            {isRefund ? (
              <div className="flex h-11 w-full rounded-md border border-input shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring">
                <span className="flex items-center px-3 border-r border-input bg-muted text-base rounded-l-md select-none">
                  −
                </span>
                <input
                  {...register("amount")}
                  inputMode="decimal"
                  className="flex-1 bg-transparent px-3 py-1 text-base placeholder:text-muted-foreground focus:outline-none rounded-r-md"
                />
              </div>
            ) : (
              <Input {...register("amount")} inputMode="decimal" />
            )}
            {errors.amount && (
              <p className="text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>{t("orders.payments.paymentMethod")}</Label>
            <Controller
              name="method"
              control={control}
              render={({ field }) => (
                <div className="flex gap-4 py-1">
                  {Object.values(PAYMENT_METHODS).map((method) => (
                    <label
                      key={method}
                      htmlFor={`method-${method}`}
                      className="flex cursor-pointer select-none items-center gap-1.5"
                    >
                      <Checkbox
                        id={`method-${method}`}
                        checked={field.value === method}
                        onCheckedChange={(checked) => {
                          if (checked) field.onChange(method);
                        }}
                      />
                      <span className="text-sm">
                        {t(`orders.paymentMethods.${method}`)}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>{t("orders.payments.table.note")}</Label>
            <Input {...register("note")} />
          </div>

          <div className="flex flex-col gap-1">
            <Label>{t("orders.payments.table.manager")}</Label>
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
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

export default AddPaymentModal;
