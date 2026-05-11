import { useTranslation } from "react-i18next";

import { useUserRate } from "@/features/backoffice/modules/users/hooks/useUserRate.ts";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import {
  AcceptButton,
  CancelButton,
  EditButton,
} from "@/shared/components/common/buttons";
import { CardTitle } from "@/shared/components/ui/card.tsx";
import { Input } from "@/shared/components/ui/input.tsx";

interface UserRateSectionProps {
  user: User;
}

export const UserRateSection = ({ user }: UserRateSectionProps) => {
  const { t } = useTranslation();
  const { isEditing, isPending, register, onSubmit, handleEdit, handleCancel } =
    useUserRate(user);

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
          <EditButton onClick={handleEdit} />
        )}
      </div>

      <div className="grid grid-cols-3 divide-x divide-border">
        <div className="pr-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">
            {t("profile.services_percent")}
          </p>
          {isEditing ? (
            <Input
              {...register("servicesPercent", { valueAsNumber: true })}
              type="number"
              min={0}
              max={100}
              className="text-center"
            />
          ) : (
            <p className="text-lg font-semibold">{user.servicesPercent}%</p>
          )}
        </div>
        <div className="px-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">
            {t("profile.products_percent")}
          </p>
          {isEditing ? (
            <Input
              {...register("productsPercent", { valueAsNumber: true })}
              type="number"
              min={0}
              max={100}
              className="text-center"
            />
          ) : (
            <p className="text-lg font-semibold">{user.productsPercent}%</p>
          )}
        </div>
        <div className="pl-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">
            {t("profile.intake_percent")}
          </p>
          {isEditing ? (
            <Input
              {...register("intakePercent", { valueAsNumber: true })}
              type="number"
              min={0}
              max={100}
              className="text-center"
            />
          ) : (
            <p className="text-lg font-semibold">{user.intakePercent}%</p>
          )}
        </div>
      </div>
    </form>
  );
};
