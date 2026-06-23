import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PhoneIcon } from "@/features/website/components/icons/PhoneIcon";
import { MESSENGER_ICONS, MESSENGERS } from "@/features/website/config";
import { useWebsiteThemeManager } from "@/features/website/hooks/useWebsiteThemeManager";
import { formatPhone, getMessengerHref } from "@/features/website/lib/service";
import {
  BLOCKED_PAGE_MESSENGER_PHONE,
  BLOCKED_PAGE_PHONES,
} from "@/features/website/pages/blocked/BlockedPageData";
import { BlockedFooter } from "@/features/website/pages/blocked/components/BlockedFooter";
import { BlockedHeader } from "@/features/website/pages/blocked/components/BlockedHeader";
import { WebsiteThemeContext } from "@/features/website/websiteTheme";
import { cn } from "@/shared/lib/utils";

export const BlockedPage = () => {
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

        <BlockedHeader />

        <main
          id="main-content"
          className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center"
        >
          <div
            aria-hidden="true"
            className="mb-[30px] flex size-[84px] items-center justify-center rounded-ws-lg border border-ws-red/30 bg-ws-red/10 text-ws-red-bright"
          >
            <ShieldAlert className="size-[42px]" />
          </div>

          <p className="ws-section-eyebrow">{t("blocked.eyebrow")}</p>

          <h1 className="max-w-[640px] text-ws-2xl font-light leading-[1.18] tracking-[-0.02em] text-ws-ink">
            {t("blocked.title")}
          </h1>

          <p className="mt-4 max-w-[520px] text-ws-base leading-[1.6] text-ws-ink-soft">
            {t("blocked.subtitle")}
          </p>

          <div className="mt-10 flex flex-col items-center gap-5">
            <div className="flex flex-wrap justify-center gap-x-7 gap-y-3">
              {BLOCKED_PAGE_PHONES.map((phone) => (
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

            <div className="flex gap-[10px]">
              {MESSENGERS.map((m) => {
                const Icon = MESSENGER_ICONS[m.key];
                const href = getMessengerHref(
                  m.key,
                  BLOCKED_PAGE_MESSENGER_PHONE,
                );
                return (
                  <a
                    key={m.key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(`messenger.${m.key}`)}
                    className={cn(
                      "inline-flex size-12 items-center justify-center rounded-ws-md border border-ws-line bg-white/[0.015] text-ws-ink-soft transition-all duration-200 hover:-translate-y-px [&>svg]:size-5",
                      m.hoverClass,
                    )}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </main>

        <BlockedFooter />
      </div>
    </WebsiteThemeContext.Provider>
  );
};

export default BlockedPage;
