import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { WEBSITE_LINKS } from "@/features/website/navigation";
import { cn } from "@/shared/lib/utils";

interface WebsiteLogoProps {
  className?: string;
}

export const WebsiteLogo = ({ className }: WebsiteLogoProps) => {
  const { t } = useTranslation("website");

  return (
    <Link
      to={WEBSITE_LINKS.home}
      aria-label="APS service"
      className={cn("flex items-center gap-3 no-underline", className)}
    >
      <img
        src="/default.png"
        alt="APS service logo"
        width="28"
        height="28"
        className="block h-7 w-auto shrink-0"
      />
      <span className="text-[17px] font-bold leading-none tracking-[-0.01em]">
        APS
        <span className="font-medium text-ws-ink-mute">.service</span>
        <small className="mt-1 block text-[11px] font-medium tracking-[0.02em] text-ws-ink-mute">
          {t("nav.logoSubtitle")}
        </small>
      </span>
    </Link>
  );
};
