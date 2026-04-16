import { useCallback, useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";

export const useLeaveGuard = (isDirty: boolean) => {
  const bypassRef = useRef(false);

  const bypass = useCallback(() => {
    bypassRef.current = true;
  }, []);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !bypassRef.current &&
      isDirty &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  return { blocker, bypass };
};
