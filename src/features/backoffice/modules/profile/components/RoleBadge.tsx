import { useTranslation } from "react-i18next";

import { Badge } from "@/shared/components/ui/badge.tsx";
import { getRoleBoldClassName } from "@/widgets/ability-badge/abilityColors";

interface RoleBadgeProps {
  roles: string[];
}

export const RoleBadge = ({ roles }: RoleBadgeProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-1 mt-4">
      {roles.map((role) => (
        <Badge key={role} className={getRoleBoldClassName(role)}>
          {t(`users.roles.${role}`, { defaultValue: role })}
        </Badge>
      ))}
    </div>
  );
};
