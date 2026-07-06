import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { billingApi } from "@/features/backoffice/modules/billing/api";
import { MyTransactionsFilterBar } from "@/features/backoffice/modules/billing/components/MyTransactionsFilterBar.tsx";
import { RequestWithdrawalModal } from "@/features/backoffice/modules/billing/components/RequestWithdrawalModal.tsx";
import { buildMyTransactionColumns } from "@/features/backoffice/modules/billing/pages/columns.tsx";
import { MyBalanceCard } from "@/features/backoffice/modules/profile/components/MyBalanceCard.tsx";
import { ProfileTabs } from "@/features/backoffice/modules/profile/components/ProfileTabs.tsx";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card.tsx";

const ProfileFinancePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isRequestingWithdrawal, setIsRequestingWithdrawal] = useState(false);

  if (!user) return <Loader />;

  return (
    <>
      <div className="p-2 sm:p-6 pb-0 max-w-5xl mx-auto w-full">
        <h1 className="mb-6 text-2xl font-bold">{t("profile.my_finances")}</h1>
        <ProfileTabs />
        <MyBalanceCard
          balance={user.balance}
          available={user.available}
          onRequestWithdrawal={() => setIsRequestingWithdrawal(true)}
        />
        <Card className="p-2 sm:p-6 mb-6">
          <CardContent className="p-0">
            <CardTitle className="text-xl font-bold mb-4 text-center">
              {t("profile.your_rate")}
            </CardTitle>
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="pr-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {t("profile.services_percent")}
                </p>
                <p className="text-lg font-semibold">
                  {user.servicesPercent ?? "—"}
                  {user.servicesPercent !== null && "%"}
                </p>
              </div>
              <div className="px-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {t("profile.products_percent")}
                </p>
                <p className="text-lg font-semibold">
                  {user.productsPercent ?? "—"}
                  {user.productsPercent !== null && "%"}
                </p>
              </div>
              <div className="pl-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {t("profile.intake_percent")}
                </p>
                <p className="text-lg font-semibold">
                  {user.intakePercent ?? "—"}
                  {user.intakePercent !== null && "%"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <SmartTable
        className="max-w-[2560px] lg:max-w-[2560px]"
        titleKey="billing.my_transactions.title"
        api={billingApi.myTransactions}
        queryKeyFn={queryKeys.billing.myTransactions}
        searchPlaceholder="billing.my_transactions.title"
        columns={buildMyTransactionColumns()}
        filterBar={<MyTransactionsFilterBar />}
        extraFilterKeys={[
          "status",
          "type",
          "order_number",
          "created_at[0]",
          "created_at[1]",
        ]}
      />
      {isRequestingWithdrawal && (
        <RequestWithdrawalModal
          open
          onClose={() => setIsRequestingWithdrawal(false)}
          available={user.available}
        />
      )}
    </>
  );
};

export default ProfileFinancePage;
