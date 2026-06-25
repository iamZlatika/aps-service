import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AuthModalBrand } from "@/features/auth/website/components/AuthModalBrand";
import { useAuthModal } from "@/features/auth/website/hooks/useAuthModal";
import { WebsiteModal } from "@/features/website/components/WebsiteModal";

import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ForgotPasswordSent } from "./ForgotPasswordSent";

export const ForgotPasswordModal = () => {
  const { t } = useTranslation("website");
  const { isForgotOpen, openLogin, close } = useAuthModal();

  const [isSent, setIsSent] = useState(false);

  const handleSuccess = () => {
    setIsSent(true);
  };

  const handleClose = () => {
    setIsSent(false);
    close();
  };

  const handleBackToLogin = () => {
    setIsSent(false);
    openLogin();
  };

  return (
    <WebsiteModal
      open={isForgotOpen}
      onClose={handleClose}
      maxWidth="max-w-[440px]"
    >
      <div className="overflow-y-auto p-[34px_34px_28px]">
        <AuthModalBrand />

        {isSent ? (
          <ForgotPasswordSent onBackToLogin={handleBackToLogin} />
        ) : (
          <>
            <h2 className="text-balance text-[26px] font-light leading-[1.15] tracking-[-0.018em] text-ws-ink">
              {t("forgotPassword.titleLine")}{" "}
              <b className="font-semibold text-ws-cream">
                {t("forgotPassword.titleBold")}
              </b>
            </h2>
            <p className="mt-2 text-pretty text-[13.5px] leading-[1.5] text-ws-ink-soft">
              {t("forgotPassword.subtitle")}
            </p>

            <ForgotPasswordForm onSuccess={handleSuccess} />

            <div className="mt-[22px] text-center text-[13.5px] text-ws-ink-soft">
              <button
                type="button"
                className="font-semibold text-ws-ember-bright hover:underline"
                onClick={handleBackToLogin}
              >
                {t("forgotPassword.backToLogin")}
              </button>
            </div>
          </>
        )}
      </div>
    </WebsiteModal>
  );
};
