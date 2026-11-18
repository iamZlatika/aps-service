import { useEffect, useSyncExternalStore } from "react";
import { Outlet } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { authService } from "@/features/auth/lib/authService.ts";
import { destroyEcho, initEcho } from "@/shared/lib/echo.ts";

const getToken = (): string | undefined => authService.getToken();

// Owns the single Echo connection of a backoffice session. Mounted once above
// the layout: nested ProtectedRoutes come and go with navigation, so they must
// not open or close it.
export const RealtimeSession = () => {
  const { user } = useAuth();
  const token = useSyncExternalStore(authService.subscribe, getToken);
  const isReady = !!user;

  useEffect(() => {
    if (!isReady || !token) return;
    void initEcho(token);
    return () => destroyEcho();
  }, [isReady, token]);

  return <Outlet />;
};
