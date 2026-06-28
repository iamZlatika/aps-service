import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type { FilterPresetFormValues } from "@/features/backoffice/modules/orders/lib/filterPresetSchema.ts";
import type { OrderPresetFilters } from "@/features/backoffice/modules/orders/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { notifyError } from "@/shared/lib/errors/services.ts";

function mapFormToFilters(data: FilterPresetFormValues): OrderPresetFilters {
  const filters: OrderPresetFilters = {
    page: 1,
    per_page: 20,
    sort_type: "desc",
  };

  if (data.status_ids.length > 0) filters.status_ids = data.status_ids;
  if (data.location_id !== null) filters.location_id = data.location_id;
  if (data.manager_id !== null) filters.manager_id = data.manager_id;
  if (data.is_urgent !== null) filters.is_urgent = data.is_urgent;
  if (data.any_match !== null) filters.any_match = data.any_match;

  return filters;
}

interface UseCreateFilterPresetOptions {
  onSuccess?: () => void;
}

export const useCreateFilterPreset = ({
  onSuccess,
}: UseCreateFilterPresetOptions = {}) => {
  const queryClient = useQueryClient();

  const { mutate: createPreset, isPending: isCreating } = useMutation({
    mutationFn: (data: FilterPresetFormValues) =>
      ordersApi.createSearchPreset({
        name: data.name,
        filters: mapFormToFilters(data),
      }),
    onSuccess: async () => {
      toast.success(i18next.t("common.successAdd"));
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      onSuccess?.();
    },
    onError: (error) => notifyError(error),
  });

  return { createPreset, isCreating };
};
