import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AvatarEditorRef } from "react-avatar-editor";
import AvatarEditor from "react-avatar-editor";
import { useTranslation } from "react-i18next";

import { WebsiteModal } from "@/features/website/components/WebsiteModal";

const AVATAR_SIZE = 150;
const EDITOR_BORDER = 50;
const BORDER_RADIUS = 100;
const INITIAL_SCALE = 1.2;
const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.01;

interface AvatarEditorModalProps {
  image: File | null;
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
}

export const AvatarEditorModal = ({
  image,
  open,
  isPending,
  onClose,
  onSave,
}: AvatarEditorModalProps) => {
  const { t } = useTranslation("website");
  const editorRef = useRef<AvatarEditorRef>(null);
  const [scale, setScale] = useState(INITIAL_SCALE);

  useEffect(() => {
    setScale(INITIAL_SCALE);
  }, [image]);

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
    <WebsiteModal open={open} onClose={onClose} maxWidth="max-w-[440px]">
      <div className="p-[34px_34px_28px]">
        <h2 className="text-[22px] font-light text-ws-ink">
          {t("cabinet.avatarEditorTitle")}
        </h2>

        <div className="mt-[18px] flex flex-col items-center gap-4">
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
            aria-label={t("cabinet.avatarZoom")}
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={SCALE_STEP}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full accent-ws-ember"
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="ws-btn ws-btn-ghost flex-1 justify-center"
          >
            {t("cabinet.cancel")}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="ws-btn ws-btn-primary flex-1 justify-center"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              t("cabinet.save")
            )}
          </button>
        </div>
      </div>
    </WebsiteModal>
  );
};
