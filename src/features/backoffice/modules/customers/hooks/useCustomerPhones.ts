import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import type { UseFormSetError } from "react-hook-form";

import { customersApi } from "@/features/backoffice/modules/customers/api";
import type {
  Customer,
  NewPhone,
} from "@/features/backoffice/modules/customers/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

export const useCustomerPhones = (
  customerId: number,
  customer: Customer | undefined,
  onSuccess?: () => void,
) => {
  const [isAddOpened, setIsAddOpened] = useState(false);
  const [isDeleteOpened, setIsDeleteOpened] = useState(false);
  const [phoneToDelete, setPhoneToDelete] = useState<number | null>(null);

  const phones = customer?.phones;

  const phoneNumberToDelete = phoneToDelete
    ? (customer?.phones.find((p) => p.id === phoneToDelete)?.phoneNumber ?? "")
    : "";

  const changeIsPrimaryMutation = useMutation({
    mutationFn: ({
      customerId: cId,
      phoneId,
    }: {
      customerId: number;
      phoneId: number;
    }) => customersApi.changePrimaryPhone(cId, phoneId),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(variables.customerId),
      });
      onSuccess?.();
    },
  });

  const addNewPhoneMutation = useMutation({
    mutationFn: (data: NewPhone) =>
      customersApi.addSecondaryPhone(customerId, data),
    onSuccess: async () => {
      setIsAddOpened(false);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(customerId),
      });
      onSuccess?.();
    },
  });

  const handleAddPhone = useCallback(
    async (
      values: Record<string, unknown>,
      setError: UseFormSetError<Record<string, string>>,
    ) => {
      try {
        await addNewPhoneMutation.mutateAsync({
          phoneNumber: values.phone as string,
        });
      } catch (error) {
        handleFormError(error, setError, {
          fieldMap: { phone_number: "phone" },
        });
      }
    },
    [addNewPhoneMutation],
  );

  const deletePhoneMutation = useMutation({
    mutationFn: (phoneId: number) =>
      customersApi.deleteSecondaryPhone(customerId, phoneId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(customerId),
      });
      onSuccess?.();
    },
  });

  const handleDeletePhone = useCallback(() => {
    if (phoneToDelete === null) return;
    deletePhoneMutation.mutate(phoneToDelete);
    setPhoneToDelete(null);
    setIsDeleteOpened(false);
  }, [deletePhoneMutation, phoneToDelete]);

  const openDeleteDialog = useCallback((phoneId: number) => {
    setPhoneToDelete(phoneId);
    setIsDeleteOpened(true);
  }, []);

  return {
    phones,
    phoneNumberToDelete,
    isAddOpened,
    setIsAddOpened,
    isDeleteOpened,
    setIsDeleteOpened,
    handleAddPhone,
    handleDeletePhone,
    openDeleteDialog,
    changeIsPrimaryMutation,
    isAddPending: addNewPhoneMutation.isPending,
    isDeletePending: deletePhoneMutation.isPending,
  };
};
