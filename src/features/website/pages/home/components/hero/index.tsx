import { useTranslation } from "react-i18next";

import { PinIcon } from "@/features/website/components/icons/PinIcon";
import { useWebsiteTheme } from "@/features/website/hooks/useWebsiteTheme";
import { CabinetButton } from "@/features/website/pages/home/components/hero/CabinetButton";
import { PriceButton } from "@/features/website/pages/home/components/hero/PriceButton";
import { cn } from "@/shared/lib/utils";

const PERKS = ["hero.perk1", "hero.perk2", "hero.perk3"] as const;

export const Hero = () => {
  const { t } = useTranslation("website");
  const { resolvedTheme } = useWebsiteTheme();

  return (
    <section className="ws-wrap py-6">
      <div className="ws-hero-section relative flex min-h-[620px] w-full flex-col overflow-hidden rounded-[22px] border border-[var(--ws-line)] md:aspect-[1326/771] md:block md:min-h-0 md:rounded-[28px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 select-none"
        >
          <picture>
            <source media="(max-width: 780px)" srcSet="/hero-mobile.webp" />
            <img
              src="/img.webp"
              alt=""
              fetchPriority="high"
              className="ws-hero-photo"
            />
          </picture>
          <div className="ws-hero-fade" />
        </div>

        <div className="relative z-[2] flex w-full flex-1 flex-col gap-5 px-6 pb-7 pt-[64px] md:max-w-[760px] md:flex-none md:px-[72px] md:pb-[92px] md:pt-[88px]">
          <div className="md:hidden">
            <p className="ws-section-eyebrow">{t("hero.eyebrowYear")}</p>
          </div>
          <div className="hidden md:block">
            <p className="ws-section-eyebrow">{t("hero.eyebrow")}</p>
          </div>

          <h1 className="text-[36px] font-light leading-[1.02] tracking-[-0.025em] text-[var(--ws-ink)] md:text-[clamp(40px,5.6vw,76px)]">
            {t("hero.titleLine1")}
            <br />
            {t("hero.titleLine2")}{" "}
            <span className="bg-gradient-to-b from-[var(--ws-ember-bright)] via-[var(--ws-ember)] to-[var(--ws-ember-deep)] bg-clip-text font-semibold text-transparent">
              {t("hero.titleAccent")}
            </span>
            <br />
            <span className="font-semibold">{t("hero.titleEnd")}</span>
          </h1>

          <p className="max-w-[460px] text-[clamp(13px,1.1vw,15.5px)] leading-[1.65] text-[var(--ws-ink-soft)]">
            {t("hero.description")}
          </p>

          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
            <CabinetButton />
            <PriceButton />
          </div>

          <div className="inline-flex w-fit items-center gap-[10px] rounded-full border border-[var(--ws-line)] bg-[var(--ws-overlay-chip)] py-[11px] pl-[14px] pr-[16px] text-[13.5px] text-[var(--ws-ink-soft)] backdrop-blur">
            <PinIcon className="size-[14px] shrink-0 text-[var(--ws-ember-bright)]" />
            <span>
              <b className="font-semibold text-[var(--ws-ink)]">
                {t("hero.city")}
              </b>{" "}
              {t("hero.cityOffices")}
            </span>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-2">
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

          <div className="mt-auto pt-6 md:hidden">
            <p className="text-[18px] font-light leading-[1.15] tracking-[-0.015em] text-[var(--ws-ink)]">
              {t("hero.bottomSlogan")}{" "}
              <b className="font-semibold text-[var(--ws-ember-bright)]">
                {t("hero.bottomSloganAccent")}
              </b>
            </p>
            <div className="mt-[6px] text-[11px] tracking-[0.04em] text-[var(--ws-ink-mute)]">
              <b className="text-[12px] font-semibold text-[var(--ws-ember-bright)]">
                47
              </b>{" "}
              {t("hero.devicesInWork")}
            </div>
          </div>
        </div>

        <div className="absolute right-4 top-4 inline-flex items-center rounded-[12px] border border-[var(--ws-overlay-border)] bg-[var(--ws-overlay-chip)] px-3 py-2 text-[10.5px] font-medium leading-[1.3] tracking-[0.02em] text-[var(--ws-ink)] backdrop-blur md:right-12 md:top-12 md:rounded-[14px] md:px-[14px] md:py-[9px] md:text-[11.5px] md:font-bold md:leading-[1.35]">
          <div className="text-right">
            <div>{t("hero.workdaysHours")}</div>
            <div className="text-[var(--ws-ink-soft)] md:text-inherit">
              {t("hero.saturdayHours")}
            </div>
          </div>
        </div>

        <div className="ws-hero-br-block absolute bottom-10 right-12 hidden text-right md:block">
          <p className="text-balance text-[34px] font-light leading-[1.05] tracking-[-0.022em] text-[var(--ws-ink)]">
            {t("hero.bottomSlogan")}
            <br />
            <span
              className={
                resolvedTheme === "light"
                  ? "font-bold text-[var(--ws-ink)]"
                  : "text-[var(--ws-ember-bright)]"
              }
            >
              {t("hero.bottomSloganAccent")}
            </span>
          </p>
          <div className="mt-2 text-[12px] text-[var(--ws-ink-mute)]">
            <b
              className={cn(
                "text-[20px] font-bold",
                resolvedTheme === "light"
                  ? "text-[var(--ws-ink)]"
                  : "text-[var(--ws-ember-bright)]",
              )}
            >
              47
            </b>{" "}
            {t("hero.devicesInWork")}
          </div>
        </div>
      </div>
    </section>
  );
};
