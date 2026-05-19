import { useEffect, useState } from "react";

import {
  WEBSITE_THEMES,
  type WebsiteTheme,
  type WebsiteThemeContextValue,
  type WebsiteThemeResolved,
} from "@/features/website/websiteTheme";
import { THEME_STORAGE_KEY } from "@/shared/lib/constants";
import { storageGet, storageSet } from "@/shared/lib/storage";

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

export const useWebsiteThemeManager = (): WebsiteThemeContextValue => {
  const [theme, setThemeState] = useState<WebsiteTheme>(getInitialTheme);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

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

  return { theme, resolvedTheme: resolveTheme(theme, systemDark), setTheme };
};
