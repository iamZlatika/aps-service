import { MoveRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useModalParam } from "@/features/website/hooks/useModalParam";
import {
  MODAL_PARAM,
  PC_BUILD_MODAL_VALUE,
} from "@/features/website/lib/modalParams";
import { useWebsiteTheme } from "@/features/website/websiteTheme";
import { cn } from "@/shared/lib/utils";

import { PcBuildModal } from "./PcBuildModal";

const FEATURE_KEYS = [
  "pcBuild.feature1",
  "pcBuild.feature2",
  "pcBuild.feature3",
  "pcBuild.feature4",
] as const;

export const PcBuildSection = () => {
  const { t } = useTranslation("website");
  const { resolvedTheme } = useWebsiteTheme();
  const {
    value: modalParam,
    set: openModal,
    clear: closeModal,
  } = useModalParam(MODAL_PARAM);
  const isModalOpen = modalParam === PC_BUILD_MODAL_VALUE;

  return (
    <>
      <section className="ws-section">
        <div className="ws-wrap">
          <div className="relative flex flex-col gap-8 overflow-hidden rounded-[24px] border border-ws-line bg-ws-bg-2 p-8 sm:p-12 md:grid md:grid-cols-[1.1fr_1fr] md:grid-rows-[auto_auto] md:gap-x-12 md:gap-y-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 size-[400px] rounded-full bg-[radial-gradient(circle,rgba(238,122,58,.18)_0%,transparent_60%)]"
            />

            {/* mobile: 1st · desktop: col 1, row 1 */}
            <div className="relative z-10">
              <p className="ws-section-eyebrow">{t("pcBuild.eyebrow")}</p>
              <h2 className="ws-section-title">
                {t("pcBuild.title")}
                <br />
                <strong>{t("pcBuild.titleBold")}</strong>
              </h2>
              <p className="mt-4 max-w-[440px] text-[15px] leading-[1.55] text-ws-ink-soft">
                {t("pcBuild.description")}
              </p>

              <ul className="mt-6 flex max-w-[480px] flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-[14px]">
                {FEATURE_KEYS.map((key) => (
                  <li
                    key={key}
                    className="flex items-center gap-[10px] text-[13.5px] text-ws-ink"
                  >
                    <span
                      aria-hidden="true"
                      className="size-[6px] shrink-0 rounded-full bg-ws-ember-bright"
                    />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            {/* mobile: 2nd · desktop: col 2, rows 1–2 */}
            <div
              role="img"
              aria-label={`${t("pcBuild.title")} ${t("pcBuild.titleBold")}`}
              className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-[16px] md:row-span-2 md:self-center"
            >
              <img
                src="/dark.webp"
                alt=""
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                  resolvedTheme === "light" ? "opacity-0" : "opacity-100",
                )}
              />
              <img
                src="/light.webp"
                alt=""
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                  resolvedTheme === "light" ? "opacity-100" : "opacity-0",
                )}
              />
            </div>

            {/* mobile: 3rd · desktop: col 1, row 2 (auto-placed) */}
            <button
              type="button"
              onClick={() => openModal(PC_BUILD_MODAL_VALUE)}
              className="ws-btn ws-btn-primary relative z-10 w-full justify-center md:w-auto md:justify-start md:justify-self-start md:self-start"
            >
              {t("pcBuild.cta")}
              <MoveRight className="size-3.5" />
            </button>
          </div>
        </div>
      </section>

      <PcBuildModal open={isModalOpen} onClose={closeModal} />
    </>
  );
};
