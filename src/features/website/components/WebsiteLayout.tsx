import "@/features/website/styles/website.css";

import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";

import { WebsiteErrorFallback } from "@/features/website/components/ErrorFallback";
import { Footer } from "@/features/website/components/Footer";
import { Header } from "@/features/website/components/Header";
import { useMobileNav } from "@/features/website/hooks/useMobileNav";
import { useWebsiteThemeManager } from "@/features/website/hooks/useWebsiteThemeManager";
import { WebsiteThemeContext } from "@/features/website/websiteTheme";
import { LANG_STORAGE_KEY } from "@/shared/lib/constants";
import { captureErrorWithId } from "@/shared/lib/sentry";
import { storageGet } from "@/shared/lib/storage";
import { cn } from "@/shared/lib/utils";
import { USER_LANGUAGES, type UserLanguage } from "@/shared/types";

const DEFAULT_LANG: UserLanguage = USER_LANGUAGES.UK;

export const WebsiteLayout = () => {
  const { i18n, t } = useTranslation("website");
  const { changeLanguage } = i18n;
  const location = useLocation();
  const themeValue = useWebsiteThemeManager();
  const { isOpen: isNavOpen, open: openNav, close: closeNav } = useMobileNav();

  useEffect(() => {
    const saved = storageGet(LANG_STORAGE_KEY);
    const lang =
      saved === USER_LANGUAGES.UK || saved === USER_LANGUAGES.RU
        ? saved
        : DEFAULT_LANG;
    void changeLanguage(lang);
  }, [changeLanguage]);

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
        <Header isNavOpen={isNavOpen} openNav={openNav} closeNav={closeNav} />
        <main id="main-content" className="flex-1">
          <ErrorBoundary
            FallbackComponent={WebsiteErrorFallback}
            resetKeys={[location.pathname]}
            onError={(error, info) =>
              captureErrorWithId(error, { componentStack: info.componentStack })
            }
          >
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </WebsiteThemeContext.Provider>
  );
};

export default WebsiteLayout;
