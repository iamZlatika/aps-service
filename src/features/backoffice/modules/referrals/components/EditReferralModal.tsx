import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useEditReferral } from "@/features/backoffice/modules/referrals/hooks/useEditReferral.ts";
import {
  type EditReferralFormValues,
  type EditReferralSchema,
  editReferralSchema,
} from "@/features/backoffice/modules/referrals/lib/schema.ts";
import type { Referral } from "@/features/backoffice/modules/referrals/types.ts";
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

interface EditReferralModalProps {
  open: boolean;
  onClose: () => void;
  referral: Referral;
}

export const EditReferralModal = ({
  open,
  onClose,
  referral,
}: EditReferralModalProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditReferralFormValues, unknown, EditReferralSchema>({
    resolver: zodResolver(editReferralSchema()),
    defaultValues: {
      commissionPercent: referral.commissionPercent,
    },
  });

  const { onSubmit, isPending } = useEditReferral(onClose);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent onEscapeKeyDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>
            {t("referrals.edit_modal.title_for", {
              name: referral.customer.name,
            })}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) =>
            onSubmit(referral.id, values, setError),
          )}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="commissionPercent">
              {t("referrals.edit_modal.commission_label")}
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
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {t("referrals.edit_modal.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
