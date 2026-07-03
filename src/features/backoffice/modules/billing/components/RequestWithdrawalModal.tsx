import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AmountDescriptionModal } from "@/features/backoffice/modules/billing/components/AmountDescriptionModal.tsx";
import { useRequestWithdrawalSubmit } from "@/features/backoffice/modules/billing/hooks/useRequestWithdrawalSubmit.ts";
import {
  type RequestWithdrawalFormValues,
  type RequestWithdrawalSchema,
  requestWithdrawalSchema,
} from "@/features/backoffice/modules/billing/lib/schema.ts";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { formatMoney } from "@/shared/lib/utils.ts";

interface RequestWithdrawalModalProps {
  open: boolean;
  onClose: () => void;
  available: string;
}

export const RequestWithdrawalModal = ({
  open,
  onClose,
  available,
}: RequestWithdrawalModalProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RequestWithdrawalFormValues, unknown, RequestWithdrawalSchema>({
    resolver: zodResolver(requestWithdrawalSchema(available)),
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  const { onSubmit, isPending } = useRequestWithdrawalSubmit(onClose);

  return (
    <AmountDescriptionModal
      open={open}
      onClose={onClose}
      title={t("billing.withdrawal_modal.title")}
      submitLabel={t("billing.withdrawal_modal.submit")}
      isPending={isPending}
      rootError={errors.root?.message}
      onSubmit={handleSubmit((values) => onSubmit(values, setError))}
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="amount">{t("billing.withdrawal_modal.amount")}</Label>
        <Input
          id="amount"
          {...register("amount")}
          inputMode="decimal"
          autoFocus
        />
        <p className="text-sm text-muted-foreground">
          {t("billing.withdrawal_modal.available_hint", {
            available: formatMoney(available),
          })}
        </p>
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="description">
          {t("billing.withdrawal_modal.description")}
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
