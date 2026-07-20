import { Pencil, Plus, UserMinus, Wallet } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { referralsApi } from "@/features/backoffice/modules/referrals/api";
import { AdjustReferralBalanceModal } from "@/features/backoffice/modules/referrals/components/AdjustReferralBalanceModal.tsx";
import { EditReferralModal } from "@/features/backoffice/modules/referrals/components/EditReferralModal.tsx";
import { MakeReferralDialog } from "@/features/backoffice/modules/referrals/components/MakeReferralDialog.tsx";
import { useDemoteReferral } from "@/features/backoffice/modules/referrals/hooks/useDemoteReferral.ts";
import { REFERRALS_LINKS } from "@/features/backoffice/modules/referrals/navigation.ts";
import { buildReferralColumns } from "@/features/backoffice/modules/referrals/pages/columns.tsx";
import { type Referral } from "@/features/backoffice/modules/referrals/types.ts";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { DeleteConfirmDialog } from "@/features/backoffice/widgets/table/components/dialogs";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { Button } from "@/shared/components/ui/button.tsx";

const ReferralsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMakeReferralOpen, setIsMakeReferralOpen] = useState(false);
  const [editingReferral, setEditingReferral] = useState<Referral | null>(null);
  const [adjustingReferral, setAdjustingReferral] = useState<Referral | null>(
    null,
  );
  const [demotingReferral, setDemotingReferral] = useState<Referral | null>(
    null,
  );

  const { demote, isPending: isDemoting } = useDemoteReferral(() =>
    setDemotingReferral(null),
  );

  return (
    <>
      <SmartTable
        titleKey="referrals.title"
        api={referralsApi}
        queryKeyFn={queryKeys.referrals.list}
        searchField="customer_name"
        searchPlaceholder="referrals.search_placeholder"
        columns={buildReferralColumns()}
        onRowClick={(referral) =>
          navigate(REFERRALS_LINKS.transactions(referral.id))
        }
        headerActions={
          <Button size="sm" onClick={() => setIsMakeReferralOpen(true)}>
            <Plus className="h-4 w-4" />
            {t("referrals.add_button")}
          </Button>
        }
        renderRowActions={(referral) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setEditingReferral(referral);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setAdjustingReferral(referral);
              }}
            >
              <Wallet className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                setDemotingReferral(referral);
              }}
            >
              <UserMinus className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <MakeReferralDialog
        isOpen={isMakeReferralOpen}
        onOpenChange={setIsMakeReferralOpen}
      />

      {editingReferral && (
        <EditReferralModal
          open
          onClose={() => setEditingReferral(null)}
          referral={editingReferral}
        />
      )}

      {adjustingReferral && (
        <AdjustReferralBalanceModal
          open
          onClose={() => setAdjustingReferral(null)}
          referralId={adjustingReferral.id}
          customerName={adjustingReferral.customer.name}
        />
      )}

      <DeleteConfirmDialog
        isOpen={!!demotingReferral}
        onOpenChange={(open) => !open && setDemotingReferral(null)}
        title={t("referrals.demote_confirm.title")}
        description={t("referrals.demote_confirm.description", {
          name: demotingReferral?.customer.name ?? "",
        })}
        cancelLabel={t("common.cancel")}
        confirmLabel={t("referrals.demote_confirm.confirm")}
        onConfirm={() => demotingReferral && demote(demotingReferral.id)}
        isPending={isDemoting}
      />
    </>
  );
};

export default ReferralsPage;
