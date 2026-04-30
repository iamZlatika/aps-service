import { X } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import AvatarEditorDialog from "@/features/backoffice/modules/profile/components/avatar/components/AvatarEditorDialog.tsx";
import { useAvatarDelete } from "@/features/backoffice/modules/profile/components/avatar/hooks/useAvatarDelete.ts";
import { useAvatarUpload } from "@/features/backoffice/modules/profile/components/avatar/hooks/useAvatarUpload.ts";
import EditButton from "@/features/backoffice/modules/profile/components/buttons/EditButton.tsx";
import { isCustomAvatar } from "@/features/backoffice/modules/profile/lib/isCusttomAvatar.ts";
import Loader from "@/shared/components/common/Loader.tsx";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { useIsMobile } from "@/shared/hooks/useMobile.ts";

const AVATAR_DISPLAY_SIZE = 150;

interface UserAvatarProps {
  userName: string;
  userAvatarUrl: string;
}

const UserAvatar = ({ userName, userAvatarUrl }: UserAvatarProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const uploadMutation = useAvatarUpload();
  const deleteMutation = useAvatarDelete();

  const hasCustomAvatar = isCustomAvatar(userAvatarUrl);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setIsEditorOpen(true);
    }
    e.target.value = "";
  };

  const handleUpload = (file: File) => {
    uploadMutation.mutate(file, {
      onSuccess: () => setIsEditorOpen(false),
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar
          style={{
            width: isMobile ? 100 : AVATAR_DISPLAY_SIZE,
            height: isMobile ? 100 : AVATAR_DISPLAY_SIZE,
          }}
        >
          <AvatarImage src={userAvatarUrl} alt={userName || "User avatar"} />
        </Avatar>

        {deleteMutation.isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full">
            <Loader className="p-0" />
          </div>
        )}

        {hasCustomAvatar && (
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="absolute top-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md transition-opacity hover:opacity-80 disabled:opacity-50"
            aria-label={t("profile.avatar.remove")}
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <EditButton
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-1 left-1 h-8 w-8"
          label={t("profile.avatar.change")}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <AvatarEditorDialog
        image={selectedImage}
        open={isEditorOpen}
        isPending={uploadMutation.isPending}
        onOpenChange={setIsEditorOpen}
        onSave={handleUpload}
      />
    </div>
  );
};

export default UserAvatar;
