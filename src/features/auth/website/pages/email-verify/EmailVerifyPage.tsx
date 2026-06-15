import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  LOGIN_MODAL_VALUE,
  MODAL_PARAM,
} from "@/features/website/lib/modalParams";
import { WEBSITE_LINKS } from "@/features/website/navigation";

import { useEmailVerify } from "./useEmailVerify";

const EmailVerifyPage = () => {
  const { t } = useTranslation("website");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verifyUrl = searchParams.get("verify_url");

  const { status } = useEmailVerify(verifyUrl);

  useEffect(() => {
    if (status === "success") {
      void navigate(
        `${WEBSITE_LINKS.home}?${MODAL_PARAM}=${LOGIN_MODAL_VALUE}`,
        { replace: true },
      );
    }
  }, [status, navigate]);

  return (
    <div className="flex min-h-[calc(100vh-var(--ws-header-height))] items-center justify-center p-6">
      <div className="w-full max-w-[400px] text-center">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto mb-5 size-12 animate-spin text-ws-ember-bright" />
            <p className="text-[15px] text-ws-ink-soft">
              {t("emailVerify.loading")}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="mx-auto mb-5 size-12 text-ws-green" />
            <p className="text-[15px] text-ws-ink-soft">
              {t("emailVerify.redirecting")}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto mb-5 size-12 text-ws-red-bright" />
            <h1 className="text-[22px] font-semibold text-ws-ink">
              {t("emailVerify.errorTitle")}
            </h1>
            <p className="mt-2 text-pretty text-[13.5px] leading-[1.5] text-ws-ink-soft">
              {t("emailVerify.errorSubtitle")}
            </p>
            <button
              type="button"
              className="ws-btn ws-btn-primary mx-auto mt-6 justify-center"
              onClick={() =>
                void navigate(
                  `${WEBSITE_LINKS.home}?${MODAL_PARAM}=${LOGIN_MODAL_VALUE}`,
                )
              }
            >
              {t("emailVerify.goToLogin")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerifyPage;
