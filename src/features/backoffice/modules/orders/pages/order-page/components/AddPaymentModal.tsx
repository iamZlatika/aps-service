import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { usePaymentSubmit } from "@/features/backoffice/modules/orders/hooks/usePaymentSubmit.ts";
import {
  type NewPaymentFormValues,
  type NewPaymentSchema,
  newPaymentSchema,
} from "@/features/backoffice/modules/orders/lib/schema.ts";
import { usersApi } from "@/features/backoffice/modules/users/api";
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
import { PAYMENTS } from "@/shared/types.ts";

interface AddPaymentModalProps {
  orderId: number;
  open: boolean;
  onClose: () => void;
}

const AddPaymentModal = ({ orderId, open, onClose }: AddPaymentModalProps) => {
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
      type: PAYMENTS.PAYMENT,
      managerId: user?.id,
    },
  });

  const { onSubmit, isPending } = usePaymentSubmit({
    orderId,
    onSuccess: onClose,
  });

  const isRefund = useWatch({ control, name: "type" }) === PAYMENTS.REFUND;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("orders.payments.addPayment")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>{t("orders.payments.table.type")}</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PAYMENTS.PAYMENT}>
                      {t("orders.payments.types.payment")}
                    </SelectItem>
                    <SelectItem value={PAYMENTS.PREPAYMENT}>
                      {t("orders.payments.types.prepayment")}
                    </SelectItem>
                    <SelectItem value={PAYMENTS.REFUND}>
                      {t("orders.payments.types.refund")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

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
            <Label>{t("orders.payments.table.note")}</Label>
            <Input {...register("note")} />
          </div>

          <div className="flex flex-col gap-1">
            <Label>{t("orders.payments.table.manager")}</Label>
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
              {t("common.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentModal;
