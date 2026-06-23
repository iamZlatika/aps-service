import { useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import { Breadcrumbs } from "@/features/backoffice/components/Breadcrumbs.tsx";
import { ErrorFallback } from "@/features/backoffice/components/ErrorFallback.tsx";
import { Loader } from "@/shared/components/common/Loader.tsx";
import { PullToRefreshIndicator } from "@/shared/components/PullToRefreshIndicator";
import { PullToRefreshLoaderFrame } from "@/shared/components/PullToRefreshLoaderFrame";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { usePullToRefresh } from "@/shared/hooks/usePullToRefresh";
import { captureErrorWithId } from "@/shared/lib/sentry.ts";

import { Header } from "./Header.tsx";
import { Sidebar } from "./Sidebar.tsx";

const Layout = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const mainRef = useRef<HTMLElement>(null);
  const { progress, status } = usePullToRefresh(mainRef);

  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full">
        <Sidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <Header />
          <Breadcrumbs />
          <main
            ref={mainRef}
            className="relative flex-1 overflow-y-auto overflow-x-hidden bg-muted"
          >
            <PullToRefreshIndicator
              status={status}
              progress={progress}
              refreshingLabel={t("pullToRefresh.refreshing")}
            >
              <PullToRefreshLoaderFrame scaleClassName="scale-[0.44]">
                <Loader className="min-h-0 w-auto p-0" />
              </PullToRefreshLoaderFrame>
            </PullToRefreshIndicator>
            <div className="translate-y-[var(--pull-distance)]">
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                resetKeys={[location.pathname]}
                onError={(error, info) =>
                  captureErrorWithId(error, {
                    componentStack: info.componentStack,
                  })
                }
              >
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>

      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
};

export default Layout;
