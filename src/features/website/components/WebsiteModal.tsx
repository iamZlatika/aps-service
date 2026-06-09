import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/shared/lib/utils";

interface WebsiteModalProps {
  open: boolean;
  onClose: () => void;
  maxWidth?: string;
  children: ReactNode;
}

export const WebsiteModal = ({
  open,
  onClose,
  maxWidth = "max-w-[860px]",
  children,
}: WebsiteModalProps) => {
  const { t } = useTranslation("website");
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.querySelector<HTMLElement>(".website"));
  }, []);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal container={container ?? undefined}>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-[rgba(8,6,4,.55)] backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "fixed z-[201] flex flex-col",
            "w-[calc(100%-40px)]",
            maxWidth,
            "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "max-h-[calc(100vh-40px)]",
            "max-sm:left-0 max-sm:top-0 max-sm:h-screen max-sm:max-h-screen max-sm:w-screen max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0",
            "rounded-[22px] max-sm:rounded-none",
            "border border-ws-line bg-ws-bg-2",
            "shadow-[0_50px_110px_-30px_rgba(0,0,0,.7)]",
            "overflow-hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=open]:zoom-in-95",
          )}
        >
          <DialogPrimitive.Close className="absolute right-[18px] top-[18px] z-10 flex size-[36px] items-center justify-center rounded-[10px] border border-ws-line text-ws-ink-soft transition-colors hover:border-ws-ink-mute hover:text-ws-ink">
            <X className="size-[15px]" />
            <span className="sr-only">{t("priceModal.close")}</span>
          </DialogPrimitive.Close>

          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
