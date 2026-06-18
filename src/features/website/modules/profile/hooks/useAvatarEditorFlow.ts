import imageCompression from "browser-image-compression";
import { type ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useAvatarDelete } from "@/features/website/modules/profile/hooks/useAvatarDelete";
import { useAvatarUpload } from "@/features/website/modules/profile/hooks/useAvatarUpload";
import { avatarFileSchema } from "@/features/website/modules/profile/profile.schema";
import { IMAGE_COMPRESSION_OPTIONS } from "@/shared/lib/imageCompression";

type UseAvatarEditorFlowReturn = {
  selectedImage: File | null;
  isEditorOpen: boolean;
  isPending: boolean;
  isSaving: boolean;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSave: (file: File) => void;
  handleDelete: () => void;
  closeEditor: () => void;
};

export const useAvatarEditorFlow = (): UseAvatarEditorFlowReturn => {
  const { t } = useTranslation("website");
  const uploadMutation = useAvatarUpload();
  const deleteMutation = useAvatarDelete();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const closeEditor = () => setIsEditorOpen(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const result = avatarFileSchema.safeParse(file);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message);
      return;
    }

    setIsCompressing(true);
    try {
      const blob = await imageCompression(
        result.data,
        IMAGE_COMPRESSION_OPTIONS,
      );
      const compressed = new File([blob], result.data.name, {
        type: blob.type,
      });
      setSelectedImage(compressed);
      setIsEditorOpen(true);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSave = (file: File) => {
    uploadMutation.mutate(file, {
      onSuccess: () => {
        toast.success(t("cabinet.avatarUpdated"));
        closeEditor();
      },
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => toast.success(t("cabinet.avatarRemoved")),
    });
  };

  return {
    selectedImage,
    isEditorOpen,
    isPending:
      uploadMutation.isPending || deleteMutation.isPending || isCompressing,
    isSaving: uploadMutation.isPending,
    handleFileChange,
    handleSave,
    handleDelete,
    closeEditor,
  };
};
