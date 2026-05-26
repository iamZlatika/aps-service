import * as React from "react";

export function useIsMobile(breakpoint = 767) {
  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mql.addEventListener("change", handler);

    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}
