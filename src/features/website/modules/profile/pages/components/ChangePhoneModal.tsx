import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { WebsiteModal } from "@/features/website/components/WebsiteModal";
import { PhoneFlowForm } from "@/features/website/modules/account/pages/components/PhoneFlowForm";

interface ChangePhoneModalProps {
  open: boolean;
  onClose: () => void;
}

export const ChangePhoneModal = ({ open, onClose }: ChangePhoneModalProps) => {
  const { t } = useTranslation("website");

  return (
    <WebsiteModal open={open} onClose={onClose} maxWidth="max-w-[440px]">
      <div className="p-[34px_34px_28px]">
        <h2 className="text-[22px] font-light text-ws-ink">
          {t("cabinet.changePhone")}
        </h2>
        <p className="mt-2 text-[14px] leading-[1.6] text-ws-ink-soft">
          {t("cabinet.changePrimaryPhoneDesc")}
        </p>

        <div className="mt-[18px]">
          <PhoneFlowForm
            inputId="cp-phone"
            onVerifySuccess={() => {
              toast.success(t("cabinet.phoneVerified"));
              onClose();
            }}
            submitButtonClass="w-full justify-center"
          />
        </div>
      </div>
    </WebsiteModal>
  );
};
