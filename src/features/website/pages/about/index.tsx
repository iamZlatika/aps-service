import { useTranslation } from "react-i18next";

import { PinIcon } from "@/features/website/components/icons/PinIcon";
import { cn } from "@/shared/lib/utils";

import { OFFICES, STAT_KEYS } from "./AboutPageData";
import { AboutPartners } from "./AboutPartners";
import { AboutProcess } from "./AboutProcess";
import { AboutWhy } from "./AboutWhy";

interface SectionLabelProps {
  children: string;
}

const SectionLabel = ({ children }: SectionLabelProps) => (
  <h2 className="mb-6 flex items-center gap-3 text-ws-2xs font-semibold uppercase tracking-[0.18em] text-ws-ink-mute after:h-px after:flex-1 after:bg-ws-line-soft after:content-['']">
    {children}
  </h2>
);

export const AboutPage = () => {
  const { t } = useTranslation("website");

  return (
    <section
      className="ws-section ws-about-section"
      aria-labelledby="about-heading"
    >
      <div className="ws-wrap">
        <header className="mb-12 max-w-[860px]">
          <p className="ws-section-eyebrow">{t("about.eyebrow")}</p>
          <h1
            id="about-heading"
            className="font-light text-[clamp(28px,3.8vw,46px)] leading-[1.1] tracking-[-0.02em] text-ws-ink [text-wrap:balance]"
          >
            {t("about.titlePrefix")}{" "}
            <strong className="font-semibold text-ws-cream">
              {t("about.titleBold")}
            </strong>
          </h1>
        </header>

        <div className="mb-14 grid grid-cols-2 gap-[18px] max-w-[618px]">
          {STAT_KEYS.map(({ valueKey, labelKey }, i) => (
            <div
              key={i}
              className="rounded-[16px] border border-ws-line bg-ws-card p-6"
            >
              <div className="font-light text-[clamp(30px,3.4vw,42px)] leading-none tracking-[-0.02em] tabular-nums text-ws-ink">
                <strong className="font-semibold text-ws-ember-bright">
                  {t(valueKey)}
                </strong>
              </div>
              <div className="mt-[10px] text-ws-sm leading-[1.45] text-ws-ink-soft [text-wrap:pretty]">
                {t(labelKey)}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-11 max-w-[820px]">
          <p className="text-ws-body leading-[1.7] text-ws-ink-soft [text-wrap:pretty]">
            {t("about.intro")}
          </p>
        </div>

        <div className="mb-11 max-w-[820px]">
          <h2 className="mb-4 text-[clamp(22px,2.6vw,30px)] font-medium leading-[1.2] tracking-[-0.015em] text-ws-ink [text-wrap:balance]">
            {t("about.experienceTitle")}
          </h2>
          <p className="text-ws-body leading-[1.7] text-ws-ink-soft [text-wrap:pretty]">
            {t("about.experienceText")}
          </p>
        </div>

        <AboutPartners />

        <div className="mb-11 max-w-[820px]">
          <h2 className="mb-4 text-[clamp(22px,2.6vw,30px)] font-medium leading-[1.2] tracking-[-0.015em] text-ws-ink [text-wrap:balance]">
            {t("about.philosophyTitle")}
          </h2>
          <p className="text-ws-body leading-[1.7] text-ws-ink-soft [text-wrap:pretty]">
            {t("about.philosophyText")}
          </p>
        </div>

        <div className="mb-14 max-w-[820px]">
          <h2 className="mb-4 text-[clamp(22px,2.6vw,30px)] font-medium leading-[1.2] tracking-[-0.015em] text-ws-ink [text-wrap:balance]">
            {t("about.approachTitle")}
          </h2>
          <p className="mb-[14px] text-ws-body leading-[1.7] text-ws-ink-soft [text-wrap:pretty]">
            {t("about.approachText1")}
          </p>
          <p className="text-ws-body leading-[1.7] text-ws-ink-soft [text-wrap:pretty]">
            {t("about.approachText2")}
          </p>
        </div>

        <SectionLabel>{t("about.whyLabel")}</SectionLabel>
        <AboutWhy />

        <SectionLabel>{t("about.officesLabel")}</SectionLabel>
        <div className="mb-14 grid grid-cols-2 gap-4 max-[680px]:grid-cols-1">
          {OFFICES.map(({ src, addrKey, position }) => (
            <figure
              key={src}
              className="relative overflow-hidden rounded-[18px] border border-ws-line bg-ws-bg-2"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className={cn(
                  "block h-[340px] w-full object-cover max-[480px]:h-[260px]",
                  position,
                )}
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-[9px] bg-gradient-to-t from-[var(--ws-photo-overlay)] to-transparent px-5 pb-4 pt-7 text-[14.5px] font-semibold text-white">
                <PinIcon className="size-[15px] shrink-0 text-ws-ember-bright" />
                {t(addrKey)}
              </figcaption>
            </figure>
          ))}
        </div>

        <SectionLabel>{t("about.processLabel")}</SectionLabel>
        <AboutProcess />

        <div className="mt-12">
          <p className="text-[17px] font-medium text-ws-ink">
            {t("about.closing")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
