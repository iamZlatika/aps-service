import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useMergeCustomer } from "@/features/backoffice/modules/customers/hooks/useMergeCustomer.ts";
import {
  createFetchAllCustomers,
  createFetchMergeableCustomers,
  type CustomerOptionMeta,
} from "@/features/backoffice/modules/customers/lib/searchFetchers.ts";
import { DeleteConfirmDialog } from "@/features/backoffice/widgets/table/components/dialogs";
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

type MergeCustomerDialogSurvivor = {
  id: number;
  name: string;
};

interface MergeCustomerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialSurvivor?: MergeCustomerDialogSurvivor | null;
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

export const MergeCustomerDialog = ({
  isOpen,
  onOpenChange,
  initialSurvivor = null,
}: MergeCustomerDialogProps) => {
  const { t } = useTranslation();
  const [survivorName, setSurvivorName] = useState("");
  const [survivorId, setSurvivorId] = useState<number | null>(null);
  const [absorbedName, setAbsorbedName] = useState("");
  const [absorbedId, setAbsorbedId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const resetSelection = () => {
    setSurvivorName(initialSurvivor?.name ?? "");
    setSurvivorId(initialSurvivor?.id ?? null);
    setAbsorbedName("");
    setAbsorbedId(null);
  };

  useEffect(() => {
    if (isOpen) {
      setSurvivorName(initialSurvivor?.name ?? "");
      setSurvivorId(initialSurvivor?.id ?? null);
    }
  }, [isOpen, initialSurvivor?.id, initialSurvivor?.name]);

  const { mergeCustomer, isMergePending, mergeError, clearMergeError } =
    useMergeCustomer(survivorId, () => {
      setIsConfirmOpen(false);
      resetSelection();
      onOpenChange(false);
    });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsConfirmOpen(false);
      resetSelection();
      clearMergeError();
    }
    onOpenChange(open);
  };

  const handleMerge = async () => {
    if (!absorbedId) return;
    try {
      await mergeCustomer(absorbedId);
    } catch {
      setIsConfirmOpen(false);
      // error surfaced via mergeError on the selection screen
    }
  };

  const canSubmit = survivorId !== null && absorbedId !== null;

  return (
    <Fragment>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("customers.merge.title")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">
                {t("customers.merge.survivor_label")}
              </span>
              <SearchableSelect
                placeholder={t("customers.merge.survivor_placeholder")}
                value={survivorName}
                onChange={setSurvivorName}
                onSelect={(option) => setSurvivorId(option.id)}
                onClear={() => setSurvivorId(null)}
                renderOption={renderCustomerOption}
                fetchItems={createFetchAllCustomers(absorbedId)}
                queryKey={queryKeys.customers.mergeSurvivor(absorbedId)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">
                {t("customers.merge.absorbed_label")}
              </span>
              <SearchableSelect
                placeholder={t("customers.merge.absorbed_placeholder")}
                value={absorbedName}
                onChange={setAbsorbedName}
                onSelect={(option) => setAbsorbedId(option.id)}
                onClear={() => setAbsorbedId(null)}
                renderOption={renderCustomerOption}
                fetchItems={createFetchMergeableCustomers(survivorId)}
                queryKey={queryKeys.customers.mergeAbsorbed(survivorId)}
              />
            </div>
            {mergeError && (
              <span className="text-sm text-destructive">{mergeError}</span>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsConfirmOpen(true)}
              disabled={!canSubmit || isMergePending}
            >
              {t("customers.merge.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={t("customers.merge.confirm_title")}
        description={t("customers.merge.confirm_description", {
          absorbed: absorbedName,
          survivor: survivorName,
        })}
        cancelLabel={t("common.cancel")}
        confirmLabel={t("customers.merge.confirm")}
        onConfirm={handleMerge}
        isPending={isMergePending}
      />
    </Fragment>
  );
};
