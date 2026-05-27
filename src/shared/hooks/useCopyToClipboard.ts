import i18next from "i18next";
import { useState } from "react";
import { toast } from "sonner";

const COPIED_RESET_MS = 2000;

export function useCopyToClipboard(): {
  copied: boolean;
  copy: (text: string) => void;
} {
  const [copied, setCopied] = useState(false);

  const copy = (text: string) => {
    void navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), COPIED_RESET_MS);
      })
      .catch(() => {
        toast.error(i18next.t("errors.clipboard_error"));
      });
  };

  return { copied, copy };
}
