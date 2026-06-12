import { useTranslation } from "react-i18next";

import { AuthModalBrand } from "@/features/auth/website/components/AuthModalBrand";
import { useAuthModal } from "@/features/auth/website/hooks/useAuthModal";
import { WebsiteModal } from "@/features/website/components/WebsiteModal";

export const LoginModal = () => {
  const { t } = useTranslation("website");
  const { isLoginOpen, openRegister, close } = useAuthModal();

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

        <div className="mt-[22px] text-center text-[13.5px] text-ws-ink-soft">
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
