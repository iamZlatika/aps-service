import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useMakeReferral } from "@/features/backoffice/modules/referrals/hooks/useMakeReferral.ts";
import {
  type MakeReferralFormValues,
  type MakeReferralSchema,
  makeReferralSchema,
} from "@/features/backoffice/modules/referrals/lib/schema.ts";
import {
  type CustomerPickerMeta,
  fetchCustomersForReferral,
} from "@/features/backoffice/modules/referrals/lib/searchFetchers.ts";
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
import SearchableSelect, {
  type SearchableSelectOption,
} from "@/widgets/searchable-select";

type MakeReferralDialogPresetCustomer = {
  id: number;
  name: string;
};

interface MakeReferralDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  presetCustomer?: MakeReferralDialogPresetCustomer | null;
}

const renderCustomerOption = (
  option: SearchableSelectOption<CustomerPickerMeta>,
) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium">{option.name}</span>
    <span className="text-xs text-muted-foreground">
      {option.meta.phones.join(", ")}
    </span>
  </div>
);

export const MakeReferralDialog = ({
  isOpen,
  onOpenChange,
  presetCustomer = null,
}: MakeReferralDialogProps) => {
  const { t } = useTranslation();
  const [customerName, setCustomerName] = useState(presetCustomer?.name ?? "");

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<MakeReferralFormValues, unknown, MakeReferralSchema>({
    resolver: zodResolver(makeReferralSchema()),
    defaultValues: {
      customerId: presetCustomer?.id ?? 0,
      commissionPercent: "" as unknown as number,
    },
  });

  useEffect(() => {
    if (isOpen) {
      setCustomerName(presetCustomer?.name ?? "");
      reset({
        customerId: presetCustomer?.id ?? 0,
        commissionPercent: "" as unknown as number,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, presetCustomer?.id, presetCustomer?.name]);

  const { onSubmit, isPending } = useMakeReferral(() => {
    onOpenChange(false);
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent onEscapeKeyDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{t("referrals.make_referral_modal.title")}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => onSubmit(values, setError))}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label>{t("referrals.make_referral_modal.customer_label")}</Label>
            {presetCustomer ? (
              <span className="text-sm font-medium">{presetCustomer.name}</span>
            ) : (
              <SearchableSelect
                placeholder={t(
                  "referrals.make_referral_modal.customer_placeholder",
                )}
                value={customerName}
                onChange={setCustomerName}
                onSelect={(option) => setValue("customerId", option.id)}
                onClear={() => setValue("customerId", 0)}
                renderOption={renderCustomerOption}
                fetchItems={fetchCustomersForReferral}
                queryKey={queryKeys.referrals.searchByName()}
              />
            )}
            {errors.customerId && (
              <p className="text-sm text-destructive">
                {errors.customerId.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="commissionPercent">
              {t("referrals.make_referral_modal.commission_label")}
            </Label>
            <Input
              id="commissionPercent"
              type="number"
              min={0}
              max={100}
              {...register("commissionPercent")}
            />
            {errors.commissionPercent && (
              <p className="text-sm text-destructive">
                {errors.commissionPercent.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {t("referrals.make_referral_modal.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
