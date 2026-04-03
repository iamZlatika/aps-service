import { useTranslation } from "react-i18next";

import type { Customer } from "@/features/backoffice/modules/customers/types.ts";
import { ItemCardDialog } from "@/features/backoffice/widgets/table/components/dialogs";

interface CustomerCardDialogProps {
  customer: Customer | null;
  onOpenChange: (open: boolean) => void;
}

export const CustomerCardDialog = ({
  customer,
  onOpenChange,
}: CustomerCardDialogProps) => {
  const { t } = useTranslation();

  const primaryPhone = customer?.phones.find((p) => p.isPrimary);
  const secondaryPhones = customer?.phones.filter((p) => !p.isPrimary) ?? [];

  return (
    <ItemCardDialog
      isOpen={customer !== null}
      onOpenChange={onOpenChange}
      title={customer?.name ?? ""}
      closeLabel={t("common.ok")}
    >
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        {customer?.email && (
          <>
            <dt className="text-muted-foreground font-medium">
              {t("customers.card.email")}
            </dt>
            <dd>{customer.email}</dd>
          </>
        )}

        {primaryPhone && (
          <>
            <dt className="text-muted-foreground font-medium">
              {t("customers.table_fields.mainPhone")}
            </dt>
            <dd>{primaryPhone.phoneNumber}</dd>
          </>
        )}

        {secondaryPhones.length > 0 && (
          <>
            <dt className="text-muted-foreground font-medium">
              {t("customers.table_fields.secondaryPhone")}
            </dt>
            <dd>
              <ul className="flex flex-col gap-1">
                {secondaryPhones.map((phone) => (
                  <li key={phone.id}>{phone.phoneNumber}</li>
                ))}
              </ul>
            </dd>
          </>
        )}

        {customer?.lastOrderAt && (
          <>
            <dt className="text-muted-foreground font-medium">
              {t("customers.table_fields.lastOrderAt")}
            </dt>
            <dd>{customer.lastOrderAt}</dd>
          </>
        )}

        {customer?.comment && (
          <>
            <dt className="text-muted-foreground font-medium">
              {t("customers.card.comment")}
            </dt>
            <dd>{customer.comment}</dd>
          </>
        )}
      </dl>
    </ItemCardDialog>
  );
};
