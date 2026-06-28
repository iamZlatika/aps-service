import { useTranslation } from "react-i18next";

import { useUpdateUserLocation } from "@/features/backoffice/modules/users/hooks/useUpdateUserLocation.ts";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import { DeleteConfirmDialog } from "@/features/backoffice/widgets/table/components/dialogs";
import { CardTitle } from "@/shared/components/ui/card.tsx";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";

interface UserLocationSectionProps {
  user: User;
}

export const UserLocationSection = ({ user }: UserLocationSectionProps) => {
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
              className="flex cursor-pointer select-none items-center gap-2"
            >
              <Checkbox
                id={`location-${location.id}`}
                checked={user.location?.id === location.id}
                onCheckedChange={(checked) => {
                  if (checked) setPendingLocationId(location.id);
                }}
                disabled={isPending}
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
