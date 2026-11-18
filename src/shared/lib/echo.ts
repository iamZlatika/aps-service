import type Echo from "@ably/laravel-echo";

import type * as EchoFactory from "@/shared/lib/echoFactory";
import type { EchoConnection } from "@/shared/lib/echoFactory";

let connection: EchoConnection | null = null;
let pendingInit: Promise<void> | null = null;
let activeToken: string | null = null;
// Bumped by every destroy/re-init so an instance created by a superseded
// initEcho call gets disconnected instead of silently staying connected.
let generation = 0;
const listeners = new Set<() => void>();
let factoryModule: Promise<typeof EchoFactory> | null = null;

function loadFactory(): Promise<typeof EchoFactory> {
  factoryModule ??= import("@/shared/lib/echoFactory");
  return factoryModule;
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeEcho(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function initEcho(token: string): Promise<void> {
  // The import below is async: without this guard concurrent callers would
  // each create an instance and all but the last would leak an open connection.
  if (activeToken === token) {
    return pendingInit ?? Promise.resolve();
  }

  const previous = connection;
  const current = ++generation;
  connection = null;
  activeToken = token;
  previous?.echo.disconnect();
  if (previous) notify();

  pendingInit = (async () => {
    try {
      const { createEchoInstance } = await loadFactory();
      const created = createEchoInstance(token, notify);
      if (current !== generation) {
        created.echo.disconnect();
        return;
      }
      connection = created;
      notify();
    } catch (error) {
      factoryModule = null;
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
  const previous = connection;
  connection = null;
  previous?.echo.disconnect();
  if (previous) notify();
}

export function getEcho(): Echo | null {
  if (!connection?.isUsable) {
    return null;
  }
  return connection.echo;
}
