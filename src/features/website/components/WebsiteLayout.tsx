import "@/features/website/styles/website.css";

import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";

import { WebsiteErrorFallback } from "@/features/website/components/ErrorFallback";
import { Footer } from "@/features/website/components/Footer";
import { Header } from "@/features/website/components/Header";
import { MobileBottomBar } from "@/features/website/components/MobileBottomBar";
import { useMobileNav } from "@/features/website/hooks/useMobileNav";
import { useWebsiteThemeManager } from "@/features/website/hooks/useWebsiteThemeManager";
import { WebsiteThemeContext } from "@/features/website/websiteTheme";
import { LANG_STORAGE_KEY } from "@/shared/lib/constants";
import { captureErrorWithId } from "@/shared/lib/sentry";
import { storageGet } from "@/shared/lib/storage";
import { cn } from "@/shared/lib/utils";
import { USER_LANGUAGES, type UserLanguage } from "@/shared/types";

const DEFAULT_LANG: UserLanguage = USER_LANGUAGES.UK;

const WebsiteLayout = () => {
  const { i18n } = useTranslation("website");
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
          "website",
          themeValue.resolvedTheme === "light" && "light",
        )}
      >
        <Header isNavOpen={isNavOpen} openNav={openNav} closeNav={closeNav} />
        <main className="pb-[84px] md:pb-0">
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
        <MobileBottomBar navOpen={isNavOpen} />
      </div>
    </WebsiteThemeContext.Provider>
  );
};

export default WebsiteLayout;
