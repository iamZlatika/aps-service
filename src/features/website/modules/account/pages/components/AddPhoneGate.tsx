import { Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { PhoneFlowForm } from "@/features/website/modules/account/pages/components/PhoneFlowForm";

export const AddPhoneGate = () => {
  const { t } = useTranslation("website");

  return (
    <div className="max-w-[620px] rounded-ws-card border border-[rgba(238,122,58,.26)] bg-[rgba(238,122,58,.07)] px-[32px] py-[30px] max-[560px]:px-[20px] max-[560px]:py-[24px]">
      <div className="mb-[18px] flex size-[50px] items-center justify-center rounded-[14px] border border-[rgba(238,122,58,.3)] bg-[rgba(238,122,58,.16)] text-ws-ember-bright">
        <Smartphone className="size-6" aria-hidden="true" />
      </div>

      <h2 className="text-[22px] font-medium leading-[1.2] tracking-[-0.01em] text-ws-ink">
        {t("cabinet.addPhoneGateTitle")}
      </h2>
      <p className="mt-3 max-w-[480px] text-[14.5px] leading-[1.6] text-ws-ink-soft text-pretty">
        {t("cabinet.addPhoneGateDesc")}
      </p>

      <div className="mt-[22px]">
        <PhoneFlowForm
          inputId="apg-phone"
          onVerifySuccess={() => toast.success(t("cabinet.phoneVerified"))}
        />
      </div>
    </div>
  );
};
