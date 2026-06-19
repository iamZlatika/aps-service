import type Echo from "@ably/laravel-echo";

import { backofficeAuthService } from "@/features/auth/lib/authService";

let echo: Echo | null = null;

export async function initEcho(token: string): Promise<void> {
  if (echo) {
    echo.disconnect();
  }
  const { createEchoInstance } = await import("@/shared/lib/echoFactory");
  echo = createEchoInstance(token);
}

export function destroyEcho(): void {
  echo?.disconnect();
  echo = null;
}

export function getEcho(): Echo | null {
  return echo;
}

// Page refresh: echoFactory loads faster than GET /me, so echo is ready before hooks mount.
const existingToken = backofficeAuthService.getToken();
if (existingToken) {
  void initEcho(existingToken);
}
