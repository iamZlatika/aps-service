import { beforeEach, describe, expect, it, vi } from "vitest";

import type * as EchoModuleType from "./echo";

class FakeEchoConnection {
  private failed = false;
  readonly echo = { disconnect: vi.fn() };

  constructor(private readonly onFailed: () => void) {}

  markFailed(): void {
    this.failed = true;
    this.onFailed();
  }

  get isUsable(): boolean {
    return !this.failed;
  }
}

const created: FakeEchoConnection[] = [];
const createEchoInstance = vi.fn((_token: string, onFailed: () => void) => {
  const connection = new FakeEchoConnection(onFailed);
  created.push(connection);
  return connection;
});

vi.mock("@/shared/lib/echoFactory", () => ({
  createEchoInstance: (token: string, onFailed: () => void) =>
    createEchoInstance(token, onFailed),
}));

type EchoModule = typeof EchoModuleType;

let echoModule: EchoModule;

beforeEach(async () => {
  created.length = 0;
  createEchoInstance.mockClear();
  vi.resetModules();
  echoModule = await import("./echo");
});

describe("initEcho", () => {
  it("creates a single connection when called concurrently", async () => {
    await Promise.all([
      echoModule.initEcho("token"),
      echoModule.initEcho("token"),
      echoModule.initEcho("token"),
    ]);

    expect(createEchoInstance).toHaveBeenCalledTimes(1);
    expect(created).toHaveLength(1);
    expect(echoModule.getEcho()).toBe(created[0].echo);
  });

  it("does not create a second connection after the first one failed", async () => {
    await echoModule.initEcho("token");
    created[0].markFailed();
    expect(echoModule.getEcho()).toBeNull();

    await echoModule.initEcho("token");

    expect(createEchoInstance).toHaveBeenCalledTimes(1);
  });

  it("replaces the connection when the token changes", async () => {
    await echoModule.initEcho("old-token");
    await echoModule.initEcho("new-token");

    expect(createEchoInstance).toHaveBeenCalledTimes(2);
    expect(created[0].echo.disconnect).toHaveBeenCalled();
    expect(echoModule.getEcho()).toBe(created[1].echo);
  });

  it("disconnects the old-token connection when the token changes mid-init", async () => {
    const stale = echoModule.initEcho("old-token");
    await echoModule.initEcho("new-token");
    await stale;

    expect(created).toHaveLength(2);
    expect(created[0].echo.disconnect).toHaveBeenCalled();
    expect(created[1].echo.disconnect).not.toHaveBeenCalled();
    expect(echoModule.getEcho()).toBe(created[1].echo);
  });

  it("disconnects a connection that resolves after destroyEcho", async () => {
    const pending = echoModule.initEcho("token");
    echoModule.destroyEcho();
    await pending;

    expect(created[0].echo.disconnect).toHaveBeenCalled();
    expect(echoModule.getEcho()).toBeNull();
  });
});

describe("destroyEcho", () => {
  it("disconnects the active connection and allows a fresh one afterwards", async () => {
    await echoModule.initEcho("token");
    echoModule.destroyEcho();

    expect(created[0].echo.disconnect).toHaveBeenCalled();
    expect(echoModule.getEcho()).toBeNull();

    await echoModule.initEcho("token");

    expect(createEchoInstance).toHaveBeenCalledTimes(2);
    expect(echoModule.getEcho()).toBe(created[1].echo);
  });
});

describe("subscribeEcho", () => {
  it("notifies when the connection appears, fails and is destroyed", async () => {
    const listener = vi.fn();
    echoModule.subscribeEcho(listener);

    await echoModule.initEcho("token");
    expect(listener).toHaveBeenCalledTimes(1);

    created[0].markFailed();
    expect(listener).toHaveBeenCalledTimes(2);

    echoModule.destroyEcho();
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it("stops notifying after unsubscribe", async () => {
    const listener = vi.fn();
    const unsubscribe = echoModule.subscribeEcho(listener);
    unsubscribe();

    await echoModule.initEcho("token");

    expect(listener).not.toHaveBeenCalled();
  });
});
