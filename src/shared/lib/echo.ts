import Echo from "@ably/laravel-echo";
import Ably from "ably";
import i18next from "i18next";
import { toast } from "sonner";

import { authService } from "@/features/auth/lib/authService";
import { captureError } from "@/shared/lib/sentry";

type AblyStateChange = {
  current: string;
  reason?: unknown;
};

type AblyConnector = {
  ably: {
    connection: {
      on: (callback: (stateChange: AblyStateChange) => void) => void;
    };
  };
};

(window as unknown as { Ably: unknown }).Ably = Ably;

let echo: Echo | null = null;

function attachConnectionListener(instance: Echo): void {
  const { connection } = (instance.connector as AblyConnector).ably;

  connection.on((stateChange) => {
    if (stateChange.current === "failed") {
      captureError(stateChange.reason, { source: "ably_connection" });
      toast.error(i18next.t("errors.socket_failed"));
    }
    if (stateChange.current === "suspended") {
      toast.error(i18next.t("errors.socket_suspended"));
    }
  });
}

function createEcho(token: string): Echo {
  const instance = new Echo({
    broadcaster: "ably",
    authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
    auth: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });
  attachConnectionListener(instance);
  return instance;
}

export function initEcho(token: string): void {
  if (echo) {
    echo.disconnect();
  }
  echo = createEcho(token);
}

export function destroyEcho(): void {
  echo?.disconnect();
  echo = null;
}

export function getEcho(): Echo | null {
  return echo;
}

const existingToken = authService.getToken();
if (existingToken) {
  echo = createEcho(existingToken);
}
