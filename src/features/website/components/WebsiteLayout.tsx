import "@/features/website/styles/website.css";

import { lazy, Suspense, useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import { WebsiteErrorFallback } from "@/features/website/components/ErrorFallback";
import { Footer } from "@/features/website/components/Footer";
import { Header } from "@/features/website/components/Header";
import { WebsiteLoader } from "@/features/website/components/Loader";
import WebsitePageSeo from "@/features/website/components/WebsitePageSeo";
import { useMobileNav } from "@/features/website/hooks/useMobileNav";
import { useWebsiteThemeManager } from "@/features/website/hooks/useWebsiteThemeManager";
import { CUSTOMER_ACCOUNT_LINKS } from "@/features/website/modules/account/navigation";
import { WebsiteThemeContext } from "@/features/website/websiteTheme";
import { PullToRefreshIndicator } from "@/shared/components/PullToRefreshIndicator";
import { PullToRefreshLoaderFrame } from "@/shared/components/PullToRefreshLoaderFrame";
import { usePullToRefresh } from "@/shared/hooks/usePullToRefresh";
import { LANG_STORAGE_KEY } from "@/shared/lib/constants";
import { captureErrorWithId } from "@/shared/lib/sentry";
import { storageGet } from "@/shared/lib/storage";
import { cn } from "@/shared/lib/utils";
import { USER_LANGUAGES, type UserLanguage } from "@/shared/types";

const ForgotPasswordModal = lazy(() =>
  import("@/features/auth/website/pages/forgot/ForgotPasswordModal").then(
    (m) => ({ default: m.ForgotPasswordModal }),
  ),
);
const LoginModal = lazy(() =>
  import("@/features/auth/website/pages/login/LoginModal").then((m) => ({
    default: m.LoginModal,
  })),
);
const RegistrationModal = lazy(() =>
  import("@/features/auth/website/pages/registration/RegistrationModal").then(
    (m) => ({ default: m.RegistrationModal }),
  ),
);

const DEFAULT_LANG: UserLanguage = USER_LANGUAGES.UK;

export const WebsiteLayout = () => {
  const { i18n, t } = useTranslation("website");
  const { changeLanguage } = i18n;
  const location = useLocation();
  const themeValue = useWebsiteThemeManager();
  const { isOpen: isNavOpen, open: openNav, close: closeNav } = useMobileNav();
  const rootRef = useRef<HTMLDivElement>(null);
  const { progress, status } = usePullToRefresh(rootRef);

  useEffect(() => {
    const saved = storageGet(LANG_STORAGE_KEY);
    const lang =
      saved === USER_LANGUAGES.UK || saved === USER_LANGUAGES.RU
        ? saved
        : DEFAULT_LANG;
    void changeLanguage(lang);
  }, [changeLanguage]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let resizeObserver: ResizeObserver | null = null;

    const attachToHeader = (header: HTMLElement) => {
      resizeObserver = new ResizeObserver(() => {
        root.style.setProperty(
          "--ws-header-height",
          `${header.offsetHeight}px`,
        );
      });
      resizeObserver.observe(header);
    };

    const header = root.querySelector<HTMLElement>(":scope > header");
    if (header) {
      attachToHeader(header);
      return () => resizeObserver?.disconnect();
    }

    const mutationObserver = new MutationObserver(() => {
      const h = root.querySelector<HTMLElement>(":scope > header");
      if (h) {
        mutationObserver.disconnect();
        attachToHeader(h);
      }
    });
    mutationObserver.observe(root, { childList: true });

    return () => {
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <WebsiteThemeContext.Provider value={themeValue}>
      <WebsitePageSeo />
      <div
        ref={rootRef}
        className={cn(
          "website relative flex min-h-screen flex-col",
          themeValue.resolvedTheme === "light" && "light",
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-ws-md focus:bg-ws-bg-2 focus:px-4 focus:py-2 focus:text-ws-ink focus:outline focus:outline-ws-ember-bright"
        >
          {t("nav.skipToContent")}
        </a>
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ws-bg">
              <WebsiteLoader />
            </div>
          }
        >
          <ErrorBoundary
            FallbackComponent={WebsiteErrorFallback}
            resetKeys={[location.pathname]}
            onError={(error, info) =>
              captureErrorWithId(error, {
                componentStack: info.componentStack,
              })
            }
          >
            <Header
              isNavOpen={isNavOpen}
              openNav={openNav}
              closeNav={closeNav}
            />
            <div className="relative flex flex-1 flex-col">
              <PullToRefreshIndicator
                status={status}
                progress={progress}
                refreshingLabel={t("pullToRefresh.refreshing")}
              >
                <PullToRefreshLoaderFrame scaleClassName="scale-[0.6]">
                  <WebsiteLoader />
                </PullToRefreshLoaderFrame>
              </PullToRefreshIndicator>
              <div className="flex flex-1 flex-col translate-y-[var(--pull-distance)]">
                <main id="main-content" className="flex-1">
                  <Outlet />
                </main>
                <Footer />
              </div>
            </div>
          </ErrorBoundary>
        </Suspense>
        <Suspense fallback={null}>
          <LoginModal redirectTo={CUSTOMER_ACCOUNT_LINKS.root()} />
          <RegistrationModal />
          <ForgotPasswordModal />
        </Suspense>
        <Toaster richColors position="top-right" />
      </div>
    </WebsiteThemeContext.Provider>
  );
};

export default WebsiteLayout;
