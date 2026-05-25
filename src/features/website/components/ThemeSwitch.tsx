import { useTranslation } from "react-i18next";

import {
  useWebsiteTheme,
  WEBSITE_THEMES,
} from "@/features/website/websiteTheme";
import { cn } from "@/shared/lib/utils";

const MoonIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[13px]">
    <path d="M19 14.5A8 8 0 0 1 9.5 5a1 1 0 0 0-1.3-1.3 9.5 9.5 0 1 0 12.1 12.1A1 1 0 0 0 19 14.5Z" />
  </svg>
);

const SunIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className="size-[13px]"
  >
    <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const SystemIcon = (
  <svg viewBox="0 0 24 24" className="size-[13px]">
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" />
  </svg>
);

const THEMES = [
  { value: WEBSITE_THEMES.SYSTEM, labelKey: "theme.system", icon: SystemIcon },
  { value: WEBSITE_THEMES.DARK, labelKey: "theme.dark", icon: MoonIcon },
  { value: WEBSITE_THEMES.LIGHT, labelKey: "theme.light", icon: SunIcon },
] as const;

interface ThemeSwitchProps {
  stretch?: boolean;
}

export const ThemeSwitch = ({ stretch = false }: ThemeSwitchProps) => {
  const { theme, setTheme } = useWebsiteTheme();
  const { t } = useTranslation("website");

  return (
    <div
      role="group"
      aria-label={t("theme.label")}
      className={cn(
        "items-center rounded-ws-ctrl border border-ws-line bg-white/[0.015] p-[3px]",
        stretch ? "flex w-full" : "inline-flex",
      )}
    >
      {THEMES.map(({ value, labelKey, icon }) => (
        <button
          key={value}
          type="button"
          aria-label={t(labelKey)}
          aria-pressed={value === theme}
          onClick={() => setTheme(value)}
          className={cn(
            "inline-flex items-center justify-center rounded-ws-ctrl-inner transition-all duration-200",
            stretch ? "flex-1 py-[7px]" : "h-[24px] w-[28px]",
            value === theme
              ? "bg-ws-cream text-ws-bg"
              : "text-ws-ink-mute hover:text-ws-ink",
          )}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};
