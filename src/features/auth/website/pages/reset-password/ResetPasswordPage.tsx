import { Loader2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { AuthModalBrand } from "@/features/auth/website/components/AuthModalBrand";
import { useResetCheckToken } from "@/features/auth/website/hooks/useResetCheckToken";
import {
  FORGOT_PASSWORD_MODAL_VALUE,
  LOGIN_MODAL_VALUE,
  MODAL_PARAM,
} from "@/features/website/lib/modalParams";
import { WEBSITE_LINKS } from "@/features/website/navigation";

import { ResetPasswordForm } from "./ResetPasswordForm";

const ResetPasswordPage = () => {
  const { t } = useTranslation("website");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const hasParams = !!token && !!email;
  const { isLoading, isSuccess, isError } = useResetCheckToken(token, email);

  const handleSuccess = () => {
    void navigate(`${WEBSITE_LINKS.home}?${MODAL_PARAM}=${LOGIN_MODAL_VALUE}`, {
      replace: true,
    });
  };

  const handleRequestNew = () => {
    void navigate(
      `${WEBSITE_LINKS.home}?${MODAL_PARAM}=${FORGOT_PASSWORD_MODAL_VALUE}`,
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-var(--ws-header-height))] items-center justify-center p-6">
      <div className="w-full max-w-[440px] rounded-[22px] border border-ws-line bg-ws-bg-2 p-[34px_34px_28px] shadow-[0_50px_110px_-30px_rgba(0,0,0,.7)]">
        <AuthModalBrand />

        {!hasParams || isError ? (
          <>
            <div
              aria-hidden="true"
              className="mb-[22px] flex size-12 items-center justify-center rounded-[14px] border border-[color-mix(in_oklab,var(--ws-red)_28%,transparent)] bg-[color-mix(in_oklab,var(--ws-red)_14%,transparent)] text-ws-red-bright"
            >
              <XCircle className="size-[26px]" />
            </div>
            <h1 className="text-[22px] font-semibold text-ws-ink">
              {t("resetPassword.invalidTitle")}
            </h1>
            <p className="mt-2 text-pretty text-[13.5px] leading-[1.5] text-ws-ink-soft">
              {t("resetPassword.invalidSubtitle")}
            </p>
            <button
              type="button"
              className="ws-btn ws-btn-primary mt-6 w-full justify-center"
              onClick={handleRequestNew}
            >
              {t("resetPassword.requestNew")}
            </button>
          </>
        ) : isLoading ? (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="mb-4 size-10 animate-spin text-ws-ember-bright" />
            <p className="text-[13.5px] text-ws-ink-soft">
              {t("resetPassword.checking")}
            </p>
          </div>
        ) : isSuccess ? (
          <>
            <h2 className="text-balance text-[26px] font-light leading-[1.15] tracking-[-0.018em] text-ws-ink">
              {t("resetPassword.titleLine")}{" "}
              <b className="font-semibold text-ws-cream">
                {t("resetPassword.titleBold")}
              </b>
            </h2>
            <p className="mt-2 text-pretty text-[13.5px] leading-[1.5] text-ws-ink-soft">
              {t("resetPassword.subtitle")}
            </p>

            <ResetPasswordForm
              token={token}
              email={email}
              onSuccess={handleSuccess}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
