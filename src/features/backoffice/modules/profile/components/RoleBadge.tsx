import { useTranslation } from "react-i18next";

import { Badge } from "@/shared/components/ui/badge.tsx";

type RoleBadgeProps = {
  role: string;
};

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const { t } = useTranslation();

  const roleStyles: Record<string, string> = {
    head_manager:
      "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black font-semibold", // золотой
    manager: "bg-blue-500 text-white font-semibold", // синий для обычного мастера
  };

  return (
    <Badge className={`mt-4 ${roleStyles[role] || "bg-gray-400 text-white"}`}>
      {t(`users.${role}`)}
    </Badge>
  );
};
