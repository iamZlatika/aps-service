import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { CUSTOMER_ACCOUNT_LINKS } from "@/features/website/modules/account/navigation";

export const ProfileHeader = () => {
  const { t } = useTranslation("website");

  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
      <header>
        <p className="ws-section-eyebrow">{t("cabinet.eyebrow")}</p>
        <h1 className="ws-section-title">
          {t("cabinet.profileTitleStart")}{" "}
          <strong>{t("cabinet.profileTitleBold")}</strong>
        </h1>
      </header>

      <Link
        to={CUSTOMER_ACCOUNT_LINKS.root()}
        className="inline-flex items-center gap-[9px] rounded-ws-sm border border-ws-line bg-transparent px-[18px] py-[11px] text-ws-base font-semibold text-ws-ink-soft no-underline transition-all duration-150 hover:border-ws-ink-mute hover:text-ws-ink"
      >
        {t("cabinet.backToOrders")}
      </Link>
    </div>
  );
};
