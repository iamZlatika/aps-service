import { createContext, useContext } from "react";

export const WEBSITE_THEMES = {
  DARK: "dark",
  LIGHT: "light",
  SYSTEM: "system",
} as const;

export type WebsiteTheme = (typeof WEBSITE_THEMES)[keyof typeof WEBSITE_THEMES];
export type WebsiteThemeResolved = "dark" | "light";

export type WebsiteThemeContextValue = {
  theme: WebsiteTheme;
  resolvedTheme: WebsiteThemeResolved;
  setTheme: (theme: WebsiteTheme) => void;
};

export const WebsiteThemeContext =
  createContext<WebsiteThemeContextValue | null>(null);

export const useWebsiteTheme = (): WebsiteThemeContextValue => {
  const ctx = useContext(WebsiteThemeContext);
  if (!ctx)
    throw new Error("useWebsiteTheme must be used inside WebsiteLayout");
  return ctx;
};
