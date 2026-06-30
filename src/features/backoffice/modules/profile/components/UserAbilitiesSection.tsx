import { useTranslation } from "react-i18next";

import { ABILITY_GROUPS } from "@/features/backoffice/modules/users/data.ts";
import { Badge } from "@/shared/components/ui/badge.tsx";

interface UserAbilitiesSectionProps {
  abilities: string[];
}

export const UserAbilitiesSection = ({
  abilities,
}: UserAbilitiesSectionProps) => {
  const { t } = useTranslation();

  const groups = ABILITY_GROUPS.filter((group) =>
    group.abilities.some((a) => abilities.includes(a)),
  );

  if (groups.length === 0) return null;

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group.key} className="flex items-start gap-4">
          <span className="text-sm text-muted-foreground w-32 shrink-0 pt-0.5">
            {t(`profile.abilities.groups.${group.key}`)}
          </span>
          <div className="flex flex-wrap gap-2">
            {group.abilities
              .filter((a) => abilities.includes(a))
              .map((ability) => (
                <Badge
                  key={ability}
                  variant="secondary"
                  className="text-sm font-medium px-3 py-1"
                >
                  {t(`profile.abilities.${ability}`)}
                </Badge>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
