import imageCompression from "browser-image-compression";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { type RefObject } from "react";

import { usePostOrderComment } from "@/features/orders/pages/order-page/components/history-sidebar/hooks/usePostOrderComment.ts";
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
  isProcessingImage: boolean;
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

  const { postComment, isPending } = usePostOrderComment(orderId, () => {
    setComment("");
    revokePreview();
    setPendingImage(null);
  });

  const isProcessingImage =
    pendingImage !== null && pendingImage.progress < 100;

  const handleFile = async (file: File) => {
    if (pendingImage && pendingImage.progress < 100) return;

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
    isProcessingImage,
    canSend,
    fileInputRef,
    setComment,
    clearPendingImage: () => {
      revokePreview();
      setPendingImage(null);
    },
    handleFileChange,
    handleFile,
    handleSend: () =>
      postComment({
        comment: comment.trim() || undefined,
        file: pendingImage?.file,
      }),
  };
}
