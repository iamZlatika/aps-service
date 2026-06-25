import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useSendPhoneCode } from "@/features/website/modules/account/hooks/useSendPhoneCode";
import { useSetPrimaryPhone } from "@/features/website/modules/account/hooks/useSetPrimaryPhone";

type UseAddPhoneFlowReturn = {
  isCodeSent: boolean;
  phone: string;
  submitPhone: (phone: string) => void;
  resend: () => void;
  isSending: boolean;
};

export const useAddPhoneFlow = (): UseAddPhoneFlowReturn => {
  const { t } = useTranslation("website");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [phone, setPhone] = useState("");

  const { submit: setPrimary, isPending: isSettingPrimary } =
    useSetPrimaryPhone();
  const { submit: sendCode, isPending: isSendingCode } = useSendPhoneCode();

  const sendVerificationCode = (phoneValue: string) => {
    sendCode(phoneValue, {
      onSuccess: () => {
        toast.success(t("cabinet.smsCodeSent", { phone: phoneValue }));
        setIsCodeSent(true);
      },
    });
  };

  const submitPhone = (phoneValue: string) => {
    setPhone(phoneValue);
    setPrimary(phoneValue, {
      onSuccess: () => sendVerificationCode(phoneValue),
    });
  };

  return {
    isCodeSent,
    phone,
    submitPhone,
    resend: () => sendVerificationCode(phone),
    isSending: isSettingPrimary || isSendingCode,
  };
};
