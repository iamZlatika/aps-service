import { useEffect, useRef, useState } from "react";

import { useSendPhoneCode } from "@/features/website/modules/account/hooks/useSendPhoneCode";
import { useSetPrimaryPhone } from "@/features/website/modules/account/hooks/useSetPrimaryPhone";

const RESEND_COUNTDOWN_SEC = 60;

type PhoneFlowOptions = { onSuccess?: () => void };

type UseAddPhoneFlowReturn = {
  isCodeSent: boolean;
  phone: string;
  submitPhone: (phone: string, options?: PhoneFlowOptions) => void;
  resend: (options?: PhoneFlowOptions) => void;
  isSending: boolean;
  countdown: number;
};

export const useAddPhoneFlow = (): UseAddPhoneFlowReturn => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { submit: setPrimary, isPending: isSettingPrimary } =
    useSetPrimaryPhone();
  const { submit: sendCode, isPending: isSendingCode } = useSendPhoneCode();

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = () => {
    if (timerRef.current !== null) clearInterval(timerRef.current);
    countdownRef.current = RESEND_COUNTDOWN_SEC;
    setCountdown(RESEND_COUNTDOWN_SEC);
    timerRef.current = setInterval(() => {
      countdownRef.current -= 1;
      setCountdown(countdownRef.current);
      if (countdownRef.current <= 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
      }
    }, 1000);
  };

  const sendVerificationCode = (phoneValue: string, onSuccess?: () => void) => {
    sendCode(phoneValue, {
      onSuccess: () => {
        setIsCodeSent(true);
        startCountdown();
        onSuccess?.();
      },
    });
  };

  const submitPhone = (phoneValue: string, options?: PhoneFlowOptions) => {
    setPhone(phoneValue);
    setPrimary(phoneValue, {
      onSuccess: () => sendVerificationCode(phoneValue, options?.onSuccess),
    });
  };

  const resend = (options?: PhoneFlowOptions) => {
    sendCode(phone, {
      onSuccess: () => {
        startCountdown();
        options?.onSuccess?.();
      },
    });
  };

  return {
    isCodeSent,
    phone,
    submitPhone,
    resend,
    isSending: isSettingPrimary || isSendingCode,
    countdown,
  };
};
