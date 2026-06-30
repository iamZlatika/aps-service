import { useTranslation } from "react-i18next";

import { Badge } from "@/shared/components/ui/badge.tsx";

type RoleBadgeProps = {
  roles: string[];
};

const ROLE_STYLES: Record<string, string> = {
  head_manager:
    "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black font-semibold",
  manager: "bg-blue-500 text-white font-semibold",
  receptionist: "bg-teal-500 text-white font-semibold",
  accountant: "bg-purple-500 text-white font-semibold",
  support: "bg-orange-500 text-white font-semibold",
};

export const RoleBadge = ({ roles }: RoleBadgeProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-1 mt-4">
      {roles.map((role) => (
        <Badge
          key={role}
          className={ROLE_STYLES[role] ?? "bg-gray-400 text-white"}
        >
          {t(`users.roles.${role}`, { defaultValue: role })}
        </Badge>
      ))}
    </div>
  );
};
