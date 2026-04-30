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
    handleSend,
  } = useCommentForm(orderId);

  return (
    <div className="border-t px-4 py-3">
      <div className="relative">
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
                  onClick={clearPendingImage}
                  className="absolute -top-2 -right-2 rounded-full bg-background border p-1 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}

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
    </div>
  );
};
