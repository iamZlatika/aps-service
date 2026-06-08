import { Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { type Work } from "@/entities/work/types";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import { WorkCard } from "@/widgets/work-card";

interface WorkPreviewModalProps {
  work: Work | null;
  onClose: () => void;
  onConfirm?: () => void;
  isPending?: boolean;
}

export const WorkPreviewModal = ({
  work,
  onClose,
  onConfirm,
  isPending,
}: WorkPreviewModalProps) => {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (work !== null) setIsDark(true);
  }, [work]);

  const themeClass = isDark ? "ws-theme-dark" : "ws-theme-light";

  return (
    <Dialog open={work !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        hideClose
        className="flex max-h-[90vh] max-w-4xl flex-col gap-0 overflow-hidden p-0"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{t("works.preview.title")}</DialogTitle>
        </DialogHeader>

        {work && (
          <>
            <div className={cn(themeClass, "min-h-0 flex-1 overflow-y-auto")}>
              <div className="flex items-center justify-between border-b border-ws-line px-4 py-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ws-ink-mute">
                  {t("works.preview.title")}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      aria-label={t("works.preview.darkTheme")}
                      aria-pressed={isDark}
                      onClick={() => setIsDark(true)}
                      className={cn(
                        "flex size-8 items-center justify-center rounded-[8px] border transition-colors",
                        isDark
                          ? "border-ws-ember text-ws-ember-bright"
                          : "border-ws-line text-ws-ink-mute hover:border-ws-ink-mute hover:text-ws-ink",
                      )}
                    >
                      <Moon className="size-[14px]" />
                    </button>
                    <button
                      type="button"
                      aria-label={t("works.preview.lightTheme")}
                      aria-pressed={!isDark}
                      onClick={() => setIsDark(false)}
                      className={cn(
                        "flex size-8 items-center justify-center rounded-[8px] border transition-colors",
                        !isDark
                          ? "border-ws-ember text-ws-ember-bright"
                          : "border-ws-line text-ws-ink-mute hover:border-ws-ink-mute hover:text-ws-ink",
                      )}
                    >
                      <Sun className="size-[14px]" />
                    </button>
                  </div>
                  <div className="h-5 w-px bg-ws-line" />
                  <DialogClose className="flex size-8 items-center justify-center rounded-[8px] border border-ws-line text-ws-ink-mute transition-colors hover:border-ws-ink-mute hover:text-ws-ink">
                    <X className="size-[14px]" />
                  </DialogClose>
                </div>
              </div>

              <div className="p-4">
                <WorkCard work={work} isReverse={false} />
              </div>
            </div>

            {onConfirm && (
              <div className="flex items-center justify-end gap-3 border-t px-4 py-3">
                <Button variant="outline" onClick={onClose}>
                  {t("works.preview.back")}
                </Button>
                <Button onClick={onConfirm} disabled={isPending}>
                  {t("works.preview.confirm")}
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
