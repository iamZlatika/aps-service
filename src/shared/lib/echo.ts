import type Echo from "@ably/laravel-echo";

import type { EchoConnection } from "@/shared/lib/echoFactory";

let connection: EchoConnection | null = null;
let pendingInit: Promise<void> | null = null;
let activeToken: string | null = null;
// Bumped by every destroy/re-init so an instance created by a superseded
// initEcho call gets disconnected instead of silently staying connected.
let generation = 0;

export async function initEcho(token: string): Promise<void> {
  // useAuth runs this effect in every component that consumes it, and the
  // import below is async, so without this guard several callers would each
  // create an Echo instance and all but the last would leak an open
  // connection. One instance per token, created once.
  if (activeToken === token) {
    return pendingInit ?? Promise.resolve();
  }

  const previous = connection;
  const current = ++generation;
  connection = null;
  activeToken = token;
  previous?.echo.disconnect();

  pendingInit = (async () => {
    try {
      const { createEchoInstance } = await import("@/shared/lib/echoFactory");
      const created = createEchoInstance(token);
      if (current !== generation) {
        created.echo.disconnect();
        return;
      }
      connection = created;
    } catch (error) {
      if (current === generation) {
        activeToken = null;
      }
      throw error;
    } finally {
      if (current === generation) {
        pendingInit = null;
      }
    }
  })();

  return pendingInit;
}

export function destroyEcho(): void {
  generation++;
  pendingInit = null;
  activeToken = null;
  connection?.echo.disconnect();
  connection = null;
}

export function getEcho(): Echo | null {
  if (!connection?.isUsable) {
    return null;
  }
  return connection.echo;
}
