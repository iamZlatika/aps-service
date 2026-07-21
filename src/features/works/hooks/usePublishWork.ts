import { useMutation, useQueryClient } from "@tanstack/react-query";

import { worksApi } from "@/features/works/api";
import { queryKeys } from "@/shared/api/queryKeys";

type UsePublishWorkReturn = {
  publishWork: (id: number, isPublished: boolean) => void;
  isPending: boolean;
};

export const usePublishWork = (
  onSuccess?: () => void,
): UsePublishWorkReturn => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, isPublished }: { id: number; isPublished: boolean }) =>
      worksApi.setPublished(id, { is_published: isPublished }),
    onSuccess: () => {
      onSuccess?.();
      return queryClient.invalidateQueries({ queryKey: queryKeys.works.all });
    },
  });

  return {
    publishWork: (id, isPublished) => mutate({ id, isPublished }),
    isPending,
  };
};
