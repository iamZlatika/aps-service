import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import {
  createReferralTransactionsApi,
  referralsApi,
} from "@/features/referrals/api";
import { ReferralTransactionsFilterBar } from "@/features/referrals/components/ReferralTransactionsFilterBar.tsx";
import { buildReferralTransactionColumns } from "@/features/referrals/pages/columns.tsx";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { SmartTable } from "@/widgets/table";

const ReferralTransactionsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const referralId = id ? Number(id) : null;

  const { data: referral } = useQuery({
    queryKey: referralId ? queryKeys.referrals.detail(referralId) : [],
    queryFn: () => referralsApi.getOne(referralId as number),
    enabled: !!referralId,
  });

  const api = useMemo(
    () => (referralId ? createReferralTransactionsApi(referralId) : null),
    [referralId],
  );

  if (!referralId || !api) return null;

  return (
    <>
      {referral && (
        <div className="p-2 sm:p-4 pb-0 max-w-3xl lg:max-w-7xl mx-auto w-full">
          <div className="rounded-md border bg-card p-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-2">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("referrals.table.customer")}
              </p>
              <p className="font-medium">{referral.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("referrals.table.commission_percent")}
              </p>
              <p className="font-medium">{referral.commissionPercent}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("referrals.table.balance")}
              </p>
              <p className="font-medium">
                <MoneyAmount value={referral.balance} />
              </p>
            </div>
            {referral.pendingBalance !== "0" && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("referrals.table.pending_balance")}
                </p>
                <p className="font-medium">
                  <MoneyAmount value={referral.pendingBalance} prefix="+ " />
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <SmartTable
        titleKey="referrals.transactions.title"
        api={api}
        queryKeyFn={queryKeys.referrals.transactions(referralId)}
        searchPlaceholder="referrals.transactions.title"
        columns={buildReferralTransactionColumns()}
        filterBar={<ReferralTransactionsFilterBar />}
        extraFilterKeys={["status", "type", "order_number"]}
      />
    </>
  );
};

export default ReferralTransactionsPage;
