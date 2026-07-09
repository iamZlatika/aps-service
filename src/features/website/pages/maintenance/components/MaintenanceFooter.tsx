import { useTranslation } from "react-i18next";

import { WebsiteLogo } from "@/features/website/components/WebsiteLogo";
import { MESSENGER_ICONS, MESSENGERS } from "@/features/website/config";
import { getMessengerHref } from "@/features/website/lib/service";
import { MAINTENANCE_PAGE_MESSENGER_PHONE } from "@/features/website/pages/maintenance/MaintenancePageData";
import { cn } from "@/shared/lib/utils";

export const MaintenanceFooter = () => {
  const { t } = useTranslation("website");

  return (
    <footer className="border-t border-ws-line-soft">
      <div className="ws-wrap pt-9">
        <div className="flex flex-col items-center gap-4 text-center pb-4 pt-4">
          <WebsiteLogo />
          <p className="max-w-[340px] text-ws-sm leading-[1.55] text-ws-ink-soft">
            {t("footer.description")}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ws-line-soft pb-6 pt-6 text-ws-xs text-ws-ink-mute">
          <span>{t("footer.copyright")}</span>
          <div className="flex gap-2">
            {MESSENGERS.map((m) => {
              const Icon = MESSENGER_ICONS[m.key];
              const href = getMessengerHref(
                m.key,
                MAINTENANCE_PAGE_MESSENGER_PHONE,
              );
              return (
                <a
                  key={m.key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(`messenger.${m.key}`)}
                  className={cn(
                    "inline-flex size-[38px] items-center justify-center rounded-ws-sm border border-ws-line bg-white/[0.015] text-ws-ink-soft transition-all duration-200 hover:-translate-y-px [&>svg]:size-[17px]",
                    m.hoverClass,
                  )}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
          <span>{t("footer.privacy")}</span>
        </div>
      </div>
    </footer>
  );
};
