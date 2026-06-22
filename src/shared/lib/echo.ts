import type Echo from "@ably/laravel-echo";

import type { EchoConnection } from "@/shared/lib/echoFactory";

let connection: EchoConnection | null = null;

export async function initEcho(token: string): Promise<void> {
  if (connection) {
    connection.echo.disconnect();
  }
  const { createEchoInstance } = await import("@/shared/lib/echoFactory");
  connection = createEchoInstance(token);
}

export function destroyEcho(): void {
  connection?.echo.disconnect();
  connection = null;
}

export function getEcho(): Echo | null {
  if (!connection?.isUsable) {
    return null;
  }
  return connection.echo;
}
