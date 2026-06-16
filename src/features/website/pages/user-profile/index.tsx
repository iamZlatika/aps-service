import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useCustomerMe } from "@/features/auth/website/hooks/useCustomerMe";
import { WEBSITE_LINKS } from "@/features/website/navigation";
import { ProfilePanel } from "@/features/website/pages/user-account/components/ProfilePanel";

export const UserProfilePage = () => {
  const { data: customer } = useCustomerMe();
  const { t } = useTranslation("website");
  const navigate = useNavigate();

  return (
    <section className="pt-[32px] pb-[56px] max-[880px]:pt-5 max-[880px]:pb-9">
      <div className="ws-wrap">
        <header className="mb-7">
          <p className="ws-section-eyebrow">{t("cabinet.eyebrow")}</p>
          <h1 className="ws-section-title">
            {t("cabinet.profileTitleStart")}{" "}
            <strong>{t("cabinet.profileTitleBold")}</strong>
          </h1>
        </header>

        <ProfilePanel
          customer={customer}
          onBack={() => void navigate(WEBSITE_LINKS.account)}
        />
      </div>
    </section>
  );
};

export default UserProfilePage;
