import { Info, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLocations } from "@/features/website/hooks/useLocations";

export const PricePageCta = () => {
  const { t } = useTranslation("website");
  const { locations } = useLocations();
  const phone = locations[0]?.phone;

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex items-start gap-3 rounded-[14px] border border-dashed border-ws-line px-[22px] py-[18px] text-[12.5px] leading-[1.6] text-ws-ink-mute">
        <Info
          aria-hidden="true"
          className="mt-[1px] size-[17px] flex-shrink-0 text-ws-ember-bright"
        />
        <span>{t("priceModal.note")}</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-ws-line bg-[rgba(255,255,255,.015)] px-[26px] py-6">
        <p className="max-w-[440px] text-[15px] font-medium text-ws-ink text-pretty">
          <b className="font-semibold text-ws-ember-bright">
            {t("pricePage.ctaText")}
          </b>
        </p>
        {phone && (
          <a
            href={`tel:${phone}`}
            className="inline-flex flex-shrink-0 items-center gap-[9px] rounded-[12px] bg-gradient-to-b from-ws-ember-bright to-ws-ember px-[22px] py-[14px] text-[14.5px] font-semibold text-[var(--ws-ember-text)] shadow-[0_12px_30px_-12px_rgba(238,122,58,.55),inset_0_1px_0_rgba(255,255,255,.3)] transition-transform hover:-translate-y-px max-sm:w-full max-sm:justify-center"
          >
            <Phone aria-hidden="true" className="size-[15px]" />
            <span>{t("priceModal.callButton")}</span>
          </a>
        )}
      </div>
    </div>
  );
};
