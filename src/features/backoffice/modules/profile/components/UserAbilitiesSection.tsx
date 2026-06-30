import { useTranslation } from "react-i18next";

import { Badge } from "@/shared/components/ui/badge.tsx";

type UserAbilitiesSectionProps = {
  abilities: string[];
};

type AbilityGroup = {
  key: string;
  abilities: string[];
};

const ABILITY_GROUP_KEYS = [
  "orders",
  "customers",
  "landing_works",
  "billing",
  "users",
  "dictionaries",
] as const;

function groupAbilities(abilities: string[]): AbilityGroup[] {
  const groups: AbilityGroup[] = [];

  for (const groupKey of ABILITY_GROUP_KEYS) {
    const matched = abilities.filter((a) => a.startsWith(`${groupKey}_`));
    if (matched.length > 0) {
      groups.push({ key: groupKey, abilities: matched });
    }
  }

  return groups;
}

export const UserAbilitiesSection = ({ abilities }: UserAbilitiesSectionProps) => {
  const { t } = useTranslation();
  const groups = groupAbilities(abilities);

  if (groups.length === 0) return null;

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group.key} className="flex items-start gap-3">
          <span className="text-sm text-muted-foreground w-28 shrink-0 pt-0.5">
            {t(`profile.abilities.groups.${group.key}`)}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {group.abilities.map((ability) => (
              <Badge key={ability} variant="secondary" className="text-xs font-normal">
                {t(`profile.abilities.${ability}`)}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
