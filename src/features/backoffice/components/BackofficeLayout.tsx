import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import { BackofficeErrorFallback } from "@/features/backoffice/components/BackofficeErrorFallback.tsx";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { captureError } from "@/shared/lib/sentry.ts";

import { BackofficeHeader } from "./BackofficeHeader";
import { BackofficeSidebar } from "./BackofficeSidebar";

const BackofficeLayout = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <BackofficeSidebar />

        <div className="flex flex-1 flex-col">
          <BackofficeHeader />

          <main className="flex flex-1 overflow-y-auto p-6 bg-gray-50">
            <ErrorBoundary
              fallbackRender={(props) => <BackofficeErrorFallback {...props} />}
              resetKeys={[location.pathname]}
              onError={(error, info) =>
                captureError(error, { componentStack: info.componentStack })
              }
            >
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>

      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
};

export default BackofficeLayout;
