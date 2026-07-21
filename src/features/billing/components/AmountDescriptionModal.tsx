import type { FormEventHandler, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";

interface AmountDescriptionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  isPending: boolean;
  rootError?: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

export const AmountDescriptionModal = ({
  open,
  onClose,
  title,
  submitLabel,
  isPending,
  rootError,
  onSubmit,
  children,
}: AmountDescriptionModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent onEscapeKeyDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {children}

          {rootError && <p className="text-sm text-destructive">{rootError}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
