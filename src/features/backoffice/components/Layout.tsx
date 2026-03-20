import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import { ErrorFallback } from "@/features/backoffice/components/ErrorFallback.tsx";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { captureErrorWithId } from "@/shared/lib/sentry.ts";

import { Header } from "./Header.tsx";
import { Sidebar } from "./Sidebar.tsx";

const Layout = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Header />

          <main className="flex-1 overflow-y-auto bg-gray-50">
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
          </main>
        </div>
      </div>

      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
};

export default Layout;
