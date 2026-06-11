import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import { type BaseSyntheticEvent, useEffect, useRef } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type { FormValuesStorage } from "@/features/backoffice/modules/orders/hooks/useOrderEditingState.ts";
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
  formValuesStorage: FormValuesStorage,
): UseEditOrderInfoReturn => {
  const form = useForm<EditOrderInfoFormValues>({
    resolver: zodResolver(editOrderInfoSchema()),
    defaultValues: mapOrderInfoToEditFormValues(order),
  });

  const { reset } = form;
  const prevOrderIdRef = useRef(orderId);
  const formRef = useRef(form);
  formRef.current = form;

  useEffect(() => {
    const prevOrderId = prevOrderIdRef.current;
    prevOrderIdRef.current = orderId;

    if (prevOrderId === orderId) {
      const saved = formValuesStorage.get(orderId);
      if (saved) {
        formValuesStorage.delete(orderId);
        reset(mapOrderInfoToEditFormValues(order));
        reset(saved, { keepDefaultValues: true });
      } else {
        reset(mapOrderInfoToEditFormValues(order), { keepDirtyValues: true });
      }
    } else {
      const { dirtyFields } = formRef.current.formState;
      if (Object.keys(dirtyFields).length > 0) {
        formValuesStorage.set(prevOrderId, formRef.current.getValues());
      }
      const saved = formValuesStorage.get(orderId);
      if (saved) {
        formValuesStorage.delete(orderId);
        reset(mapOrderInfoToEditFormValues(order));
        reset(saved, { keepDefaultValues: true });
      } else {
        reset(mapOrderInfoToEditFormValues(order));
      }
    }
  }, [order, orderId, reset, formValuesStorage]);

  useEffect(() => {
    return () => {
      const { dirtyFields } = formRef.current.formState;
      if (Object.keys(dirtyFields).length > 0) {
        formValuesStorage.set(
          prevOrderIdRef.current,
          formRef.current.getValues(),
        );
      }
    };
  }, [formValuesStorage]);

  const mutation = useMutation({
    mutationFn: (data: EditOrderInfoFormValues) =>
      ordersApi.changeOrderInfo(orderId, data),
    onSuccess: () => {
      toast.success(i18next.t("orders.successUpdate"));
      formValuesStorage.delete(orderId);
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
