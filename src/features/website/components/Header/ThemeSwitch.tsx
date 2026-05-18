import { type ReactNode } from "react";

import {
  useWebsiteTheme,
  WEBSITE_THEMES,
  type WebsiteTheme,
} from "@/features/website/hooks/useWebsiteTheme";
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

type ThemeOption = { value: WebsiteTheme; label: string; icon: ReactNode };

const THEMES: ThemeOption[] = [
  { value: WEBSITE_THEMES.SYSTEM, label: "System theme", icon: SystemIcon },
  { value: WEBSITE_THEMES.DARK, label: "Dark theme", icon: MoonIcon },
  { value: WEBSITE_THEMES.LIGHT, label: "Light theme", icon: SunIcon },
];

interface ThemeSwitchProps {
  stretch?: boolean;
}

export const ThemeSwitch = ({ stretch = false }: ThemeSwitchProps) => {
  const { theme, setTheme } = useWebsiteTheme();

  return (
    <div
      role="group"
      aria-label="Theme"
      className={cn(
        "items-center rounded-[9px] border border-[var(--ws-line)] bg-white/[0.015] p-[3px]",
        stretch ? "flex w-full" : "inline-flex",
      )}
    >
      {THEMES.map(({ value, label, icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          onClick={() => setTheme(value)}
          className={cn(
            "inline-flex items-center justify-center rounded-[6px] transition-all duration-200",
            stretch ? "flex-1 py-[7px]" : "h-[24px] w-[28px]",
            value === theme
              ? "bg-[var(--ws-cream)] text-[var(--ws-bg)]"
              : "text-[var(--ws-ink-mute)] hover:text-[var(--ws-ink)]",
          )}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};
