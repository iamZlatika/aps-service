import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent, useRef, useState } from "react";
import { type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type PendingImage = {
  file: File;
  previewUrl: string;
  progress: number;
};

type UseCommentFormReturn = {
  comment: string;
  pendingImage: PendingImage | null;
  isPending: boolean;
  canSend: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  setComment: (value: string) => void;
  clearPendingImage: () => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSend: () => void;
};

export function useCommentForm(orderId: number): UseCommentFormReturn {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comment, setComment] = useState("");
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);

  const { mutate: sendComment, isPending } = useMutation({
    mutationFn: () =>
      ordersApi.postComment(orderId, {
        comment: comment.trim() || undefined,
        file: pendingImage?.file,
      }),
    onSuccess: () => {
      setComment("");
      setPendingImage(null);
      toast.success(t("orders.successAddComment"));
      return queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(orderId),
      });
    },
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

  return {
    comment,
    pendingImage,
    isPending,
    canSend,
    fileInputRef,
    setComment,
    clearPendingImage: () => setPendingImage(null),
    handleFileChange,
    handleSend: () => sendComment(undefined),
  };
}
