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
      <div className="ws-hero-section relative w-full overflow-hidden rounded-[28px] border border-[var(--ws-line)] aspect-[1326/771]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 select-none"
        >
          <img
            src="/img.webp"
            alt=""
            fetchPriority="high"
            className="ws-hero-photo"
          />
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

          <div className="mt-[6px] inline-flex w-fit items-center gap-[10px] rounded-full border border-[var(--ws-line)] bg-[var(--ws-overlay-chip)] py-[11px] pl-[14px] pr-[16px] text-[13.5px] text-[var(--ws-ink-soft)] backdrop-blur">
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

        <div className="absolute right-12 top-12 inline-flex items-center rounded-[14px] border border-[var(--ws-overlay-border)] bg-[var(--ws-overlay-chip)] px-[14px] py-[9px] text-right text-[11.5px] font-bold leading-[1.35] tracking-[0.02em] text-[var(--ws-ink)] backdrop-blur">
          <div>
            <div>{t("hero.workdaysHours")}</div>
            <div>{t("hero.saturdayHours")}</div>
          </div>
        </div>

        <div className="ws-hero-br-block absolute bottom-10 right-12 text-right">
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
