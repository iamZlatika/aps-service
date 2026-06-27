import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { TelegramIcon } from "@/features/website/components/icons/TelegramIcon";
import { WebsiteModal } from "@/features/website/components/WebsiteModal";
import { useTelegramSubscribeModal } from "@/features/website/modules/profile/hooks/useTelegramSubscribeModal";

interface TelegramSubscribeModalProps {
  open: boolean;
  onClose: () => void;
}

export const TelegramSubscribeModal = ({
  open,
  onClose,
}: TelegramSubscribeModalProps) => {
  const { t } = useTranslation("website");
  const { telegramLink, isPending } = useTelegramSubscribeModal(open);

  return (
    <WebsiteModal open={open} onClose={onClose} maxWidth="max-w-[420px]">
      <div className="px-8 pb-7 pt-8 text-center max-sm:px-5 max-sm:pb-5 max-sm:pt-6">
        <span
          aria-hidden="true"
          className="mx-auto mb-[18px] flex size-[54px] items-center justify-center rounded-[15px] bg-[#2aa3e3] text-white"
        >
          <TelegramIcon className="size-7" />
        </span>

        <h2 className="text-[21px] font-medium leading-[1.2] tracking-tight text-ws-ink">
          {t("cabinet.telegramModalTitle")}
        </h2>
        <p className="mt-[10px] text-pretty text-[13.5px] leading-[1.55] text-ws-ink-soft">
          {t("cabinet.telegramModalDesc")}
        </p>

        {isPending && (
          <div className="mt-[22px] flex justify-center">
            <Loader2 className="size-8 animate-spin text-ws-ink-mute" />
          </div>
        )}

        {!isPending && telegramLink && (
          <>
            <div className="mx-auto mt-[22px] flex size-[200px] items-center justify-center rounded-[16px] bg-white p-3">
              <img
                src={telegramLink.qrCode}
                alt={t("cabinet.telegramQrAlt")}
                className="size-full"
              />
            </div>
            <p className="mt-3 text-[12px] text-ws-ink-mute">
              {t("cabinet.telegramModalQrCaption")}
            </p>

            <a
              href={telegramLink.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[18px] flex w-full items-center justify-center gap-[9px] rounded-[12px] bg-[#2aa3e3] px-5 py-[14px] text-[15px] font-semibold text-white transition-transform hover:-translate-y-[1px]"
            >
              <TelegramIcon className="size-[17px]" />
              {t("cabinet.telegramModalOpenBtn")}
            </a>

            <p className="mt-[14px] text-[12px] leading-[1.5] text-ws-ink-mute">
              {t("cabinet.telegramModalHint")}
            </p>
          </>
        )}
      </div>
    </WebsiteModal>
  );
};
