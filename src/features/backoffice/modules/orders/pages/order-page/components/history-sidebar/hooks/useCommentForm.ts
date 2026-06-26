import { useMutation, useQueryClient } from "@tanstack/react-query";
import imageCompression from "browser-image-compression";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type { OrderInfo } from "@/features/backoffice/modules/orders/types";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { IMAGE_COMPRESSION_OPTIONS } from "@/shared/lib/imageCompression.ts";

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
  handleFile: (file: File) => Promise<void>;
  handleSend: () => void;
};

const MAX_BYTES = IMAGE_COMPRESSION_OPTIONS.maxSizeMB * 1024 * 1024;

export function useCommentForm(orderId: number): UseCommentFormReturn {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [comment, setComment] = useState("");
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const revokePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const { mutate: sendComment, isPending } = useMutation({
    mutationFn: () =>
      ordersApi.postComment(orderId, {
        comment: comment.trim() || undefined,
        file: pendingImage?.file,
      }),
    onSuccess: (newComment) => {
      setComment("");
      revokePreview();
      setPendingImage(null);
      toast.success(t("orders.successAddComment"));
      queryClient.setQueryData<OrderInfo>(
        queryKeys.orders.detail(orderId),
        (old) =>
          old ? { ...old, comments: [...old.comments, newComment] } : old,
      );
    },
  });

  const handleFile = async (file: File) => {
    setPendingImage({ file, previewUrl: "", progress: 0 });

    let finalFile = file;

    if (file.size > MAX_BYTES) {
      const blob = await imageCompression(file, {
        ...IMAGE_COMPRESSION_OPTIONS,
        onProgress: (p) => {
          setPendingImage((prev) => (prev ? { ...prev, progress: p } : null));
        },
      });
      finalFile = new File([blob], file.name, { type: blob.type });
    }

    revokePreview();
    const previewUrl = URL.createObjectURL(finalFile);
    previewUrlRef.current = previewUrl;

    setPendingImage({ file: finalFile, previewUrl, progress: 100 });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    void handleFile(file);
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
    clearPendingImage: () => {
      revokePreview();
      setPendingImage(null);
    },
    handleFileChange,
    handleFile,
    handleSend: () => sendComment(undefined),
  };
}
