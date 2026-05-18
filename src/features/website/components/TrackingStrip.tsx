import { MoveRight, User } from "lucide-react";
import { useTranslation } from "react-i18next";

export const TrackingStrip = () => {
  const { t } = useTranslation("website");

  return (
    <div className="ws-wrap">
      <div className="flex flex-col gap-3 pb-[18px] pt-[14px] sm:flex-row sm:items-center sm:justify-end sm:gap-[18px] sm:pb-[22px] sm:pt-[18px]">
        <div className="hidden items-center gap-[10px] text-[13px] text-[var(--ws-ink-mute)] sm:flex">
          {t("nav.trackingHint")}
          <span className="h-px w-6 shrink-0 bg-[var(--ws-line)]" />
        </div>

        <button type="button" className="ws-btn ws-btn-cream justify-center">
          <User className="size-[14px] shrink-0" />
          {t("nav.cabinet")}
          <MoveRight className="size-[14px] shrink-0" />
        </button>
      </div>
    </div>
  );
};
