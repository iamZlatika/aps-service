import { Cog } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PhoneIcon } from "@/features/website/components/icons/PhoneIcon";
import { useWebsiteThemeManager } from "@/features/website/hooks/useWebsiteThemeManager";
import { formatPhone } from "@/features/website/lib/service";
import { MaintenanceFooter } from "@/features/website/pages/maintenance/components/MaintenanceFooter";
import { MaintenanceHeader } from "@/features/website/pages/maintenance/components/MaintenanceHeader";
import { MAINTENANCE_PAGE_PHONES } from "@/features/website/pages/maintenance/MaintenancePageData";
import { WebsiteThemeContext } from "@/features/website/websiteTheme";
import { cn } from "@/shared/lib/utils";

export const MaintenancePage = () => {
  const { t } = useTranslation("website");
  const themeValue = useWebsiteThemeManager();

  return (
    <WebsiteThemeContext.Provider value={themeValue}>
      <div
        className={cn(
          "website flex min-h-screen flex-col",
          themeValue.resolvedTheme === "light" && "light",
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-ws-md focus:bg-ws-bg-2 focus:px-4 focus:py-2 focus:text-ws-ink focus:outline focus:outline-ws-ember-bright"
        >
          {t("nav.skipToContent")}
        </a>

        <MaintenanceHeader />

        <main
          id="main-content"
          className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center"
        >
          <div
            aria-hidden="true"
            className="mb-[30px] flex size-[84px] items-center justify-center rounded-ws-lg border border-ws-ember/30 bg-ws-ember/10 text-ws-ember-bright"
          >
            <Cog className="size-[42px] animate-spin [animation-duration:6s]" />
          </div>

          <p className="ws-section-eyebrow">{t("maintenance.eyebrow")}</p>

          <h1 className="max-w-[640px] text-ws-2xl font-light leading-[1.18] tracking-[-0.02em] text-ws-ink">
            {t("maintenance.title")}{" "}
            <span className="font-semibold text-ws-cream">
              {t("maintenance.titleAccent")}
            </span>
          </h1>

          <p className="mt-4 max-w-[520px] text-ws-base leading-[1.6] text-ws-ink-soft">
            {t("maintenance.subtitle")}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-3">
            {MAINTENANCE_PAGE_PHONES.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone}`}
                className="inline-flex items-center gap-[10px] text-ws-lg font-bold tracking-[-0.005em] text-ws-ink no-underline tabular-nums transition-colors duration-200 hover:text-ws-ember-bright"
              >
                <PhoneIcon className="size-4 shrink-0 text-ws-ember-bright" />
                {formatPhone(phone)}
              </a>
            ))}
          </div>
        </main>

        <MaintenanceFooter />
      </div>
    </WebsiteThemeContext.Provider>
  );
};

export default MaintenancePage;
