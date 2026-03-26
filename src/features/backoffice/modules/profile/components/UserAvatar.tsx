import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, X } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import type { AvatarEditorRef } from "react-avatar-editor";
import AvatarEditor from "react-avatar-editor";
import { useTranslation } from "react-i18next";

import { profileApi } from "@/features/backoffice/modules/profile/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import Loader from "@/shared/components/common/Loader.tsx";

interface UserAvatarProps {
  userName: string;
  userAvatarUrl: string;
}

const UserAvatar = ({ userName, userAvatarUrl }: UserAvatarProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<AvatarEditorRef>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [scale, setScale] = useState(1.2);

  const uploadMutation = useMutation({
    mutationFn: profileApi.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      setIsEditorOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: profileApi.deleteAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });

  const handleChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setIsEditorOpen(true);
    }
    e.target.value = "";
  };

  const handleSave = () => {
    if (!editorRef.current) return;

    const canvas = editorRef.current.getImageScaledToCanvas();
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) return;
      const file = new File([blob], "avatar.png", { type: "image/png" });
      uploadMutation.mutate(file);
    }, "image/png");
  };

  const handleRemove = () => {
    deleteMutation.mutate();
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase() || "?";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-[150px] w-[150px]">
          <AvatarImage src={userAvatarUrl} alt={userName || "User avatar"} />
          <AvatarFallback className="text-4xl">
            {getInitial(userName)}
          </AvatarFallback>
        </Avatar>
        {deleteMutation.isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full">
            <Loader className="p-0" />
          </div>
        )}
        <button
          onClick={handleRemove}
          disabled={deleteMutation.isPending}
          className="absolute top-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md transition-opacity hover:opacity-80 disabled:opacity-50"
          aria-label={t("profile.avatar.remove")}
        >
          <X className="h-4 w-4" />
        </button>

        <button
          onClick={handleChangeClick}
          className="absolute bottom-1 left-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-opacity hover:opacity-80"
          aria-label={t("profile.avatar.change")}
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent>
          {uploadMutation.isPending && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 rounded-lg">
              <Loader />
            </div>
          )}
          <DialogHeader>
            <DialogTitle>{t("profile.avatar.editor_title")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {selectedImage && (
              <AvatarEditor
                ref={editorRef}
                image={selectedImage}
                width={150}
                height={150}
                border={50}
                borderRadius={100}
                color={[0, 0, 0, 0.6]}
                scale={scale}
                rotate={0}
              />
            )}
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
              {t("profile.avatar.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={uploadMutation.isPending}>
              {uploadMutation.isPending
                ? t("profile.avatar.saving")
                : t("profile.avatar.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAvatar;
