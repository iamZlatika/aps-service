import { useQueryClient } from "@tanstack/react-query";
import { Loader2, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { customerAuthService } from "@/features/auth/lib/authService";
import { WEBSITE_LINKS } from "@/features/website/navigation";
import { queryKeys } from "@/shared/api/queryKeys";

import { useGoogleCallback } from "./useGoogleCallback";

const GoogleCallbackPage = () => {
  const { t } = useTranslation("website");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const { data, isLoading, isSuccess, isError } = useGoogleCallback(code);

  useEffect(() => {
    if (error) {
      toast.error(t("googleCallback.accessDenied"));
      void navigate(WEBSITE_LINKS.home, { replace: true });
    }
  }, [error, navigate, t]);

  useEffect(() => {
    if (isSuccess && data) {
      customerAuthService.setToken(data.token);
      queryClient.setQueryData(queryKeys.customer.me(), data.customer);
      void navigate(WEBSITE_LINKS.home, { replace: true });
    }
  }, [isSuccess, data, navigate, queryClient]);

  useEffect(() => {
    if (isError) {
      toast.error(t("googleCallback.failed"));
      void navigate(WEBSITE_LINKS.home, { replace: true });
    }
  }, [isError, navigate, t]);

  return (
    <div className="flex min-h-[calc(100vh-var(--ws-header-height))] items-center justify-center p-6">
      <div className="w-full max-w-[400px] text-center">
        {isLoading && (
          <>
            <Loader2 className="mx-auto mb-5 size-12 animate-spin text-ws-ember-bright" />
            <p className="text-[15px] text-ws-ink-soft">
              {t("googleCallback.loading")}
            </p>
          </>
        )}

        {isError && (
          <>
            <XCircle className="mx-auto mb-5 size-12 text-ws-red-bright" />
            <p className="text-[15px] text-ws-ink-soft">
              {t("googleCallback.redirecting")}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
