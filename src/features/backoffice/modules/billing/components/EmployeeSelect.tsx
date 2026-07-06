import { useTranslation } from "react-i18next";

import {
  type EmployeeSelectValue,
  SERVICE_VALUE,
} from "@/features/backoffice/modules/billing/types.ts";
import { useManagerOptions } from "@/features/backoffice/modules/users/hooks/useManagerOptions.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

interface EmployeeSelectProps {
  value: EmployeeSelectValue;
  onChange: (value: EmployeeSelectValue) => void;
}

const CLEAR_VALUE = "__clear__";

export const EmployeeSelect = ({ value, onChange }: EmployeeSelectProps) => {
  const { t } = useTranslation();
  const { users, isLoadingUsers } = useManagerOptions();

  return (
    <Select
      value={value !== undefined ? String(value) : ""}
      onValueChange={(val) => {
        if (val === CLEAR_VALUE || !val) {
          onChange(undefined);
        } else if (val === SERVICE_VALUE) {
          onChange(SERVICE_VALUE);
        } else {
          onChange(Number(val));
        }
      }}
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
        <SelectItem value={SERVICE_VALUE}>
          {t("billing.filters.service")}
        </SelectItem>
        {users.map((u) => (
          <SelectItem key={u.id} value={String(u.id)}>
            {u.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
