import { Outlet } from "react-router-dom";

import { SidebarProvider } from "@/shared/components/ui/sidebar";

import { BackofficeHeader } from "./BackofficeHeader";
import { BackofficeSidebar } from "./BackofficeSidebar";

const BackofficeLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <BackofficeSidebar />
        <div className="flex flex-1 flex-col">
          <BackofficeHeader />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BackofficeLayout;
