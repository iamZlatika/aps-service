import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { CallButton } from "@/features/website/components/CallButton";
import { MessengerLabelButton } from "@/features/website/components/MessengerLabelButton";
import { ModalHeader } from "@/features/website/components/ModalHeader";
import { MESSENGER_ICONS, MESSENGERS } from "@/features/website/config";
import { useLocations } from "@/features/website/hooks/useLocations";
import { getMessengerHref } from "@/features/website/lib/service";

interface ContactModalContentProps {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  text: string;
}

export const ContactModalContent = ({
  icon,
  eyebrow,
  title,
  text,
}: ContactModalContentProps) => {
  const { t } = useTranslation("website");
  const { locations } = useLocations();
  const phone = locations[0]?.phone;

  return (
    <>
      <ModalHeader icon={icon} eyebrow={eyebrow} title={title} />

      <div className="flex-1 px-7 pb-6 pt-5 max-sm:px-5">
        <p className="text-[15px] leading-[1.65] text-ws-ink">{text}</p>

        {phone && (
          <div className="mt-5 flex gap-2">
            {MESSENGERS.map((m) => {
              const Icon = MESSENGER_ICONS[m.key];
              return (
                <MessengerLabelButton
                  key={m.key}
                  href={getMessengerHref(m.key, phone)}
                  icon={<Icon />}
                  label={t(`messenger.${m.key}`)}
                  colorClass={m.colorClass}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-ws-line-soft bg-[color-mix(in_oklab,var(--ws-bg-2)_70%,var(--ws-bg))] px-7 py-[18px] max-sm:px-5">
        <DialogPrimitive.Close className="rounded-[11px] border border-ws-line px-[22px] py-[13px] text-sm font-semibold text-ws-ink transition-colors hover:border-ws-ink-mute">
          {t("priceModal.close")}
        </DialogPrimitive.Close>
        {phone && <CallButton phone={phone} />}
      </div>
    </>
  );
};
