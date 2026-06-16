import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useCustomerMe } from "@/features/auth/website/hooks/useCustomerMe";

import { AccountHeader } from "./components/AccountHeader";
import { OrdersPanel } from "./components/OrdersPanel";

export const UserAccountPage = () => {
  const { data: customer } = useCustomerMe();
  const { t } = useTranslation("website");

  const isEmailVerified = !!customer.emailVerifiedAt;

  return (
    <section className="pt-[32px] pb-[56px] max-[880px]:pt-5 max-[880px]:pb-9">
      <div className="ws-wrap">
        <AccountHeader customer={customer} />

        {isEmailVerified && (
          <span className="mb-6 inline-flex items-center gap-[7px] rounded-full border border-ws-green/30 bg-ws-green/12 px-[13px] py-[6px] text-ws-2xs font-semibold text-ws-green-soft">
            <Check
              strokeWidth={2.4}
              className="size-[13px]"
              aria-hidden="true"
            />
            {t("cabinet.accountConfirmed")}
          </span>
        )}

        <OrdersPanel customer={customer} />
      </div>
    </section>
  );
};

export default UserAccountPage;
