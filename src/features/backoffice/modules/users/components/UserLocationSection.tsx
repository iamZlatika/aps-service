import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { locationApi } from "@/features/backoffice/modules/dictionaries/api";
import { usersApi } from "@/features/backoffice/modules/users/api";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import { DeleteConfirmDialog } from "@/features/backoffice/widgets/table/components/dialogs";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { CardTitle } from "@/shared/components/ui/card.tsx";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";

interface UserLocationSectionProps {
  user: User;
}

export const UserLocationSection = ({ user }: UserLocationSectionProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [pendingLocationId, setPendingLocationId] = useState<number | null>(
    null,
  );

  const { data: locationsData } = useQuery({
    queryKey: queryKeys.dictionaries.locations(),
    queryFn: () => locationApi.getAll(1, 100),
  });

  const locations = locationsData?.items ?? [];
  const pendingLocation = locations.find((l) => l.id === pendingLocationId);

  const mutation = useMutation({
    mutationFn: (locationId: number) =>
      usersApi.updateLocation(locationId, user.id),
    onSuccess: () => {
      setPendingLocationId(null);
      return queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      });
    },
  });

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
                disabled={mutation.isPending}
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
          if (pendingLocationId !== null) mutation.mutate(pendingLocationId);
        }}
        isPending={mutation.isPending}
      />
    </>
  );
};
