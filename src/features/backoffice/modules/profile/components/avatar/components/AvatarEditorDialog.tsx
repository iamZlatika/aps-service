import { useRef, useState } from "react";
import type { AvatarEditorRef } from "react-avatar-editor";
import AvatarEditor from "react-avatar-editor";
import { useTranslation } from "react-i18next";

import Loader from "@/shared/components/common/Loader.tsx";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

const AVATAR_SIZE = 150;
const EDITOR_BORDER = 50;
const BORDER_RADIUS = 100;
const INITIAL_SCALE = 1.2;
const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.01;

interface AvatarEditorDialogProps {
  image: File | null;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (file: File) => void;
}

const AvatarEditorDialog = ({
  image,
  open,
  isPending,
  onOpenChange,
  onSave,
}: AvatarEditorDialogProps) => {
  const { t } = useTranslation();
  const editorRef = useRef<AvatarEditorRef>(null);
  const [scale, setScale] = useState(INITIAL_SCALE);

  const handleSave = () => {
    if (!editorRef.current) return;

    const canvas = editorRef.current.getImageScaledToCanvas();
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) return;
      const file = new File([blob], "avatar.png", { type: "image/png" });
      onSave(file);
    }, "image/png");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 rounded-lg">
            <Loader />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>{t("profile.avatar.editor_title")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          {image && (
            <AvatarEditor
              ref={editorRef}
              image={image}
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              border={EDITOR_BORDER}
              borderRadius={BORDER_RADIUS}
              color={[0, 0, 0, 0.6]}
              scale={scale}
              rotate={0}
            />
          )}
          <input
            type="range"
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={SCALE_STEP}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("profile.avatar.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? t("profile.avatar.saving") : t("profile.avatar.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarEditorDialog;
