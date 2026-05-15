import { useTranslation } from "react-i18next";

import { PinIcon } from "@/features/website/components/icons/PinIcon";
import { CabinetButton } from "@/features/website/pages/home/components/hero/CabinetButton";
import { PriceButton } from "@/features/website/pages/home/components/hero/PriceButton";

const PERKS = ["hero.perk1", "hero.perk2", "hero.perk3"] as const;

export const Hero = () => {
  const { t } = useTranslation("website");

  return (
    <section className="ws-wrap py-6">
      <div className="relative w-full overflow-hidden rounded-[28px] border border-[var(--ws-line)] aspect-[1326/771]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 select-none"
        >
          <img
            src="/img.webp"
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-[0.45] brightness-[.6] contrast-[1.1]"
          />
          <div className="ws-hero-glow" />
          <div className="ws-hero-core" />
          <div className="ws-hero-fade" />
        </div>

        <div className="relative z-[2] flex max-w-[760px] flex-col gap-5 px-[72px] pb-[92px] pt-[88px]">
          <p className="ws-section-eyebrow">{t("hero.eyebrow")}</p>

          <h1 className="text-[clamp(40px,5.6vw,76px)] font-light leading-[1.02] tracking-[-0.025em] text-[var(--ws-ink)]">
            {t("hero.titleLine1")}
            <br />
            {t("hero.titleLine2")}{" "}
            <span className="text-[var(--ws-ember-bright)]">
              {t("hero.titleAccent")}
            </span>
            <br />
            <span className="font-semibold">{t("hero.titleEnd")}</span>
          </h1>

          <p className="max-w-[460px] text-[clamp(13px,1.1vw,15.5px)] leading-[1.65] text-[var(--ws-ink-soft)]">
            {t("hero.description")}
          </p>

          <div className="mt-[16px] flex flex-wrap gap-3">
            <CabinetButton />
            <PriceButton />
          </div>

          <div className="mt-[6px] inline-flex w-fit items-center gap-[10px] rounded-full border border-[var(--ws-line)] bg-[rgba(29,27,24,0.55)] py-[11px] pl-[14px] pr-[16px] text-[13.5px] text-[var(--ws-ink-soft)] backdrop-blur">
            <PinIcon className="size-[14px] shrink-0 text-[var(--ws-ember-bright)]" />
            <span>
              <b className="font-semibold text-[var(--ws-ink)]">
                {t("hero.city")}
              </b>{" "}
              {t("hero.cityOffices")}
            </span>
          </div>

          <div className="mt-[16px] flex flex-wrap gap-x-6 gap-y-2">
            {PERKS.map((key) => (
              <span
                key={key}
                className="flex items-center gap-2 text-[13.5px] text-[var(--ws-ink-soft)]"
              >
                <span className="size-[5px] shrink-0 rounded-full bg-[var(--ws-ember-bright)]" />
                {t(key)}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute right-12 top-12 inline-flex items-center rounded-[14px] border border-white/[0.08] bg-[rgba(29,27,24,0.55)] px-[14px] py-[9px] text-right text-[11.5px] font-bold leading-[1.35] tracking-[0.02em] text-white backdrop-blur">
          <div>
            <div>{t("hero.workdaysHours")}</div>
            <div>{t("hero.saturdayHours")}</div>
          </div>
        </div>

        <div className="absolute bottom-10 right-12 text-right">
          <p className="text-balance text-[34px] font-light leading-[1.05] tracking-[-0.022em] text-[var(--ws-ink)]">
            {t("hero.bottomSlogan")}
            <br />
            <span className="text-[var(--ws-ember-bright)]">
              {t("hero.bottomSloganAccent")}
            </span>
          </p>
          <div className="mt-2 text-[12px] text-[var(--ws-ink-mute)]">
            <b className="text-[20px] font-bold text-[var(--ws-ember-bright)]">
              47
            </b>{" "}
            {t("hero.devicesInWork")}
          </div>
        </div>
      </div>
    </section>
  );
};
