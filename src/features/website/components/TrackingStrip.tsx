import { MoveRight, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { WEBSITE_LINKS } from "@/features/website/navigation";

export const TrackingStrip = () => {
  const { t } = useTranslation("website");

  return (
    <div className="ws-wrap">
      <div className="flex flex-col gap-3 pb-[18px] pt-[14px] sm:flex-row sm:items-center sm:justify-end sm:gap-[18px] sm:pb-[22px] sm:pt-[18px]">
        <div className="hidden items-center gap-2.5 text-[13px] text-ws-ink-mute sm:flex">
          {t("nav.trackingHint")}
          <span className="h-px w-6 shrink-0 bg-ws-line" />
        </div>

        <Link to={WEBSITE_LINKS.account} className="ws-btn ws-btn-cream justify-center">
          <User className="size-3.5 shrink-0" />
          {t("nav.cabinet")}
          <MoveRight className="size-3.5 shrink-0" />
        </Link>
      </div>
    </div>
  );
};
