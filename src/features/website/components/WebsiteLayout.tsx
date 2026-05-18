import "@/features/website/styles/website.css";

import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";

import { WebsiteErrorFallback } from "@/features/website/components/ErrorFallback";
import { Header } from "@/features/website/components/Header";
import {
  WEBSITE_THEMES,
  type WebsiteTheme,
  WebsiteThemeContext,
  type WebsiteThemeResolved,
} from "@/features/website/hooks/useWebsiteTheme";
import { LANG_STORAGE_KEY, THEME_STORAGE_KEY } from "@/shared/lib/constants";
import { captureErrorWithId } from "@/shared/lib/sentry";
import { storageGet, storageSet } from "@/shared/lib/storage";
import { cn } from "@/shared/lib/utils";
import { USER_LANGUAGES, type UserLanguage } from "@/shared/types";

const DEFAULT_LANG: UserLanguage = USER_LANGUAGES.UK;

function getInitialTheme(): WebsiteTheme {
  const saved = storageGet(THEME_STORAGE_KEY);
  if (
    saved === WEBSITE_THEMES.LIGHT ||
    saved === WEBSITE_THEMES.DARK ||
    saved === WEBSITE_THEMES.SYSTEM
  )
    return saved;
  return WEBSITE_THEMES.SYSTEM;
}

function resolveTheme(
  theme: WebsiteTheme,
  systemDark: boolean,
): WebsiteThemeResolved {
  if (theme === WEBSITE_THEMES.SYSTEM) return systemDark ? "dark" : "light";
  return theme;
}

const WebsiteLayout = () => {
  const { i18n } = useTranslation("website");
  const { changeLanguage } = i18n;
  const location = useLocation();
  const [theme, setThemeState] = useState<WebsiteTheme>(getInitialTheme);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    const saved = storageGet(LANG_STORAGE_KEY);
    const lang =
      saved === USER_LANGUAGES.UK || saved === USER_LANGUAGES.RU
        ? saved
        : DEFAULT_LANG;
    void changeLanguage(lang);
  }, [changeLanguage]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setTheme = (next: WebsiteTheme) => {
    setThemeState(next);
    storageSet(THEME_STORAGE_KEY, next);
  };

  const resolvedTheme = resolveTheme(theme, systemDark);

  return (
    <WebsiteThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      <div className={cn("website", resolvedTheme === "light" && "light")}>
        <Header />
        <main>
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
      </div>
    </WebsiteThemeContext.Provider>
  );
};

export default WebsiteLayout;
