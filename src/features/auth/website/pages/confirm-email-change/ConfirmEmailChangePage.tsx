import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { customerAuthService } from "@/features/auth/lib/authService";
import { AuthModalBrand } from "@/features/auth/website/components/AuthModalBrand";
import {
  LOGIN_MODAL_VALUE,
  MODAL_PARAM,
} from "@/features/website/lib/modalParams";
import { CUSTOMER_ACCOUNT_LINKS } from "@/features/website/modules/account/navigation";
import { WEBSITE_LINKS } from "@/features/website/navigation";
import { queryKeys } from "@/shared/api/queryKeys";

import { useConfirmEmailChange } from "./useConfirmEmailChange";

const ConfirmEmailChangePage = () => {
  const { t } = useTranslation("website");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const token = searchParams.get("token");
  const { confirm, isPending, isError, data } = useConfirmEmailChange();

  useEffect(() => {
    if (data) {
      customerAuthService.setToken(data.token);
      queryClient.setQueryData(queryKeys.customer.me(), data.customer);
      void navigate(CUSTOMER_ACCOUNT_LINKS.root(), { replace: true });
    }
  }, [data, navigate, queryClient]);

  const hasToken = !!token;
  const showError = !hasToken || isError;

  return (
    <div className="flex min-h-[calc(100vh-var(--ws-header-height))] items-center justify-center p-6">
      <div className="w-full max-w-[440px] rounded-[22px] border border-ws-line bg-ws-card p-[34px_34px_28px] shadow-[0_50px_110px_-30px_rgba(0,0,0,.7)]">
        <AuthModalBrand />

        {isPending ? (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="mb-4 size-10 animate-spin text-ws-ember-bright" />
            <p className="text-[13.5px] text-ws-ink-soft">
              {t("confirmEmailChange.loading")}
            </p>
          </div>
        ) : showError ? (
          <>
            <div
              aria-hidden="true"
              className="mb-[22px] flex size-12 items-center justify-center rounded-[14px] border border-[color-mix(in_oklab,var(--ws-red)_28%,transparent)] bg-[color-mix(in_oklab,var(--ws-red)_14%,transparent)] text-ws-red-bright"
            >
              <XCircle className="size-[26px]" />
            </div>
            <h1 className="text-[22px] font-semibold text-ws-ink">
              {t("confirmEmailChange.errorTitle")}
            </h1>
            <p className="mt-2 text-pretty text-[13.5px] leading-[1.5] text-ws-ink-soft">
              {t("confirmEmailChange.errorSubtitle")}
            </p>
            <button
              type="button"
              className="ws-btn ws-btn-primary mt-6 w-full justify-center"
              onClick={() =>
                void navigate(
                  `${WEBSITE_LINKS.home}?${MODAL_PARAM}=${LOGIN_MODAL_VALUE}`,
                )
              }
            >
              {t("confirmEmailChange.goToLogin")}
            </button>
          </>
        ) : (
          <>
            <div
              aria-hidden="true"
              className="mb-[22px] flex size-12 items-center justify-center rounded-[14px] border border-[color-mix(in_oklab,var(--ws-ember-bright)_28%,transparent)] bg-[color-mix(in_oklab,var(--ws-ember-bright)_14%,transparent)] text-ws-ember-bright"
            >
              <Mail className="size-[26px]" />
            </div>
            <h1 className="text-[22px] font-semibold text-ws-ink">
              {t("confirmEmailChange.title")}
            </h1>
            <p className="mt-2 text-pretty text-[13.5px] leading-[1.5] text-ws-ink-soft">
              {t("confirmEmailChange.subtitle")}
            </p>
            <button
              type="button"
              className="ws-btn ws-btn-primary mt-6 w-full justify-center"
              onClick={() => confirm(token!)}
            >
              {t("confirmEmailChange.button")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailChangePage;
