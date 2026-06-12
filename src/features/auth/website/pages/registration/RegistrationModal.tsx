import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AuthModalBrand } from "@/features/auth/website/components/AuthModalBrand";
import { useAuthModal } from "@/features/auth/website/hooks/useAuthModal";
import { WebsiteModal } from "@/features/website/components/WebsiteModal";

import { RegistrationEmailSent } from "./RegistrationEmailSent";
import { RegistrationForm } from "./RegistrationForm";

export const RegistrationModal = () => {
  const { t } = useTranslation("website");
  const { isRegisterOpen, openLogin, close } = useAuthModal();

  const [sentEmail, setSentEmail] = useState<string | null>(null);

  const handleSuccess = (email: string) => {
    setSentEmail(email);
  };

  const handleClose = () => {
    setSentEmail(null);
    close();
  };

  const handleBackToLogin = () => {
    setSentEmail(null);
    openLogin();
  };

  return (
    <WebsiteModal
      open={isRegisterOpen}
      onClose={handleClose}
      maxWidth="max-w-[440px]"
    >
      <div className="overflow-y-auto p-[34px_34px_28px]">
        <AuthModalBrand />

        {sentEmail ? (
          <RegistrationEmailSent
            email={sentEmail}
            onBackToLogin={handleBackToLogin}
          />
        ) : (
          <>
            <h2 className="text-balance text-[26px] font-light leading-[1.15] tracking-[-0.018em] text-ws-ink">
              {t("registration.titleLine")}{" "}
              <b className="font-semibold text-ws-cream">
                {t("registration.titleBold")}
              </b>
            </h2>
            <p className="mt-2 text-pretty text-[13.5px] leading-[1.5] text-ws-ink-soft">
              {t("registration.subtitle")}
            </p>

            <RegistrationForm onSuccess={handleSuccess} />

            <div className="mt-[22px] text-center text-[13.5px] text-ws-ink-soft">
              {t("registration.hasAccount")}{" "}
              <button
                type="button"
                className="font-semibold text-ws-ember-bright hover:underline"
                onClick={handleBackToLogin}
              >
                {t("registration.login")}
              </button>
            </div>
          </>
        )}
      </div>
    </WebsiteModal>
  );
};
