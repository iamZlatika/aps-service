import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AmountDescriptionModal } from "@/features/backoffice/modules/billing/components/AmountDescriptionModal.tsx";
import { useAdjustReferralBalanceSubmit } from "@/features/backoffice/modules/referrals/hooks/useAdjustReferralBalanceSubmit.ts";
import { REFERRAL_DIRECTIONS } from "@/features/backoffice/modules/referrals/lib/constants.ts";
import {
  type AdjustReferralBalanceFormValues,
  type AdjustReferralBalanceSchema,
  adjustReferralBalanceSchema,
} from "@/features/backoffice/modules/referrals/lib/schema.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

interface AdjustReferralBalanceModalProps {
  open: boolean;
  onClose: () => void;
  referralId: number;
  customerName: string;
}

export const AdjustReferralBalanceModal = ({
  open,
  onClose,
  referralId,
  customerName,
}: AdjustReferralBalanceModalProps) => {
  const { t } = useTranslation();

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<
    AdjustReferralBalanceFormValues,
    unknown,
    AdjustReferralBalanceSchema
  >({
    resolver: zodResolver(adjustReferralBalanceSchema()),
    defaultValues: {
      direction: REFERRAL_DIRECTIONS.ACCRUE,
      amount: "",
      description: "",
    },
  });

  const { onSubmit, isPending } = useAdjustReferralBalanceSubmit(onClose);

  return (
    <AmountDescriptionModal
      open={open}
      onClose={onClose}
      title={t("referrals.adjust_modal.title_for", { name: customerName })}
      submitLabel={t("referrals.adjust_modal.submit")}
      isPending={isPending}
      rootError={errors.root?.message}
      onSubmit={handleSubmit((values) =>
        onSubmit(referralId, values, setError),
      )}
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
                  field.value === REFERRAL_DIRECTIONS.ACCRUE
                    ? "default"
                    : "outline"
                }
                className="flex-1"
                aria-pressed={field.value === REFERRAL_DIRECTIONS.ACCRUE}
                onClick={() => field.onChange(REFERRAL_DIRECTIONS.ACCRUE)}
              >
                {t("referrals.adjust_modal.accrue")}
              </Button>
              <Button
                type="button"
                variant={
                  field.value === REFERRAL_DIRECTIONS.DEDUCT
                    ? "default"
                    : "outline"
                }
                className="flex-1"
                aria-pressed={field.value === REFERRAL_DIRECTIONS.DEDUCT}
                onClick={() => field.onChange(REFERRAL_DIRECTIONS.DEDUCT)}
              >
                {t("referrals.adjust_modal.deduct")}
              </Button>
            </div>
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="amount">{t("referrals.adjust_modal.amount")}</Label>
        <Input id="amount" inputMode="decimal" {...register("amount")} />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="description">
          {t("referrals.adjust_modal.description")}
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
