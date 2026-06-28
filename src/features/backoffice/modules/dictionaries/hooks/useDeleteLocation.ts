import { useMutation, useQueryClient } from "@tanstack/react-query";

import { locationApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { notifyError } from "@/shared/lib/errors/services.ts";

type UseDeleteLocationReturn = {
  deleteLocation: (id: number) => void;
  isPending: boolean;
};

export const useDeleteLocation = (
  onSuccess?: () => void,
): UseDeleteLocationReturn => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => locationApi.remove(id),
    onSuccess: () => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dictionaries.locations(),
      });
    },
    onError: (error) => notifyError(error),
  });

  return { deleteLocation: mutate, isPending };
};
