import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  createFetchAllCustomers,
  createFetchMergeableCustomers,
  type CustomerOptionMeta,
} from "@/features/backoffice/modules/customers/lib/searchFetchers.ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import SearchableSelect, {
  type SearchableSelectOption,
} from "@/widgets/searchable-select";

interface MergeCustomerDialogProps {
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

export const MergeCustomerDialog = ({
  isOpen,
  onOpenChange,
}: MergeCustomerDialogProps) => {
  const { t } = useTranslation();
  const [survivorName, setSurvivorName] = useState("");
  const [survivorId, setSurvivorId] = useState<number | null>(null);
  const [absorbedName, setAbsorbedName] = useState("");
  const [absorbedId, setAbsorbedId] = useState<number | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              queryKey={["customers", "merge-survivor", absorbedId]}
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
              queryKey={["customers", "merge-absorbed", survivorId]}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
