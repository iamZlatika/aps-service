import { useTranslation } from "react-i18next";

import { useManagerOptions } from "@/features/backoffice/modules/users/hooks/useManagerOptions.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

interface EmployeeSelectProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

const CLEAR_VALUE = "__clear__";

export const EmployeeSelect = ({ value, onChange }: EmployeeSelectProps) => {
  const { t } = useTranslation();
  const { users, isLoadingUsers } = useManagerOptions();

  return (
    <Select
      value={value ? String(value) : ""}
      onValueChange={(val) =>
        onChange(val === CLEAR_VALUE || !val ? undefined : Number(val))
      }
      disabled={!users.length || isLoadingUsers}
    >
      <SelectTrigger className="h-9 text-sm w-48">
        <SelectValue
          placeholder={
            isLoadingUsers ? t("loader.default") : t("billing.filters.employee")
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={CLEAR_VALUE}>—</SelectItem>
        {users.map((u) => (
          <SelectItem key={u.id} value={String(u.id)}>
            {u.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
