import { ImagePlus, SendHorizonal, X } from "lucide-react";

import { useCommentForm } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/hooks/useCommentForm.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Progress } from "@/shared/components/ui/progress.tsx";
import { Textarea } from "@/shared/components/ui/textarea.tsx";

interface CommentsFormProps {
  orderId: number;
}

export const CommentsForm = ({ orderId }: CommentsFormProps) => {
  const {
    comment,
    pendingImage,
    isPending,
    canSend,
    fileInputRef,
    setComment,
    clearPendingImage,
    handleFileChange,
    handleFile,
    handleSend,
  } = useCommentForm(orderId);

  return (
    <div className="border-t px-4 py-3 space-y-3">
      {pendingImage &&
        (pendingImage.progress < 100 ? (
          <div className="w-40">
            <Progress value={pendingImage.progress} />
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <img
                src={pendingImage.previewUrl}
                alt=""
                className="h-20 w-20 rounded-md object-cover border shadow"
              />
              <button
                type="button"
                onClick={clearPendingImage}
                className="absolute -top-2 -right-2 rounded-full bg-background border p-1 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>
            <div className="min-w-0 space-y-1">
              <p className="break-all text-sm">{pendingImage.file.name}</p>
              <p className="text-sm text-muted-foreground">
                {pendingImage.file.size >= 1024 * 1024
                  ? `${(pendingImage.file.size / 1024 / 1024).toFixed(1)} MB`
                  : `${(pendingImage.file.size / 1024).toFixed(0)} KB`}
              </p>
            </div>
          </div>
        ))}

      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          variant="secondary"
          className="h-10 w-10 shrink-0"
          disabled={isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <Textarea
            className="min-h-[40px] max-h-32 resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isPending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && canSend) {
                e.preventDefault();
                handleSend();
              }
            }}
            onPaste={(e) => {
              const file = Array.from(e.clipboardData.files).find((f) =>
                f.type.startsWith("image/"),
              );
              if (file) {
                e.preventDefault();
                void handleFile(file);
              }
            }}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0"
          disabled={!canSend}
          onClick={handleSend}
        >
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
