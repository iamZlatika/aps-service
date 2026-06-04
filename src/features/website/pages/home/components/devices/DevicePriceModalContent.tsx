import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Info, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { PriceRow } from "@/features/website/components/PriceRow";
import { useLocations } from "@/features/website/hooks/useLocations";
import { usePriceList } from "@/features/website/hooks/usePriceList";
import { useLocalize } from "@/shared/hooks/useLocalize";
import { cn } from "@/shared/lib/utils";

import { type DeviceId } from "./DevicesData";
import { PriceModalHeader } from "./PriceModalHeader";

interface DevicePriceModalContentProps {
  deviceId: DeviceId;
  categories: readonly string[];
}

export const DevicePriceModalContent = ({
  deviceId,
  categories,
}: DevicePriceModalContentProps) => {
  const { t } = useTranslation("website");
  const localize = useLocalize();
  const { priceList } = usePriceList(categories);
  const { locations } = useLocations();

  const groups = useMemo(
    () =>
      categories
        .map((key) => ({
          key,
          category: priceList.find((item) => item.category.key === key)
            ?.category,
          items: priceList.filter((item) => item.category.key === key),
        }))
        .filter((g) => g.items.length > 0),
    [categories, priceList],
  );

  const [activeKey, setActiveKey] = useState<string>(groups[0]?.key ?? "");
  const activeGroup = groups.find((g) => g.key === activeKey) ?? groups[0];
  const phone = locations[0]?.phone;

  return (
    <>
      <PriceModalHeader
        deviceId={deviceId}
        title={
          activeGroup?.category
            ? localize(activeGroup.category.nameRu, activeGroup.category.nameUk)
            : t(`devices.items.${deviceId}.name`)
        }
      />

      {groups.length > 1 && (
        <div className="flex flex-wrap gap-1.5 border-b border-ws-line-soft px-7 pb-4 pt-[18px] max-sm:px-5">
          {groups.map((g) => (
            <button
              key={g.key}
              type="button"
              aria-pressed={activeKey === g.key}
              onClick={() => setActiveKey(g.key)}
              className={cn(
                "whitespace-nowrap rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-all",
                activeKey === g.key
                  ? "border-ws-cream bg-ws-cream text-ws-bg"
                  : "border-ws-line text-ws-ink-soft hover:border-ws-ink-mute hover:text-ws-ink",
              )}
            >
              {g.category
                ? localize(g.category.nameRu, g.category.nameUk)
                : g.key}
            </button>
          ))}
        </div>
      )}

      <div
        role="region"
        aria-label={t("priceModal.eyebrow")}
        className="min-h-0 flex-1 overflow-y-auto px-7 pb-2 pt-1.5 max-sm:px-5"
      >
        {activeGroup?.items.map((item) => (
          <PriceRow key={item.id} item={item} />
        ))}
        <div className="flex items-start gap-[11px] pb-3 pt-4 text-[12px] leading-[1.6] text-ws-ink-mute">
          <Info
            aria-hidden="true"
            className="mt-[1px] size-[15px] flex-shrink-0 text-ws-ember-bright"
          />
          <span>{t("priceModal.note")}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 border-t border-ws-line-soft bg-[color-mix(in_oklab,var(--ws-bg-2)_70%,var(--ws-bg))] px-7 py-[18px] max-sm:px-5">
        <span className="flex-1 text-[12.5px] text-ws-ink-mute">
          {t("priceModal.hint")}
        </span>
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
