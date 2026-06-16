import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type { OrderSearchPreset } from "@/features/backoffice/modules/orders/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { notifyError } from "@/shared/lib/errors/services.ts";

export const useOrderSearchPresets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const presets: OrderSearchPreset[] =
    (user?.searchPresets as OrderSearchPreset[] | undefined) ?? [];

  const { mutate: deletePreset, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => ordersApi.deleteSearchPreset(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() }),
    onError: (error) => notifyError(error),
  });

  const { mutate: reorderPresets } = useMutation({
    mutationFn: (ids: number[]) => ordersApi.reorderSearchPresets(ids),
    onError: (error) => notifyError(error),
  });

  return { presets, deletePreset, isDeleting, reorderPresets };
};
