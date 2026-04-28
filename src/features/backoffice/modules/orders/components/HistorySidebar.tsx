import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { ImagePlus, SendHorizonal, X } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress.tsx";
import { Textarea } from "@/shared/components/ui/textarea.tsx";
import { notifyError } from "@/shared/lib/errors/services.ts";

interface PendingImage {
  file: File;
  previewUrl: string;
  progress: number;
}

interface HistorySidebarProps {
  orderId: number;
}

const HistorySidebar = ({ orderId }: HistorySidebarProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [comment, setComment] = useState("");

  const { mutate: sendComment, isPending } = useMutation({
    mutationFn: () =>
      ordersApi.postComment(orderId, {
        comment: comment.trim() || undefined,
        file: pendingImage?.file,
      }),
    onSuccess: () => {
      setComment("");
      setPendingImage(null);
      toast.success(i18next.t("orders.successAddComment"));
      return queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(orderId),
      });
    },
    onError: notifyError,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingImage({ file, previewUrl: "", progress: 0 });

    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        setPendingImage((prev) =>
          prev
            ? {
                ...prev,
                progress: Math.round((event.loaded / event.total) * 100),
              }
            : null,
        );
      }
    };

    reader.onload = () => {
      setPendingImage((prev) =>
        prev
          ? { ...prev, previewUrl: reader.result as string, progress: 100 }
          : null,
      );
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const canSend =
    !isPending && (comment.trim().length > 0 || pendingImage?.progress === 100);

  return (
    <aside className="w-[20%] min-w-80 max-w-[800px] shrink-0 border-l bg-background flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-3 border-b">
        <h2 className="font-semibold text-base">{t("orders.history.title")}</h2>
      </div>

      <div className="flex-1 px-4 py-3" />

      <div className="border-t px-4 py-3">
        <div className="relative">
          {/* Preview (overlay, не ломает layout) */}
          {pendingImage && (
            <div className="absolute bottom-full mb-2 left-0">
              {pendingImage.progress < 100 ? (
                <div className="w-40">
                  <Progress value={pendingImage.progress} />
                </div>
              ) : (
                <div className="relative w-fit">
                  <img
                    src={pendingImage.previewUrl}
                    alt=""
                    className="h-20 w-20 rounded-md object-cover border shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setPendingImage(null)}
                    className="absolute -top-2 -right-2 rounded-full bg-background border p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Input row */}
          <div className="flex items-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Upload button — заметнее */}
            <Button
              variant="secondary"
              className="h-10 w-10 shrink-0"
              disabled={isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-5 w-5" />
            </Button>

            {/* Textarea */}
            <div className="flex-1">
              <Textarea
                className="min-h-[40px] max-h-32 resize-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Send button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0"
              disabled={!canSend}
              onClick={() => sendComment(undefined)}
            >
              <SendHorizonal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default HistorySidebar;
