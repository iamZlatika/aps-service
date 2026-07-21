import { useMutation, useQueryClient } from "@tanstack/react-query";

import { worksApi } from "@/features/works/api";
import { queryKeys } from "@/shared/api/queryKeys";

type UseDeleteWorkReturn = {
  deleteWork: (id: number) => void;
  isPending: boolean;
};

export const useDeleteWork = (onSuccess?: () => void): UseDeleteWorkReturn => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => worksApi.delete(id),
    onSuccess: () => {
      onSuccess?.();
      return queryClient.invalidateQueries({ queryKey: queryKeys.works.all });
    },
  });

  return { deleteWork: mutate, isPending };
};
