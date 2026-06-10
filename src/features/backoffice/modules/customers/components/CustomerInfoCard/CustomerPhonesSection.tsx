import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PhoneDropdown } from "@/features/backoffice/components/PhoneDropdown";
import { IsPrimaryButton } from "@/features/backoffice/modules/customers/components/IsPrimaryButton.tsx";
import { useCustomerPhones } from "@/features/backoffice/modules/customers/hooks/useCustomerPhones.ts";
import { addPhoneSchema } from "@/features/backoffice/modules/customers/lib/schemas.ts";
import type { CustomerInfo } from "@/features/backoffice/modules/customers/types.ts";
import {
  DeleteConfirmDialog,
  ItemFormDialog,
} from "@/features/backoffice/widgets/table/components/dialogs";
import type { FieldConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { CardTitle } from "@/shared/components/ui/card.tsx";

interface CustomerPhonesSectionProps {
  customerId: number;
  customer: CustomerInfo;
  onSuccess?: () => void;
}

export const CustomerPhonesSection = ({
  customerId,
  customer,
  onSuccess,
}: CustomerPhonesSectionProps) => {
  const { t } = useTranslation();
  const {
    phones,
    phoneNumberToDelete,
    isAddOpened,
    setIsAddOpened,
    isDeleteOpened,
    setIsDeleteOpened,
    handleAddPhone,
    handleDeletePhone,
    openDeleteDialog,
    changeIsPrimaryMutation,
    isAddPending,
    isDeletePending,
  } = useCustomerPhones(customerId, customer, onSuccess);

  const phoneFields: FieldConfig[] = [
    {
      key: "phone",
      label: t("customers.register_form.new_phone"),
      placeholder: t("customers.register_form.phone_placeholder"),
      required: true,
      type: "phone",
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <CardTitle className="text-xl font-bold">
          {t("customers.profile.phones")}
        </CardTitle>
        <Button onClick={() => setIsAddOpened(true)}>
          {t("customers.actions.add_phone")}
          <Plus />
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        {phones?.map((phone) => (
          <div key={phone.id} className="flex items-center gap-2">
            <IsPrimaryButton
              isPrimary={phone.isPrimary}
              onClick={() =>
                changeIsPrimaryMutation.mutate({
                  customerId,
                  phoneId: phone.id,
                })
              }
            />
            <PhoneDropdown phoneNumber={phone.phoneNumber} size="md" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDeleteDialog(phone.id)}
              disabled={phone.isPrimary}
            >
              <X />
            </Button>
          </div>
        ))}
      </div>

      <DeleteConfirmDialog
        isOpen={isDeleteOpened}
        onOpenChange={setIsDeleteOpened}
        title={t("customers.actions.delete_phone")}
        description={t("customers.actions.delete_confirm", {
          number: phoneNumberToDelete,
        })}
        cancelLabel={t("customers.actions.cancel")}
        confirmLabel={t("customers.actions.delete")}
        onConfirm={handleDeletePhone}
        isPending={isDeletePending}
      />

      <ItemFormDialog
        isOpen={isAddOpened}
        onOpenChange={setIsAddOpened}
        title={t("customers.register_form.add_phone")}
        fields={phoneFields}
        schema={addPhoneSchema}
        cancelLabel={t("customers.register_form.cancel")}
        confirmLabel={t("customers.register_form.submit")}
        onConfirm={handleAddPhone}
        isPending={isAddPending}
      />
    </>
  );
};
