import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { profileApi } from "@/features/profile/api";
import type { ChangeUserInfoFormValues } from "@/features/profile/profile.schema.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

type UseUpdateUserInfoReturn = {
  updateUserInfo: (data: ChangeUserInfoFormValues) => void;
  isPending: boolean;
};

export const useUpdateUserInfo = (
  setError: UseFormSetError<ChangeUserInfoFormValues>,
  onSuccess: () => void,
): UseUpdateUserInfoReturn => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: profileApi.updateUserInfo,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      onSuccess();
    },
    onError: (error) =>
      handleFormError<ChangeUserInfoFormValues>(error, setError, {
        fieldMap: { name: "name", email: "email" },
        messageMap: {
          "The email has already been taken.": t(
            "profile.user_info.email_taken",
          ),
        },
      }),
  });

  return { updateUserInfo: mutate, isPending };
};
