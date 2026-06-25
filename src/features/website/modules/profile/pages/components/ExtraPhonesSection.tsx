import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { type CustomerPhone } from "@/features/auth/website/types";
import { useAddPhone } from "@/features/website/modules/profile/hooks/useAddPhone";
import { useDeletePhone } from "@/features/website/modules/profile/hooks/useDeletePhone";
import { AddExtraPhoneRow } from "@/features/website/modules/profile/pages/components/AddExtraPhoneRow";
import { ExtraPhoneRow } from "@/features/website/modules/profile/pages/components/ExtraPhoneRow";

interface ExtraPhonesSectionProps {
  phones: CustomerPhone[];
}

export const ExtraPhonesSection = ({ phones }: ExtraPhonesSectionProps) => {
  const { t } = useTranslation("website");
  const [isAdding, setIsAdding] = useState(false);

  const { submit: addPhone, isPending: isAddPending } = useAddPhone();
  const { submit: deletePhone, isPending: isDeletePending } = useDeletePhone();

  const handleConfirm = (phone: string) => {
    addPhone(phone, { onSuccess: () => setIsAdding(false) });
  };

  return (
    <div>
      <div className="mb-[14px] flex items-baseline gap-[10px]">
        <h3 className="text-[11px] font-semibold uppercase tracking-[.16em] text-ws-ink-mute">
          {t("cabinet.extraPhonesTitle")}
        </h3>
        <span className="text-[11px] text-ws-ink-mute">
          {t("cabinet.extraPhonesNote")}
        </span>
      </div>

      {phones.length > 0 && (
        <div className="mb-[10px] flex flex-col gap-[10px]">
          {phones.map((phone) => (
            <ExtraPhoneRow
              key={phone.id}
              phone={phone}
              onDelete={deletePhone}
              isDeleting={isDeletePending}
            />
          ))}
        </div>
      )}

      {isAdding ? (
        <AddExtraPhoneRow
          onConfirm={handleConfirm}
          onCancel={() => setIsAdding(false)}
          isPending={isAddPending}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-[9px] rounded-[11px] border border-dashed border-ws-line bg-transparent px-[18px] py-[11px] font-[inherit] text-[13.5px] font-semibold text-ws-ink-soft transition-all duration-150 hover:border-ws-ember hover:text-ws-ember-bright"
        >
          <Plus className="size-[15px]" aria-hidden="true" />
          {t("cabinet.addPhone")}
        </button>
      )}
    </div>
  );
};
