import { useState } from "react";
import { useTranslation } from "react-i18next";

import { PinIcon } from "@/features/website/components/icons/PinIcon";
import { useActiveCount } from "@/features/website/hooks/useActiveCount";
import { useLocations } from "@/features/website/hooks/useLocations";
import { parseScheduleLines } from "@/features/website/lib/service";
import { CabinetButton } from "@/features/website/pages/home/components/hero/CabinetButton";
import { PriceButton } from "@/features/website/pages/home/components/hero/PriceButton";
import { TrackStatusModal } from "@/features/website/pages/home/components/hero/TrackStatusModal";
import { useWebsiteTheme } from "@/features/website/websiteTheme";
import { cn } from "@/shared/lib/utils";

const PERKS = ["hero.perk1", "hero.perk2", "hero.perk3"] as const;

export const Hero = () => {
  const { t } = useTranslation("website");
  const { resolvedTheme } = useWebsiteTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { locations } = useLocations();
  const { activeCount } = useActiveCount();
  const firstLocation = locations[0];
  const scheduleLines = firstLocation
    ? parseScheduleLines(firstLocation.scheduleDisplay)
    : [];

  return (
    <section className="ws-wrap py-6">
      <div className="ws-hero-section relative flex min-h-[620px] w-full flex-col overflow-hidden rounded-ws-xl border border-ws-line md:aspect-[1326/771] md:block md:min-h-0 md:rounded-ws-2xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 select-none"
        >
          <picture>
            <source media="(max-width: 768px)" srcSet="/hero-mobile.webp" />
            <img
              src="/hero.webp"
              alt=""
              fetchPriority="high"
              className="ws-hero-photo"
            />
          </picture>
          <div className="ws-hero-fade" />
        </div>

        <div className="relative z-[2] flex w-full flex-1 flex-col gap-5 px-6 pb-7 pt-[64px] md:max-w-[760px] md:flex-none md:px-[72px] md:pb-[92px] md:pt-[88px]">
          <div className="hidden md:block">
            <p className="ws-section-eyebrow">{t("hero.eyebrow")}</p>
          </div>

          <h1 className="mt-6 text-ws-3xl font-light leading-[1.02] tracking-[-0.025em] text-ws-ink md:mt-0 md:text-ws-hero-title">
            {t("hero.titleLine1")}
            <br />
            {t("hero.titleLine2")}
            <br />
            <span className="bg-gradient-to-b from-ws-ember-bright via-ws-ember to-ws-ember-deep bg-clip-text font-semibold text-transparent">
              {t("hero.titleAccent")}
            </span>
          </h1>

          <p className="max-w-[460px] text-ws-hero-body leading-[1.65] text-ws-ink-soft">
            {t("hero.description")}
          </p>

          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
            <CabinetButton onClick={() => setIsModalOpen(true)} />
            <PriceButton />
          </div>

          <TrackStatusModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

          <div className="mt-3 inline-flex w-fit items-center gap-2.5 rounded-full border border-ws-line bg-ws-overlay-chip py-[11px] pl-3.5 pr-4 text-ws-sm text-ws-ink-soft backdrop-blur">
            <PinIcon className="size-3.5 shrink-0 text-ws-ember-bright" />
            <span>
              <b className="font-semibold text-ws-ink">{t("hero.city")}</b>{" "}
              {t("hero.cityOffices")}
            </span>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-2">
            {PERKS.map((key) => (
              <span
                key={key}
                className="flex items-center gap-2 text-ws-sm text-ws-ink-soft"
              >
                <span className="size-[5px] shrink-0 rounded-full bg-ws-ember-bright" />
                {t(key)}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-6 lg:hidden">
            <p className="text-ws-xl font-light leading-[1.15] tracking-[-0.015em] text-ws-ink">
              {t("hero.bottomSlogan")}{" "}
              <b className="font-semibold text-ws-ember-bright">
                {t("hero.bottomSloganAccent")}
              </b>
            </p>
            {activeCount !== undefined && (
              <div className="mt-[14px] flex items-center gap-1.5 text-ws-2xs tracking-[0.04em] text-ws-ink-soft">
                <b className="text-ws-xs font-semibold text-ws-ember-bright">
                  {activeCount}
                </b>
                {t("hero.devicesInWork", { count: activeCount })}
              </div>
            )}
          </div>
        </div>

        <div className="absolute left-4 right-4 top-4 flex items-end justify-between md:left-auto md:right-12 md:top-12">
          <p className="ws-section-eyebrow !mb-0 md:!hidden">
            {t("hero.eyebrowYear")}
          </p>
          <div className="inline-flex items-center rounded-ws-md border border-ws-overlay-border bg-ws-overlay-chip px-3 py-2 text-ws-2xs font-medium leading-[1.3] tracking-[0.02em] text-ws-ink backdrop-blur md:rounded-ws-chip md:px-[14px] md:py-[9px] md:font-bold md:leading-[1.35]">
            <div className="text-right">
              {scheduleLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 z-[3] hidden max-w-[300px] rounded-ws-card border border-ws-overlay-border bg-ws-overlay-chip px-[22px] pb-4 pt-[18px] text-right backdrop-blur lg:block">
          <p className="text-balance text-ws-2xl font-light leading-[1.05] tracking-[-0.018em] text-ws-ink">
            {t("hero.bottomSlogan")}
            <br />
            <b
              className={cn(
                "font-semibold",
                resolvedTheme === "light"
                  ? "text-ws-ember-deep"
                  : "text-ws-ember-bright",
              )}
            >
              {t("hero.bottomSloganAccent")}
            </b>
          </p>
          {activeCount !== undefined && (
            <div className="mt-[10px] flex items-center justify-end gap-1.5 border-t border-ws-overlay-border pt-[10px] text-ws-2xs tracking-[0.04em] text-ws-ink-soft">
              <b
                className={cn(
                  "text-ws-base font-bold",
                  resolvedTheme === "light"
                    ? "text-ws-ember-deep"
                    : "text-ws-ember-bright",
                )}
              >
                {activeCount}
              </b>
              {t("hero.devicesInWork", { count: activeCount })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
