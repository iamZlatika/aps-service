import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { usersApi } from "@/features/backoffice/modules/users/api";
import { type SalarySettings } from "@/features/backoffice/modules/users/lib/salarySettingsSchema.ts";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

export const useUserRate = (user: User) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset } = useForm<SalarySettings>({
    defaultValues: {
      servicesPercent: user.servicesPercent,
      productsPercent: user.productsPercent,
      intakePercent: user.intakePercent,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: SalarySettings) =>
      usersApi.updateSalarySettings(user.id, data),
    onSuccess: () => {
      setIsEditing(false);
      return queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(user.id),
      });
    },
  });

  const handleEdit = () => {
    reset({
      servicesPercent: user.servicesPercent,
      productsPercent: user.productsPercent,
      intakePercent: user.intakePercent,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const onSubmit = handleSubmit((data) => mutation.mutate(data));

  return {
    isEditing,
    isPending: mutation.isPending,
    register,
    onSubmit,
    handleEdit,
    handleCancel,
  };
};
