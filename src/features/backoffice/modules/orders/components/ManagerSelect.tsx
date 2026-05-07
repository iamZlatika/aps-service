import { useTranslation } from "react-i18next";

import type { User } from "@/features/backoffice/modules/users/types.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

interface ManagerSelectProps {
  value: number | null | undefined;
  onChange: (value: number | undefined) => void;
  users: User[];
  isLoading: boolean;
}

export const ManagerSelect = ({
  value,
  onChange,
  users,
  isLoading,
}: ManagerSelectProps) => {
  const { t } = useTranslation();

  return (
    <Select
      value={value ? String(value) : ""}
      onValueChange={(val) => onChange(val ? Number(val) : undefined)}
      disabled={!users.length || isLoading}
    >
      <SelectTrigger className="h-11 text-base">
        <SelectValue placeholder={isLoading ? t("loader.default") : "..."} />
      </SelectTrigger>
      <SelectContent>
        {users.map((u) => (
          <SelectItem key={u.id} value={String(u.id)}>
            {u.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
