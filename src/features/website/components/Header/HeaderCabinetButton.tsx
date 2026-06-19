import { MoveRight, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useModalParam } from "@/features/website/hooks/useModalParam";
import {
  LOGIN_MODAL_VALUE,
  MODAL_PARAM,
} from "@/features/website/lib/modalParams";
import { cn } from "@/shared/lib/utils";

interface HeaderCabinetButtonProps {
  className?: string;
}

export const HeaderCabinetButton = ({
  className,
}: HeaderCabinetButtonProps) => {
  const { t } = useTranslation("website");
  const { set: openModal } = useModalParam(MODAL_PARAM);

  return (
    <button
      type="button"
      onClick={() => openModal(LOGIN_MODAL_VALUE)}
      className={cn(
        "ws-btn-cream inline-flex items-center justify-center gap-2.5",
        className,
      )}
    >
      <User className="size-3.5 shrink-0" />
      <span>{t("nav.cabinet")}</span>
      <MoveRight className="size-3.5 shrink-0" />
    </button>
  );
};
