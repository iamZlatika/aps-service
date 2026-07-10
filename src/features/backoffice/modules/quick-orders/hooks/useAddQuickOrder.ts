import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import type { UseFormSetError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { quickOrdersApi } from "@/features/backoffice/modules/quick-orders/api";
import type {
  NewQuickOrderFormValues,
  NewQuickOrderSchema,
} from "@/features/backoffice/modules/quick-orders/lib/schema.ts";
import { QUICK_ORDERS_LINKS } from "@/features/backoffice/modules/quick-orders/navigation.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

type UseAddQuickOrderReturn = {
  onSubmit: (values: NewQuickOrderSchema) => void;
  isPending: boolean;
};

export const useAddQuickOrder = (
  setError: UseFormSetError<NewQuickOrderFormValues>,
  bypass: () => void,
): UseAddQuickOrderReturn => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: NewQuickOrderSchema) =>
      quickOrdersApi.addNewQuickOrder(data),
    onSuccess: () => {
      bypass();
      toast.success(i18next.t("quickOrders.successCreate"));
      navigate(QUICK_ORDERS_LINKS.root());
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing.all });
      return queryClient.invalidateQueries({
        queryKey: queryKeys.quickOrders.all,
      });
    },
    onError: (error) => {
      if (isApiError(error) && error.status === 422) {
        handleFormError(error, setError);
      } else {
        notifyError(error);
      }
    },
  });

  const onSubmit = (values: NewQuickOrderSchema) => {
    mutation.mutate(values);
  };

  return { onSubmit, isPending: mutation.isPending };
};
