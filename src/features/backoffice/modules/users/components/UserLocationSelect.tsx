import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { locationApi } from "@/features/backoffice/modules/dictionaries/api";
import { usersApi } from "@/features/backoffice/modules/users/api";
import type { User } from "@/features/backoffice/modules/users/types.ts";
import { DeleteConfirmDialog } from "@/features/backoffice/widgets/table/components/dialogs";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

type UserLocationSelectProps = {
  user: User;
};

export const UserLocationSelect = ({ user }: UserLocationSelectProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: locationsData } = useQuery({
    queryKey: queryKeys.dictionaries.locations(),
    queryFn: () => locationApi.getAll(1, 100),
  });

  const locations = locationsData?.items ?? [];

  const [pendingLocationId, setPendingLocationId] = useState<number | null>(
    null,
  );

  const mutation = useMutation({
    mutationFn: (locationId: number) =>
      usersApi.updateLocation(locationId, user.id),
    onSuccess: () => {
      setPendingLocationId(null);
      return queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  const pendingLocation = locations.find((l) => l.id === pendingLocationId);

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
          if (pendingLocationId !== null) {
            mutation.mutate(pendingLocationId);
          }
        }}
        isPending={mutation.isPending}
      />
    </>
  );
};
