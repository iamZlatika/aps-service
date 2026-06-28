import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BaseSyntheticEvent } from "react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { worksApi } from "@/features/backoffice/modules/works/api";
import {
  type WorkEditFormValues,
  workEditSchema,
} from "@/features/backoffice/modules/works/lib/work-edit.schema.ts";
import { WORKS_LINKS } from "@/features/backoffice/modules/works/navigation.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

type UseEditWorkResult = {
  register: UseFormRegister<WorkEditFormValues>;
  control: Control<WorkEditFormValues>;
  errors: FieldErrors<WorkEditFormValues>;
  isPending: boolean;
  isLoading: boolean;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  onBack: () => void;
};

export const useEditWork = (workId: number): UseEditWorkResult => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: work, isLoading } = useQuery({
    queryKey: queryKeys.works.detail(workId),
    queryFn: () => worksApi.show(workId),
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<WorkEditFormValues>({
    resolver: zodResolver(workEditSchema),
    values: work
      ? {
          device_type: work.deviceType,
          manufacturer: work.manufacturer,
          device_model: work.deviceModel,
          description_ru: work.descriptionRu,
          description_uk: work.descriptionUk,
          reason_ru: work.reasonRu ?? "",
          reason_uk: work.reasonUk ?? "",
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (values: WorkEditFormValues) => worksApi.update(workId, values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.works.all });
      navigate(WORKS_LINKS.root());
    },
    onError: (error) => {
      if (!isApiError(error) || error.status !== 422) {
        notifyError(error);
      } else {
        handleFormError(error, setError);
      }
    },
  });

  const onBack = () => navigate(WORKS_LINKS.root());

  return {
    register,
    control,
    errors,
    isPending: mutation.isPending,
    isLoading,
    onSubmit: handleSubmit((values) => mutation.mutate(values)),
    onBack,
  };
};
