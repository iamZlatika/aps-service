import type Echo from "@ably/laravel-echo";
import { useSyncExternalStore } from "react";

import { getEcho, subscribeEcho } from "@/shared/lib/echo";

export const useEcho = (): Echo | null =>
  useSyncExternalStore(subscribeEcho, getEcho);
