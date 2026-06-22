import Echo from "@ably/laravel-echo";
import Ably from "ably";
import i18next from "i18next";
import { toast } from "sonner";

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

// @ably/laravel-echo resolves Ably from window at runtime
(window as unknown as { Ably: unknown }).Ably = Ably;

export class EchoConnection {
  private failed = false;

  constructor(readonly echo: Echo) {}

  markFailed(): void {
    this.failed = true;
  }

  get isUsable(): boolean {
    return !this.failed;
  }
}

function attachConnectionListener(
  instance: Echo,
  connection: EchoConnection,
): void {
  const { connection: ablyConnection } = (instance.connector as AblyConnector)
    .ably;

  ablyConnection.on((stateChange) => {
    if (stateChange.current === "failed") {
      captureError(stateChange.reason, { source: "ably_connection" });
      toast.error(i18next.t("errors.socket_failed"));
      instance.disconnect();
      connection.markFailed();
    }
    if (stateChange.current === "suspended") {
      toast.error(i18next.t("errors.socket_suspended"));
    }
  });
}

export function createEchoInstance(token: string): EchoConnection {
  const instance = new Echo({
    broadcaster: "ably",
    authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
    auth: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });
  const connection = new EchoConnection(instance);
  attachConnectionListener(instance, connection);
  return connection;
}
