import { Camera, Loader2, X } from "lucide-react";
import { lazy, Suspense, useRef } from "react";
import { useTranslation } from "react-i18next";

import { type Customer } from "@/features/auth/website/types";
import { getInitial } from "@/features/website/lib/service";
import { useAvatarEditorFlow } from "@/features/website/modules/profile/hooks/useAvatarEditorFlow";

const AvatarEditorModal = lazy(() =>
  import("@/features/website/modules/profile/pages/components/AvatarEditorModal").then(
    (module) => ({ default: module.AvatarEditorModal }),
  ),
);

interface ProfileAvatarProps {
  customer: Customer;
}

export const ProfileAvatar = ({ customer }: ProfileAvatarProps) => {
  const { t } = useTranslation("website");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    selectedImage,
    isEditorOpen,
    isPending,
    isSaving,
    handleFileChange,
    handleSave,
    handleDelete,
    closeEditor,
  } = useAvatarEditorFlow();

  const avatarInitial = getInitial(
    customer?.portalName || t("cabinet.defaultName"),
  );

  return (
    <div className="relative shrink-0">
      <div className="relative flex size-16 select-none items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-ws-ember to-ws-ember-deep text-[26px] font-semibold text-white">
        {customer.avatarUrl ? (
          <img
            src={customer.avatarUrl}
            alt={t("cabinet.defaultName")}
            className="size-full object-cover"
          />
        ) : (
          avatarInitial
        )}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2
              className="size-5 animate-spin text-white"
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {customer.avatarUrl && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          aria-label={t("cabinet.removeAvatar")}
          className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border border-ws-line bg-ws-bg-2 text-ws-ink-soft transition-colors hover:text-ws-ink disabled:opacity-55"
        >
          <X className="size-3" aria-hidden="true" />
        </button>
      )}

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        aria-label={t("cabinet.changeAvatar")}
        className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border border-ws-line bg-ws-bg-2 text-ws-ink-soft transition-colors hover:text-ws-ink disabled:opacity-55"
      >
        <Camera className="size-3" aria-hidden="true" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Suspense>
        <AvatarEditorModal
          image={selectedImage}
          open={isEditorOpen}
          isPending={isSaving}
          onClose={closeEditor}
          onSave={handleSave}
        />
      </Suspense>
    </div>
  );
};
