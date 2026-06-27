import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { customerProfileApi } from "@/features/website/modules/profile/api";
import { type TelegramLink } from "@/features/website/modules/profile/types";
import { queryKeys } from "@/shared/api/queryKeys";
import { notifyError } from "@/shared/lib/errors/services";

type UseProfileTelegramReturn = {
  isPending: boolean;
  generateLink: () => void;
  telegramLink: TelegramLink | null;
  revokeLink: () => void;
  isRevokePending: boolean;
};

export const useProfileTelegram = (): UseProfileTelegramReturn => {
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: () => customerProfileApi.generateTelegramLink(),
    onError: (error) => notifyError(error),
  });

  const revokeMutation = useMutation({
    mutationFn: () => customerProfileApi.revokeTelegramLink(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.me() });
      toast.success(i18next.t("cabinet.telegramRevoked", { ns: "website" }));
    },
    onError: (error) => notifyError(error),
  });

  return {
    isPending: generateMutation.isPending,
    generateLink: () => generateMutation.mutate(),
    telegramLink: generateMutation.data ?? null,
    revokeLink: () => revokeMutation.mutate(),
    isRevokePending: revokeMutation.isPending,
  };
};
