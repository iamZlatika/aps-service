import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  WARRANTY_CARDS,
  WARRANTY_SECTIONS,
} from "@/features/website/pages/warranty/WarrantyPageData";
import { WarrantySection } from "@/features/website/pages/warranty/WarrantySection";

export const WarrantyPage = () => {
  const { t } = useTranslation("website");

  return (
    <section
      className="ws-section ws-warranty-section"
      aria-labelledby="warranty-heading"
    >
      <div className="ws-wrap max-w-[920px]">
        <header className="mb-9 max-w-[820px]">
          <p className="ws-section-eyebrow">{t("warranty.eyebrow")}</p>
          <h1
            id="warranty-heading"
            className="font-light text-[clamp(26px,3.4vw,42px)] leading-[1.12] tracking-[-0.02em] text-ws-ink [text-wrap:balance]"
          >
            {t("warranty.titlePrefix")}{" "}
            <strong className="font-semibold text-ws-cream">
              {t("warranty.titleBold")}
            </strong>
          </h1>
          <p className="mt-4 max-w-[640px] text-ws-body leading-[1.6] text-ws-ink-soft [text-wrap:pretty]">
            {t("warranty.intro")}
          </p>
        </header>

        <div className="mb-12 grid grid-cols-3 gap-4 max-[780px]:grid-cols-1">
          {WARRANTY_CARDS.map(({ id, Icon, valueKey, unitKey, textKey }) => (
            <div
              key={id}
              className="rounded-[16px] border border-ws-line bg-ws-card p-6"
            >
              <div
                aria-hidden="true"
                className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-[11px] border border-[color-mix(in_oklab,var(--ws-ember)_24%,transparent)] bg-[color-mix(in_oklab,var(--ws-ember)_12%,transparent)] text-ws-ember-bright"
              >
                <Icon className="size-5" />
              </div>
              <div className="font-light text-[26px] leading-none tracking-[-0.02em] text-ws-ink">
                {unitKey ? (
                  <>
                    <strong className="font-semibold text-ws-ember-bright">
                      {t(valueKey)}
                    </strong>{" "}
                    {t(unitKey)}
                  </>
                ) : (
                  <strong className="font-semibold text-ws-ember-bright">
                    {t(valueKey)}
                  </strong>
                )}
              </div>
              <div className="mt-2 text-ws-sm leading-[1.45] text-ws-ink-soft [text-wrap:pretty]">
                {t(textKey)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {WARRANTY_SECTIONS.map((section, index) => (
            <WarrantySection
              key={section.id}
              index={index}
              titleKey={section.titleKey}
              introKey={section.introKey}
              itemsKey={section.itemsKey}
              style={section.style}
              ratesAfterIndex={section.ratesAfterIndex}
              defaultOpen={index === 0}
            />
          ))}
        </div>

        <div className="mt-7 flex items-start gap-3 rounded-[14px] border border-dashed border-ws-line px-[22px] py-[18px] text-ws-sm leading-[1.6] text-ws-ink-mute [text-wrap:pretty]">
          <Info className="mt-0.5 size-[17px] shrink-0 text-ws-ember-bright" />
          <span>{t("warranty.note")}</span>
        </div>
      </div>
    </section>
  );
};

export default WarrantyPage;
