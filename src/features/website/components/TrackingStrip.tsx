import { MoveRight, User } from "lucide-react";
import { useTranslation } from "react-i18next";

export const TrackingStrip = () => {
  const { t } = useTranslation("website");

  return (
    <div className="ws-wrap">
      <div className="flex items-center justify-end gap-[18px] pb-[22px] pt-[18px]">
        <div className="hidden items-center gap-[10px] text-[13px] text-[var(--ws-ink-mute)] sm:flex">
          {t("nav.trackingHint")}
          <span className="h-px w-6 shrink-0 bg-[var(--ws-line)]" />
        </div>

        <button type="button" className="ws-btn ws-btn-cream">
          <User className="size-[14px] shrink-0" />
          {t("nav.cabinet")}
          <MoveRight className="size-[14px] shrink-0" />
        </button>
      </div>
    </div>
  );
};
