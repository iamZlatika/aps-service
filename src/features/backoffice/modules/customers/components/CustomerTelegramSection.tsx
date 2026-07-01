import { Check, CircleCheck, Copy, Loader2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useCustomerTelegram } from "@/features/backoffice/modules/customers/hooks/useCustomerTelegram.ts";
import type { Telegram } from "@/features/backoffice/modules/customers/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { CardTitle } from "@/shared/components/ui/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";

interface CustomerTelegramSectionProps {
  customerId: number;
  telegram: Telegram | null;
  onSuccess?: () => void;
  canManage: boolean;
}

export const CustomerTelegramSection = ({
  customerId,
  telegram,
  onSuccess,
  canManage,
}: CustomerTelegramSectionProps) => {
  const { t } = useTranslation();
  const { isPending, generateLink, revokeLink, isRevokePending } =
    useCustomerTelegram(customerId, onSuccess);
  const { copied, copy } = useCopyToClipboard();
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);

  const isLinked = telegram?.linkedAt != null;

  const handleConfirmRevoke = () => {
    revokeLink();
    setIsRevokeOpen(false);
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl font-bold">
            {t("customers.profile.telegram")}
          </CardTitle>
          {canManage && isLinked && (
            <Button variant="destructive" onClick={() => setIsRevokeOpen(true)}>
              {t("customers.actions.revoke_telegram")}
            </Button>
          )}
          {canManage && telegram === null && (
            <Button onClick={generateLink} disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("customers.actions.subscribe_telegram")}
            </Button>
          )}
        </div>

        {isLinked && (
          <div className="flex items-center gap-2 text-green-600">
            <CircleCheck className="h-8 w-8 shrink-0" />
            <span className="text-sm font-medium">
              {t("customers.profile.telegram_subscribed")}
            </span>
          </div>
        )}

        {telegram !== null && !isLinked && (
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 text-lg font-medium text-blue-600 hover:text-blue-700 transition-colors"
              onClick={() => telegram && copy(telegram.link)}
            >
              {t("customers.profile.telegram_link")}
              {copied ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
            <img src={telegram.qrCode} alt="QR code" className="w-64 h-64" />
          </div>
        )}
      </div>

      <Dialog open={isRevokeOpen} onOpenChange={setIsRevokeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("customers.actions.revoke_telegram")}</DialogTitle>
          </DialogHeader>
          <div className="flex items-start gap-3 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-yellow-800">
            <TriangleAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">
              {t("customers.profile.revoke_telegram_warning")}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("customers.profile.revoke_telegram_description")}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevokeOpen(false)}>
              {t("customers.actions.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRevoke}
              disabled={isRevokePending}
            >
              {isRevokePending && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("customers.actions.revoke_telegram")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
