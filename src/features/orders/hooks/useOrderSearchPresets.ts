import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { ordersApi } from "@/features/orders/api";
import { mapSearchPresetToOrderSearchPreset } from "@/features/orders/lib/adapters.ts";
import type { OrderSearchPreset } from "@/features/orders/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { notifyError } from "@/shared/lib/errors/services.ts";

export const useOrderSearchPresets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const searchPresets = user?.searchPresets;
  const presets: OrderSearchPreset[] = useMemo(
    () => (searchPresets ?? []).map(mapSearchPresetToOrderSearchPreset),
    [searchPresets],
  );

  const { mutate: deletePreset, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => ordersApi.deleteSearchPreset(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() }),
    onError: (error) => notifyError(error),
  });

  const { mutate: reorderPresets } = useMutation({
    mutationFn: (ids: number[]) => ordersApi.reorderSearchPresets(ids),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() }),
    onError: (error) => notifyError(error),
  });

  return { presets, deletePreset, isDeleting, reorderPresets };
};
