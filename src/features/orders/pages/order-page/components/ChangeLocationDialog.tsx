import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useChangeOrderLocation } from "@/features/orders/hooks/useChangeOrderLocation.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

interface ChangeLocationDialogProps {
  orderId: number;
  currentLocationId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangeLocationDialog = ({
  orderId,
  currentLocationId,
  isOpen,
  onOpenChange,
}: ChangeLocationDialogProps) => {
  const { t } = useTranslation();
  const [locationId, setLocationId] = useState(currentLocationId);

  const { locations, isLoadingLocations, changeLocation, isPending } =
    useChangeOrderLocation(orderId, () => onOpenChange(false));

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) setLocationId(currentLocationId);
        onOpenChange(open);
      }}
    >
      <DialogContent onKeyDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{t("orders.changeLocation.title")}</DialogTitle>
        </DialogHeader>

        <Select
          value={String(locationId)}
          onValueChange={(val) => setLocationId(Number(val))}
          disabled={!locations.length || isLoadingLocations}
        >
          <SelectTrigger className="h-11 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc.id} value={String(loc.id)}>
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("orders.print.cancel")}
          </Button>
          <Button
            disabled={isPending || locationId === currentLocationId}
            onClick={() => changeLocation(locationId)}
          >
            {t("orders.changeLocation.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
