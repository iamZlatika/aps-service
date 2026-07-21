import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AmountDescriptionModal } from "@/features/billing/components/AmountDescriptionModal.tsx";
import { SignedAmountInput } from "@/features/billing/components/SignedAmountInput.tsx";
import { useAdjustBalanceSubmit } from "@/features/billing/hooks/useAdjustBalanceSubmit.ts";
import { BILLING_DIRECTIONS } from "@/features/billing/lib/constants.ts";
import {
  type AdjustBalanceFormValues,
  type AdjustBalanceSchema,
  adjustBalanceSchema,
} from "@/features/billing/lib/schema.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

interface AdjustBalanceModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
}

export const AdjustBalanceModal = ({
  open,
  onClose,
  userId,
  userName,
}: AdjustBalanceModalProps) => {
  const { t } = useTranslation();

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AdjustBalanceFormValues, unknown, AdjustBalanceSchema>({
    resolver: zodResolver(adjustBalanceSchema()),
    defaultValues: {
      userId,
      direction: BILLING_DIRECTIONS.ACCRUE,
      amount: "",
      description: "",
    },
  });

  const { onSubmit, isPending } = useAdjustBalanceSubmit(onClose);

  return (
    <AmountDescriptionModal
      open={open}
      onClose={onClose}
      title={t("billing.adjust_modal.title_for", { name: userName })}
      submitLabel={t("billing.adjust_modal.submit")}
      isPending={isPending}
      rootError={errors.root?.message}
      onSubmit={handleSubmit((values) => onSubmit(values, setError))}
    >
      <div className="flex flex-col gap-1">
        <Controller
          name="direction"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2" role="group">
              <Button
                type="button"
                variant={
                  field.value === BILLING_DIRECTIONS.ACCRUE
                    ? "default"
                    : "outline"
                }
                className="flex-1"
                aria-pressed={field.value === BILLING_DIRECTIONS.ACCRUE}
                onClick={() => field.onChange(BILLING_DIRECTIONS.ACCRUE)}
              >
                {t("billing.adjust_modal.accrue")}
              </Button>
              <Button
                type="button"
                variant={
                  field.value === BILLING_DIRECTIONS.DEDUCT
                    ? "default"
                    : "outline"
                }
                className="flex-1"
                aria-pressed={field.value === BILLING_DIRECTIONS.DEDUCT}
                onClick={() => field.onChange(BILLING_DIRECTIONS.DEDUCT)}
              >
                {t("billing.adjust_modal.deduct")}
              </Button>
            </div>
          )}
        />
      </div>

      <SignedAmountInput
        control={control}
        register={register}
        label={t("billing.adjust_modal.amount")}
        error={errors.amount}
      />

      <div className="flex flex-col gap-1">
        <Label htmlFor="description">
          {t("billing.adjust_modal.description")}
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
