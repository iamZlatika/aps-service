import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { quickOrdersApi } from "@/features/quick-orders/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseDeleteQuickOrderReturn = {
  onDelete: (id: number) => void;
  isPending: boolean;
};

export const useDeleteQuickOrder = (
  onSuccess?: () => void,
): UseDeleteQuickOrderReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => quickOrdersApi.deleteQuickOrder(id),
    onSuccess: () => {
      toast.success(i18next.t("common.deleteDialog.success"));
      onSuccess?.();
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing.all });
      return queryClient.invalidateQueries({
        queryKey: queryKeys.quickOrders.all,
      });
    },
  });

  return { onDelete: mutation.mutate, isPending: mutation.isPending };
};
