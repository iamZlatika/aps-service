import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import { type BaseSyntheticEvent, useEffect } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { mapOrderInfoToEditFormValues } from "@/features/backoffice/modules/orders/lib/adapters.ts";
import {
  type EditOrderInfoFormValues,
  editOrderInfoSchema,
} from "@/features/backoffice/modules/orders/lib/schema.ts";
import type { OrderInfo } from "@/features/backoffice/modules/orders/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

type UseEditOrderInfoReturn = {
  form: UseFormReturn<EditOrderInfoFormValues>;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
};

export const useEditOrderInfo = (
  orderId: number,
  order: OrderInfo,
  onSuccess: () => void,
): UseEditOrderInfoReturn => {
  const form = useForm<EditOrderInfoFormValues>({
    resolver: zodResolver(editOrderInfoSchema()),
    defaultValues: mapOrderInfoToEditFormValues(order),
  });

  const { reset } = form;

  useEffect(() => {
    reset(mapOrderInfoToEditFormValues(order), { keepDirtyValues: true });
  }, [order, reset]);

  const mutation = useMutation({
    mutationFn: (data: EditOrderInfoFormValues) =>
      ordersApi.changeOrderInfo(orderId, data),
    onSuccess: () => {
      toast.success(i18next.t("orders.successUpdate"));
      onSuccess();
      return queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(orderId),
      });
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      handleFormError(error, form.setError);
    }
  });

  return { form, onSubmit, isPending: mutation.isPending };
};
