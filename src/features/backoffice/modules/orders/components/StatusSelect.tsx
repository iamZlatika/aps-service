import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { orderStatusesApi } from "@/features/backoffice/modules/dictionaries/api";
import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type { OrderStatus } from "@/features/backoffice/modules/orders/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { StatusBadge } from "@/shared/components/common/StatusBadge.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu.tsx";

interface StatusSelectProps {
  orderId: number;
  status: OrderStatus;
}

export const StatusSelect = ({ orderId, status }: StatusSelectProps) => {
  const { i18n } = useTranslation();
  const isUk = i18n.language === "uk";

  const { data } = useQuery({
    queryKey: queryKeys.dictionaries.orderStatuses(),
    queryFn: () => orderStatusesApi.getAll(1, 100),
  });

  const mutation = useMutation({
    mutationFn: (statusId: number) => ordersApi.changeStatus(orderId, statusId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
  });

  const displayName = isUk ? status.nameUa : status.nameRu;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
          <StatusBadge
            name={displayName}
            color={status.color}
            isPending={mutation.isPending}
            selectable
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {data?.items.map((s) => (
          <DropdownMenuItem
            key={s.id}
            onSelect={() => mutation.mutate(s.id)}
            disabled={s.id === status.id || mutation.isPending}
          >
            <StatusBadge name={isUk ? s.name_ua : s.name_ru} color={s.color} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
