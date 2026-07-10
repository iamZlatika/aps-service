import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { type CustomerTelegram } from "@/features/auth/website/types";
import { TelegramIcon } from "@/features/website/components/icons/TelegramIcon";
import { TelegramSubscribeModal } from "@/features/website/components/TelegramSubscribeModal";
import { useProfileTelegram } from "@/features/website/modules/profile/hooks/useProfileTelegram";

interface TelegramRowProps {
  telegram: CustomerTelegram | null;
  isPhoneVerified: boolean;
}

export const TelegramRow = ({
  telegram,
  isPhoneVerified,
}: TelegramRowProps) => {
  const { t } = useTranslation("website");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { revokeLink, isRevokePending } = useProfileTelegram();

  const isConnected = telegram?.isSubscribed ?? false;

  if (!isPhoneVerified) {
    return (
      <div className="flex items-center gap-[14px] rounded-[14px] border border-ws-line bg-[rgba(255,255,255,.015)] px-4 py-[14px]">
        <span
          aria-hidden="true"
          className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#2aa3e3]/40 text-white"
        >
          <TelegramIcon className="size-5" />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <b className="text-[14.5px] font-semibold text-ws-ink-mute">
            Telegram
          </b>
          <span className="text-[12px] leading-[1.5] text-ws-ink-mute">
            {t("cabinet.telegramRowNeedsVerification")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-[14px] rounded-[14px] border border-ws-line bg-[rgba(255,255,255,.015)] px-4 py-[14px]">
        <span
          aria-hidden="true"
          className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#2aa3e3] text-white"
        >
          <TelegramIcon className="size-5" />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <b className="text-[14.5px] font-semibold text-ws-ink">Telegram</b>
          <span
            className={
              isConnected
                ? "text-[12px] text-[#7fd49a]"
                : "text-[12px] text-ws-ink-mute"
            }
          >
            {isConnected
              ? t("cabinet.telegramRowConnected")
              : t("cabinet.telegramRowNotConnected")}
          </span>
        </div>

        {isConnected ? (
          <button
            type="button"
            disabled={isRevokePending}
            onClick={revokeLink}
            className="inline-flex shrink-0 cursor-pointer items-center gap-[6px] border-0 bg-transparent px-[10px] py-[10px] font-[inherit] text-[13.5px] font-semibold text-ws-red disabled:opacity-50"
          >
            {isRevokePending && (
              <Loader2
                className="size-[13px] animate-spin"
                aria-hidden="true"
              />
            )}
            {t("cabinet.telegramRowDisconnectBtn")}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 cursor-pointer rounded-[10px] border border-ws-line bg-transparent px-4 py-[10px] font-[inherit] text-[13.5px] font-semibold text-ws-ink transition-colors duration-150 hover:border-ws-ink-mute"
          >
            {t("cabinet.telegramBannerBtn")}
          </button>
        )}
      </div>

      {!isConnected && (
        <TelegramSubscribeModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
