import { useTranslation } from "react-i18next";

import { useUserRate } from "@/features/backoffice/modules/users/hooks/useUserRate.ts";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import {
  AcceptButton,
  CancelButton,
  EditButton,
} from "@/shared/components/common/buttons";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { CardTitle } from "@/shared/components/ui/card.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

interface UserRateSectionProps {
  user: User;
  canManage: boolean;
}

export const UserRateSection = ({ user, canManage }: UserRateSectionProps) => {
  const { t } = useTranslation();
  const {
    isEditing,
    isPending,
    register,
    errors,
    onSubmit,
    handleEdit,
    handleCancel,
  } = useUserRate(user);

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center justify-center mb-4 gap-2">
        <CardTitle className="text-xl font-bold">
          {t("profile.master_rate")}
        </CardTitle>
        {isEditing ? (
          <div className="flex items-center">
            <AcceptButton type="submit" disabled={isPending} />
            <CancelButton onClick={handleCancel} disabled={isPending} />
          </div>
        ) : (
          canManage && <EditButton onClick={handleEdit} />
        )}
      </div>

      <div className="grid grid-cols-3 divide-x divide-border">
        <div className="pr-6 text-center">
          <Label
            htmlFor="servicesPercent"
            className="block text-sm font-normal text-muted-foreground mb-1"
          >
            {t("profile.services_percent")}
          </Label>
          {isEditing ? (
            <FormField
              {...register("servicesPercent", { valueAsNumber: true })}
              id="servicesPercent"
              type="number"
              min={0}
              max={100}
              className="text-center"
              error={errors.servicesPercent}
            />
          ) : (
            <p className="text-lg font-semibold">
              {user.servicesPercent ?? "—"}
              {user.servicesPercent !== null && "%"}
            </p>
          )}
        </div>
        <div className="px-6 text-center">
          <Label
            htmlFor="productsPercent"
            className="block text-sm font-normal text-muted-foreground mb-1"
          >
            {t("profile.products_percent")}
          </Label>
          {isEditing ? (
            <FormField
              {...register("productsPercent", { valueAsNumber: true })}
              id="productsPercent"
              type="number"
              min={0}
              max={100}
              className="text-center"
              error={errors.productsPercent}
            />
          ) : (
            <p className="text-lg font-semibold">
              {user.productsPercent ?? "—"}
              {user.productsPercent !== null && "%"}
            </p>
          )}
        </div>
        <div className="pl-6 text-center">
          <Label
            htmlFor="intakePercent"
            className="block text-sm font-normal text-muted-foreground mb-1"
          >
            {t("profile.intake_percent")}
          </Label>
          {isEditing ? (
            <FormField
              {...register("intakePercent", { valueAsNumber: true })}
              id="intakePercent"
              type="number"
              min={0}
              max={100}
              className="text-center"
              error={errors.intakePercent}
            />
          ) : (
            <p className="text-lg font-semibold">
              {user.intakePercent ?? "—"}
              {user.intakePercent !== null && "%"}
            </p>
          )}
        </div>
      </div>
      {canManage && (
        <p className="text-xs text-muted-foreground mt-2">
          {t("profile.rate_help")}
        </p>
      )}
    </form>
  );
};
