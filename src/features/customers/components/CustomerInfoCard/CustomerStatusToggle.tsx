import { Lock, Unlock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useCustomerStatus } from "@/features/customers/hooks/useCustomerStatus.ts";
import type { CustomerInfo } from "@/features/customers/types.ts";
import { DeleteConfirmDialog } from "@/widgets/table/components/dialogs";

interface CustomerStatusToggleProps {
  customer: CustomerInfo;
  disabled?: boolean;
}

export const CustomerStatusToggle = ({
  customer,
  disabled,
}: CustomerStatusToggleProps) => {
  const { t } = useTranslation();
  const {
    isConfirmOpened,
    setIsConfirmOpened,
    handleConfirm,
    isStatusPending,
  } = useCustomerStatus(customer.id, customer);

  const icon =
    customer.status === "active" ? (
      <Unlock className="h-4 w-4" />
    ) : (
      <Lock className="h-4 w-4" />
    );

  if (disabled) {
    return (
      <span
        className={
          customer.status === "active"
            ? "p-2 text-green-600"
            : "p-2 text-red-600"
        }
      >
        {icon}
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsConfirmOpened(true)}
        className={
          customer.status === "active"
            ? "p-2 text-green-600 hover:text-green-700 transition-colors"
            : "p-2 text-red-600 hover:text-red-700 transition-colors"
        }
      >
        {icon}
      </button>

      <DeleteConfirmDialog
        isOpen={isConfirmOpened}
        onOpenChange={setIsConfirmOpened}
        title={
          customer.status === "active"
            ? t("customers.actions.block")
            : t("customers.actions.unblock")
        }
        description={
          customer.status === "active"
            ? t("customers.actions.block_confirm", { name: customer.name })
            : t("customers.actions.unblock_confirm", { name: customer.name })
        }
        cancelLabel={t("customers.actions.cancel")}
        confirmLabel={
          customer.status === "active"
            ? t("customers.actions.block")
            : t("customers.actions.unblock")
        }
        onConfirm={handleConfirm}
        isPending={isStatusPending}
      />
    </>
  );
};
