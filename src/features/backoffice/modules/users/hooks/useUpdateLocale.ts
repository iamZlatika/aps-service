import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { usersApi } from "@/features/backoffice/modules/users/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { type UserLanguage } from "@/shared/types.ts";

export const useUpdateLocale = () => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  return useMutation({
    mutationFn: (locale: UserLanguage) => usersApi.updateLocale(locale),
    onSuccess: (_data, locale) => {
      i18n.changeLanguage(locale);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });
};
