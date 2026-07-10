import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { usersApi } from "@/features/backoffice/modules/users/api";
import { useFilterParams } from "@/features/backoffice/widgets/table/hooks/useFilterParams.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

const ALL_VALUE = "__all__";

const QuickOrdersFilterBar = () => {
  const { t } = useTranslation();
  const { filters, setFilter } = useFilterParams();

  const { data } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => usersApi.getAll(1, 100),
  });
  const managers = data?.items ?? [];

  return (
    <div className="flex items-center gap-1">
      <Select
        value={filters.manager_id ?? ALL_VALUE}
        onValueChange={(val) =>
          setFilter("manager_id", val === ALL_VALUE ? "" : val)
        }
      >
        <SelectTrigger className="h-9 text-sm w-48">
          <SelectValue placeholder={t("quickOrders.filters.manager")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>
            {t("quickOrders.filters.all_managers")}
          </SelectItem>
          {managers.map((manager) => (
            <SelectItem key={manager.id} value={String(manager.id)}>
              {manager.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {filters.manager_id && (
        <button
          type="button"
          onClick={() => setFilter("manager_id", "")}
          aria-label={t("quickOrders.filters.clear")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default QuickOrdersFilterBar;
