import { useState } from "react";
import { useTranslation } from "react-i18next";

import { type CustomerTelegram } from "@/features/auth/website/types";
import { TelegramIcon } from "@/features/website/components/icons/TelegramIcon";
import { TelegramSubscribeModal } from "@/features/website/components/TelegramSubscribeModal";
import { cn } from "@/shared/lib/utils";

interface TelegramBannerProps {
  telegram: CustomerTelegram | null;
}

export const TelegramBanner = ({ telegram }: TelegramBannerProps) => {
  const { t } = useTranslation("website");
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!telegram) return null;

  const isSubscribed = telegram.isSubscribed;

  return (
    <>
      <div
        className={cn(
          "mb-5 flex flex-wrap items-center gap-4 rounded-[16px] border px-5 py-4",
          isSubscribed
            ? "border-[rgba(93,184,111,.32)] bg-[rgba(93,184,111,.08)]"
            : "border-[color-mix(in_oklab,#2aa3e3_32%,var(--ws-line))] bg-[color-mix(in_oklab,#2aa3e3_9%,transparent)]",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-[12px] text-white",
            isSubscribed ? "bg-[#5db86f]" : "bg-[#2aa3e3]",
          )}
        >
          <TelegramIcon className="size-6" />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <b className="text-[14.5px] font-semibold tracking-[-0.005em] text-ws-ink">
            {isSubscribed
              ? t("cabinet.telegramSubscribedTitle")
              : t("cabinet.telegramBannerTitle")}
          </b>
          <span className="text-[12.5px] leading-[1.4] text-ws-ink-soft">
            {isSubscribed
              ? t("cabinet.telegramSubscribedDesc")
              : t("cabinet.telegramBannerDesc")}
          </span>
        </div>

        {!isSubscribed && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-[11px] bg-[#2aa3e3] px-[18px] py-[11px] text-[13.5px] font-semibold text-white transition-transform hover:-translate-y-[1px] max-[560px]:w-full max-[560px]:justify-center"
          >
            <TelegramIcon className="size-[15px]" />
            {t("cabinet.telegramBannerBtn")}
          </button>
        )}
      </div>

      {!isSubscribed && (
        <TelegramSubscribeModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
