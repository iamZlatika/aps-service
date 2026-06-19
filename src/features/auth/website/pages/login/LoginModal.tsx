import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { customerAuthService } from "@/features/auth/lib/authService";
import { AuthModalBrand } from "@/features/auth/website/components/AuthModalBrand";
import { useAuthModal } from "@/features/auth/website/hooks/useAuthModal";
import { type AuthResponse } from "@/features/auth/website/types";
import { WebsiteModal } from "@/features/website/components/WebsiteModal";

import { LoginForm } from "./LoginForm";

interface LoginModalProps {
  redirectTo: string;
}

export const LoginModal = ({ redirectTo }: LoginModalProps) => {
  const { t } = useTranslation("website");
  const { isLoginOpen, openRegister, close } = useAuthModal();
  const navigate = useNavigate();

  const handleSuccess = (data: AuthResponse) => {
    customerAuthService.setToken(data.token);
    close();
    void navigate(redirectTo);
  };

  return (
    <WebsiteModal open={isLoginOpen} onClose={close} maxWidth="max-w-[440px]">
      <div className="overflow-y-auto p-[34px_34px_28px]">
        <AuthModalBrand />

        <h2 className="text-balance text-[26px] font-light leading-[1.15] tracking-[-0.018em] text-ws-ink">
          {t("login.titleLine")}{" "}
          <b className="font-semibold text-ws-cream">{t("login.titleBold")}</b>
        </h2>
        <p className="mt-2 text-pretty text-[13.5px] leading-[1.5] text-ws-ink-soft">
          {t("login.subtitle")}
        </p>

        <LoginForm onSuccess={handleSuccess} />

        <div className="mt-[18px] text-center text-[13.5px] text-ws-ink-soft">
          {t("login.noAccount")}{" "}
          <button
            type="button"
            className="font-semibold text-ws-ember-bright hover:underline"
            onClick={openRegister}
          >
            {t("login.register")}
          </button>
        </div>
      </div>
    </WebsiteModal>
  );
};
