import { MoveRight, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { WEBSITE_LINKS } from "@/features/website/navigation";
import { cn } from "@/shared/lib/utils";

interface HeaderCabinetButtonProps {
  className?: string;
}

export const HeaderCabinetButton = ({
  className,
}: HeaderCabinetButtonProps) => {
  const { t } = useTranslation("website");

  return (
    <Link
      to={WEBSITE_LINKS.account}
      className={cn(
        "ws-btn-cream inline-flex items-center justify-center gap-2.5",
        className,
      )}
    >
      <User className="size-3.5 shrink-0" />
      <span>{t("nav.cabinet")}</span>
      <MoveRight className="size-3.5 shrink-0" />
    </Link>
  );
};
