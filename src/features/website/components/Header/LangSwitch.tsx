import { useTranslation } from "react-i18next";

import { LANG_STORAGE_KEY } from "@/shared/lib/constants";
import { storageSet } from "@/shared/lib/storage";
import { cn } from "@/shared/lib/utils";
import { USER_LANGUAGES, type UserLanguage } from "@/shared/types";

const LANGS: Array<{ value: UserLanguage; label: string }> = [
  { value: USER_LANGUAGES.UK, label: "UA" },
  { value: USER_LANGUAGES.RU, label: "RU" },
];

export const LangSwitch = () => {
  const { i18n } = useTranslation("website");
  const current: UserLanguage =
    i18n.language === USER_LANGUAGES.RU ? USER_LANGUAGES.RU : USER_LANGUAGES.UK;

  const handleChange = (lang: UserLanguage) => {
    void i18n.changeLanguage(lang);
    storageSet(LANG_STORAGE_KEY, lang);
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-[9px] border border-[var(--ws-line)] bg-white/[0.015] p-[3px]"
    >
      {LANGS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => handleChange(value)}
          className={cn(
            "rounded-[6px] px-[9px] py-[5px] text-[11px] font-bold uppercase tracking-[0.08em] transition-all duration-200",
            value === current
              ? "bg-[var(--ws-cream)] text-[var(--ws-bg)]"
              : "text-[var(--ws-ink-mute)] hover:text-[var(--ws-ink)]",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
