import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import type { UseFormSetError } from "react-hook-form";

import { customersApi } from "@/features/backoffice/modules/customers/api";
import type {
  Customer,
  NewPhone,
} from "@/features/backoffice/modules/customers/types.ts";
import type { BaseItem } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

export const useCustomerPhones = (
  customerId: number | null,
  customer: Customer | undefined,
) => {
  const [isAddOpened, setIsAddOpened] = useState(false);
  const [isDeleteOpened, setIsDeleteOpened] = useState(false);
  const [phoneToDelete, setPhoneToDelete] = useState<number | null>(null);

  const sortedPhones = customer?.phones
    .slice()
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(variables.customerId),
      });
    },
  });

  const addNewPhoneMutation = useMutation({
    mutationFn: (data: NewPhone) =>
      customersApi.addSecondaryPhone(customerId!, data),
    onSuccess: () => {
      setIsAddOpened(false);
      return queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(customerId!),
      });
    },
  });

  const handleAddPhone = useCallback(
    async (
      values: Partial<BaseItem>,
      setError: UseFormSetError<Record<string, string>>,
    ) => {
      try {
        await addNewPhoneMutation.mutateAsync({
          phoneNumber: values.phone as string,
        });
      } catch (error) {
        handleFormError(error, setError);
      }
    },
    [addNewPhoneMutation],
  );

  const deletePhoneMutation = useMutation({
    mutationFn: (phoneId: number) =>
      customersApi.deleteSecondaryPhone(customerId!, phoneId),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(customerId!),
      });
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
    sortedPhones,
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
