import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import type { UseFormSetError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type { NewOrderSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation.ts";
import type { NewOrder } from "@/features/backoffice/modules/orders/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

type UseCreateOrderReturn = {
  onSubmit: (values: NewOrderSchema) => Promise<void>;
  isPending: boolean;
};

export const useCreateOrder = (
  setError: UseFormSetError<NewOrderSchema>,
  bypass: () => void,
): UseCreateOrderReturn => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: NewOrder) => ordersApi.addNewOrder(data),
    onSuccess: () => {
      bypass();
      toast.success(i18next.t("orders.successCreate"));
      navigate(ORDERS_LINKS.root());
      return queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });

  const onSubmit = async (values: NewOrderSchema) => {
    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      handleFormError(error, setError);
    }
  };

  return { onSubmit, isPending: mutation.isPending };
};
