import { beforeEach, describe, expect, it, vi } from "vitest";

import type * as EchoModuleType from "./echo";

class FakeEchoConnection {
  private failed = false;
  readonly echo = { disconnect: vi.fn() };

  markFailed(): void {
    this.failed = true;
  }

  get isUsable(): boolean {
    return !this.failed;
  }
}

const created: FakeEchoConnection[] = [];
const createEchoInstance = vi.fn((_token: string) => {
  const connection = new FakeEchoConnection();
  created.push(connection);
  return connection;
});

vi.mock("@/shared/lib/echoFactory", () => ({
  createEchoInstance: (token: string) => createEchoInstance(token),
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
