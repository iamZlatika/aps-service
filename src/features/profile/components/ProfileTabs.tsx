import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import { PROFILE_LINKS } from "@/features/profile/navigation.ts";
import { cn } from "@/shared/lib/utils.ts";

interface ProfileTabProps {
  label: string;
  to: string;
  active: boolean;
}

const ProfileTab = ({ label, to, active }: ProfileTabProps) => (
  <Link
    to={to}
    aria-current={active ? "page" : undefined}
    className={cn(
      "pb-2 text-sm whitespace-nowrap transition-colors focus:outline-none border-b-2 -mb-px",
      active
        ? "text-foreground font-medium border-primary"
        : "text-muted-foreground hover:text-foreground border-transparent",
    )}
  >
    {label}
  </Link>
);

export const ProfileTabs = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <div className="overflow-x-auto mb-4">
      <div className="flex items-end gap-5 border-b min-w-max">
        <ProfileTab
          label={t("profile.tabs.profile")}
          to={PROFILE_LINKS.root()}
          active={pathname === PROFILE_LINKS.root()}
        />
        <ProfileTab
          label={t("profile.tabs.finance")}
          to={PROFILE_LINKS.finance()}
          active={pathname === PROFILE_LINKS.finance()}
        />
      </div>
    </div>
  );
};
