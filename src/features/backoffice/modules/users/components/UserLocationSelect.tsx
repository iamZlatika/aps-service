import { useTranslation } from "react-i18next";

import { useUpdateUserLocation } from "@/features/backoffice/modules/users/hooks/useUpdateUserLocation.ts";
import type { User } from "@/features/backoffice/modules/users/types.ts";
import { DeleteConfirmDialog } from "@/features/backoffice/widgets/table/components/dialogs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

interface UserLocationSelectProps {
  user: User;
}

export const UserLocationSelect = ({ user }: UserLocationSelectProps) => {
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
      <Select
        value={user.location?.id ? String(user.location.id) : ""}
        onValueChange={(val) => setPendingLocationId(Number(val))}
        disabled={!locations.length}
      >
        <SelectTrigger>
          <SelectValue placeholder="—" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((loc) => (
            <SelectItem key={loc.id} value={String(loc.id)}>
              {loc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
