import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AmountDescriptionModal } from "@/features/backoffice/modules/billing/components/AmountDescriptionModal.tsx";
import { useAdjustSystemBalanceSubmit } from "@/features/backoffice/modules/billing/hooks/useAdjustSystemBalanceSubmit.ts";
import {
  type AdjustSystemBalanceFormValues,
  type AdjustSystemBalanceSchema,
  adjustSystemBalanceSchema,
} from "@/features/backoffice/modules/billing/lib/schema.ts";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

interface AdjustSystemBalanceModalProps {
  open: boolean;
  onClose: () => void;
}

export const AdjustSystemBalanceModal = ({
  open,
  onClose,
}: AdjustSystemBalanceModalProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<
    AdjustSystemBalanceFormValues,
    unknown,
    AdjustSystemBalanceSchema
  >({
    resolver: zodResolver(adjustSystemBalanceSchema()),
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  const { onSubmit, isPending } = useAdjustSystemBalanceSubmit(onClose);

  return (
    <AmountDescriptionModal
      open={open}
      onClose={onClose}
      title={t("billing.system_balance_modal.title")}
      submitLabel={t("billing.system_balance_modal.submit")}
      isPending={isPending}
      rootError={errors.root?.message}
      onSubmit={handleSubmit((values) => onSubmit(values, setError))}
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="amount">
          {t("billing.system_balance_modal.amount")}
        </Label>
        <Input
          id="amount"
          {...register("amount")}
          inputMode="decimal"
          autoFocus
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="description">
          {t("billing.system_balance_modal.description")}
        </Label>
        <Input id="description" {...register("description")} maxLength={255} />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>
    </AmountDescriptionModal>
  );
};
