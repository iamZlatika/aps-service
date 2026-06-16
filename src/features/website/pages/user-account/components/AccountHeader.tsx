import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { type Customer } from "@/features/auth/website/types";
import { WEBSITE_LINKS } from "@/features/website/navigation";

interface AccountHeaderProps {
  customer: Customer;
}

export const AccountHeader = ({ customer }: AccountHeaderProps) => {
  const { t } = useTranslation("website");

  const firstName = customer.name.split(" ")[0];

  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
      <header>
        <p className="ws-section-eyebrow">{t("cabinet.eyebrow")}</p>
        <h1 className="ws-section-title">
          {t("cabinet.greetingStart")} <strong>{firstName}!</strong>
        </h1>
      </header>

      <Link
        to={WEBSITE_LINKS.accountProfile}
        className="inline-flex items-center gap-[9px] rounded-ws-sm border border-ws-line bg-transparent px-[18px] py-[11px] text-ws-base font-semibold text-ws-ink-soft no-underline transition-all duration-150 hover:border-ws-ink-mute hover:text-ws-ink"
      >
        {t("cabinet.profileButton")}
      </Link>
    </div>
  );
};
