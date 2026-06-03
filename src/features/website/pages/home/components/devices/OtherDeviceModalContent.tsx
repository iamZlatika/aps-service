import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

import { MessengerLabelButton } from "@/features/website/components/MessengerLabelButton";
import { MESSENGER_ICONS, MESSENGERS } from "@/features/website/config";
import { useLocations } from "@/features/website/hooks/useLocations";
import { getMessengerHref } from "@/features/website/lib/service";

import { type DeviceId } from "./DevicesData";
import { PriceModalHeader } from "./PriceModalHeader";

interface OtherDeviceModalContentProps {
  deviceId: DeviceId;
}

export const OtherDeviceModalContent = ({
  deviceId,
}: OtherDeviceModalContentProps) => {
  const { t } = useTranslation("website");
  const { locations } = useLocations();
  const phone = locations[0]?.phone;

  return (
    <>
      <PriceModalHeader
        deviceId={deviceId}
        title={t(`devices.items.${deviceId}.name`)}
      />

      <div className="flex-1 px-7 pb-6 pt-5 max-sm:px-5">
        <p className="text-[15px] leading-[1.65] text-ws-ink">
          {t("priceModal.otherText")}
        </p>

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
        {phone && (
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-[9px] rounded-[11px] bg-gradient-to-b from-ws-ember-bright to-ws-ember px-[22px] py-[13px] text-sm font-semibold text-[var(--ws-ember-text)] shadow-[0_12px_30px_-12px_rgba(238,122,58,.55),inset_0_1px_0_rgba(255,255,255,.3)] transition-transform hover:-translate-y-px max-sm:order-first max-sm:w-full max-sm:justify-center"
          >
            <Phone aria-hidden="true" className="size-[15px]" />
            <span>{t("priceModal.callButton")}</span>
          </a>
        )}
      </div>
    </>
  );
};
