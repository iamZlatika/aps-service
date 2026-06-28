import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useProfileTelegram } from "@/features/website/modules/profile/hooks/useProfileTelegram";
import { type TelegramLink } from "@/features/website/modules/profile/types";
import { queryKeys } from "@/shared/api/queryKeys";

type UseTelegramSubscribeModalReturn = {
  telegramLink: TelegramLink | null;
  isPending: boolean;
};

export const useTelegramSubscribeModal = (
  open: boolean,
): UseTelegramSubscribeModalReturn => {
  const queryClient = useQueryClient();
  const { generateLink, telegramLink, isPending } = useProfileTelegram();

  const generateLinkRef = useRef(generateLink);
  generateLinkRef.current = generateLink;

  useEffect(() => {
    if (open) generateLinkRef.current();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    return () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.customer.me() });
    };
  }, [open, queryClient]);

  return { telegramLink, isPending };
};
