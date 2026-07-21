import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useCreateFilterPreset } from "@/features/orders/hooks/useCreateFilterPreset.ts";
import type { FilterPresetFormValues } from "@/features/orders/lib/filterPresetSchema.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";

import { FilterForm } from "./FilterForm.tsx";

const FORM_ID = "filter-preset-form";

interface AddFilterModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddFilterModal = ({ open, onClose }: AddFilterModalProps) => {
  const { t } = useTranslation();
  const { createPreset, isCreating } = useCreateFilterPreset({
    onSuccess: onClose,
  });

  const handleSubmit = (data: FilterPresetFormValues) => {
    const hasFilter =
      data.status_ids.length > 0 ||
      data.location_id !== null ||
      data.manager_id !== null ||
      data.is_urgent !== null ||
      data.any_match !== null;

    if (!hasFilter) {
      toast.error(t("orders.filterSettings.atLeastOneFilter"));
      return;
    }

    createPreset(data);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("orders.filterSettings.addPreset")}</DialogTitle>
        </DialogHeader>

        <FilterForm id={FORM_ID} onSubmit={handleSubmit} />

        <DialogFooter className="gap-2 pt-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t("common.cancel")}
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form={FORM_ID}
            disabled={isCreating}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {t("orders.filterSettings.addPreset")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
