import { useCallback, useEffect, useState } from "react";

export type MobileNavState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useMobileNav = (): MobileNavState => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // .website has overflow-y:auto — lock it, not body
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".website");
    if (!el) return;
    el.style.overflowY = isOpen ? "hidden" : "";
    return () => {
      el.style.overflowY = "";
    };
  }, [isOpen]);

  return { isOpen, open, close };
};
