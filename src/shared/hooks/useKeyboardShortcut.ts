import { useEffect, useRef } from "react";

type UseKeyboardShortcutOptions = {
  key: string;
  shiftKey?: boolean;
  enabled?: boolean;
  ignoreWhenTyping?: boolean;
  ignoreWhenDialogOpen?: boolean;
  onTrigger: () => void;
};

const TYPING_TAGS = ["INPUT", "TEXTAREA", "SELECT"];

export const useKeyboardShortcut = ({
  key,
  shiftKey = false,
  enabled = true,
  ignoreWhenTyping = true,
  ignoreWhenDialogOpen = true,
  onTrigger,
}: UseKeyboardShortcutOptions): void => {
  const onTriggerRef = useRef(onTrigger);
  onTriggerRef.current = onTrigger;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== key || e.shiftKey !== shiftKey) return;
      if (ignoreWhenTyping) {
        const tag = (e.target as HTMLElement).tagName;
        if (TYPING_TAGS.includes(tag)) return;
      }
      if (ignoreWhenDialogOpen && document.querySelector('[role="dialog"]')) {
        return;
      }
      onTriggerRef.current();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [key, shiftKey, enabled, ignoreWhenTyping, ignoreWhenDialogOpen]);
};
