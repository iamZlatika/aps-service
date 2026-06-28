import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersApi } from "@/features/backoffice/modules/users/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { type UserStatus } from "@/shared/types.ts";

type UseUpdateUserStatusReturn = {
  updateStatus: (id: number, status: UserStatus) => void;
  isPending: boolean;
};

export const useUpdateUserStatus = (
  onSuccess?: () => void,
): UseUpdateUserStatusReturn => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: UserStatus }) =>
      usersApi.updateUserStatus(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      onSuccess?.();
    },
  });

  return {
    updateStatus: (id, status) => mutate({ id, status }),
    isPending,
  };
};
