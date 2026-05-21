import { useTranslation } from "react-i18next";

import { LANG_STORAGE_KEY } from "@/shared/lib/constants";
import { storageSet } from "@/shared/lib/storage";
import { cn } from "@/shared/lib/utils";
import { USER_LANGUAGES, type UserLanguage } from "@/shared/types";

const LANGS: Array<{ value: UserLanguage; label: string }> = [
  { value: USER_LANGUAGES.UK, label: "UA" },
  { value: USER_LANGUAGES.RU, label: "RU" },
];

interface LangSwitchProps {
  stretch?: boolean;
}

export const LangSwitch = ({ stretch = false }: LangSwitchProps) => {
  const { i18n, t } = useTranslation("website");
  const current: UserLanguage =
    i18n.language === USER_LANGUAGES.RU ? USER_LANGUAGES.RU : USER_LANGUAGES.UK;

  const handleChange = (lang: UserLanguage) => {
    void i18n.changeLanguage(lang);
    storageSet(LANG_STORAGE_KEY, lang);
  };

  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className={cn(
        "items-center rounded-ws-ctrl border border-ws-line bg-white/[0.015] p-[3px]",
        stretch ? "flex w-full" : "inline-flex",
      )}
    >
      {LANGS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => handleChange(value)}
          className={cn(
            "inline-flex items-center justify-center rounded-ws-ctrl-inner text-[10px] font-bold uppercase tracking-[0.08em] transition-all duration-200",
            stretch ? "flex-1 py-[7px]" : "h-[24px] w-[28px]",
            value === current
              ? "bg-ws-cream text-ws-bg"
              : "text-ws-ink-mute hover:text-ws-ink",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
