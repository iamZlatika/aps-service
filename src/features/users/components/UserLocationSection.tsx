import { useTranslation } from "react-i18next";

import { useUpdateUserLocation } from "@/features/users/hooks/useUpdateUserLocation.ts";
import { type User } from "@/features/users/types.ts";
import { CardTitle } from "@/shared/components/ui/card.tsx";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import { cn } from "@/shared/lib/utils.ts";
import { DeleteConfirmDialog } from "@/widgets/table/components/dialogs";

interface UserLocationSectionProps {
  user: User;
  canManage: boolean;
}

export const UserLocationSection = ({
  user,
  canManage,
}: UserLocationSectionProps) => {
  const { t } = useTranslation();
  const {
    locations,
    pendingLocationId,
    setPendingLocationId,
    pendingLocation,
    updateLocation,
    isPending,
  } = useUpdateUserLocation(user.id);

  return (
    <>
      <div>
        <CardTitle className="text-xl font-bold mb-4 text-center">
          {t("users.table_fields.location")}
        </CardTitle>
        <div className="flex justify-around">
          {locations.map((location) => (
            <label
              key={location.id}
              htmlFor={`location-${location.id}`}
              className={cn(
                "flex select-none items-center gap-2",
                canManage ? "cursor-pointer" : "cursor-default",
              )}
            >
              <Checkbox
                id={`location-${location.id}`}
                checked={user.location?.id === location.id}
                onCheckedChange={(checked) => {
                  if (checked && canManage) setPendingLocationId(location.id);
                }}
                disabled={isPending || !canManage}
                className="h-5 w-5"
              />
              <span className="text-base">{location.name}</span>
            </label>
          ))}
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={pendingLocationId !== null}
        onOpenChange={(open) => {
          if (!open) setPendingLocationId(null);
        }}
        title={t("users.actions.change_location")}
        description={t("users.actions.change_location_confirm", {
          location: pendingLocation?.name ?? "",
        })}
        cancelLabel={t("users.actions.cancel")}
        confirmLabel={t("users.actions.confirm")}
        onConfirm={() => {
          if (pendingLocationId !== null) updateLocation(pendingLocationId);
        }}
        isPending={isPending}
      />
    </>
  );
};
