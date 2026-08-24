import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  createFetchAllCustomers,
  type CustomerOptionMeta,
} from "@/features/customers/lib/searchFetchers.ts";
import { useChangeOrderCustomer } from "@/features/orders/hooks/useChangeOrderCustomer.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import SearchableSelect, {
  type SearchableSelectOption,
} from "@/widgets/searchable-select";
import { DeleteConfirmDialog } from "@/widgets/table/components/dialogs";

interface ChangeCustomerDialogProps {
  orderId: number;
  currentCustomer: { id: number; name: string };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const renderCustomerOption = (
  option: SearchableSelectOption<CustomerOptionMeta>,
) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium">{option.name}</span>
    <span className="text-xs text-muted-foreground">
      {option.meta.phones.join(", ")}
    </span>
  </div>
);

export const ChangeCustomerDialog = ({
  orderId,
  currentCustomer,
  isOpen,
  onOpenChange,
}: ChangeCustomerDialogProps) => {
  const { t } = useTranslation();
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCustomerName("");
      setCustomerId(null);
    }
  }, [isOpen]);

  const { changeCustomer, isPending, changeError, clearChangeError } =
    useChangeOrderCustomer(orderId, currentCustomer.id, () => {
      setIsConfirmOpen(false);
      onOpenChange(false);
    });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsConfirmOpen(false);
      clearChangeError();
    }
    onOpenChange(open);
  };

  const handleConfirm = async () => {
    if (!customerId) return;
    try {
      await changeCustomer(customerId);
    } catch {
      setIsConfirmOpen(false);
      // error surfaced via changeError on the selection screen
    }
  };

  return (
    <Fragment>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent onKeyDown={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>{t("orders.changeCustomer.title")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <SearchableSelect
              placeholder={t("orders.changeCustomer.search_placeholder")}
              value={customerName}
              onChange={setCustomerName}
              onSelect={(option) => setCustomerId(option.id)}
              onClear={() => setCustomerId(null)}
              renderOption={renderCustomerOption}
              fetchItems={createFetchAllCustomers(currentCustomer.id)}
              queryKey={queryKeys.customers.changeOrderCustomer(
                currentCustomer.id,
              )}
            />
            {changeError && (
              <span className="text-sm text-destructive">{changeError}</span>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={() => setIsConfirmOpen(true)}
              disabled={!customerId || isPending}
            >
              {t("orders.changeCustomer.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={t("orders.changeCustomer.confirm_title")}
        description={t("orders.changeCustomer.confirm_description", {
          name: customerName,
        })}
        cancelLabel={t("common.cancel")}
        confirmLabel={t("orders.changeCustomer.confirm")}
        onConfirm={handleConfirm}
        isPending={isPending}
      />
    </Fragment>
  );
};
