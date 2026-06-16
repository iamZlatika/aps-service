import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useCustomerMe } from "@/features/auth/website/hooks/useCustomerMe";
import { WEBSITE_LINKS } from "@/features/website/navigation";

interface HeaderUserBadgeProps {
  logout: () => void;
  isLoggingOut: boolean;
}

export const HeaderUserBadge = ({
  logout,
  isLoggingOut,
}: HeaderUserBadgeProps) => {
  const { t } = useTranslation("website");
  const { data: customer } = useCustomerMe();

  const firstName = customer.name.split(" ")[0];
  const avatarInitial = customer.name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <Link
        to={WEBSITE_LINKS.account}
        aria-label={firstName}
        className="inline-flex items-center gap-[10px] rounded-full border border-ws-line bg-[rgba(255,255,255,.015)] py-[7px] pl-[7px] pr-[14px] text-ws-ink no-underline transition-all duration-150 hover:border-ws-ink-mute"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ws-ember to-ws-ember-deep text-[15px] font-semibold text-white">
          {avatarInitial}
        </span>
        <span className="hidden text-[14px] font-semibold tracking-[-0.005em] min-[960px]:block">
          {firstName}
        </span>
      </Link>

      <button
        type="button"
        aria-label={t("cabinet.logout")}
        onClick={logout}
        disabled={isLoggingOut}
        className="inline-flex size-[42px] cursor-pointer items-center justify-center rounded-ws-sm border border-ws-line bg-transparent text-ws-ink-soft transition-all duration-150 hover:border-ws-ink-mute hover:text-ws-ink disabled:opacity-55"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-[15px]"
          aria-hidden="true"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5M21 12H9" />
        </svg>
      </button>
    </div>
  );
};
