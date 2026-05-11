import { useMutation, useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useState } from "react";

import { orderStatusesApi } from "@/features/backoffice/modules/dictionaries/api";
import { ordersApi } from "@/features/backoffice/modules/orders/api";

const CloseOrderModal = lazy(() =>
  import("@/features/backoffice/modules/orders/components/CloseOrderModal.tsx").then(
    (m) => ({ default: m.CloseOrderModal }),
  ),
);
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
import { useLocalizedName } from "@/shared/hooks/useLocalizedName.ts";

const CLOSED_STATUS_KEY = "closed";

interface StatusSelectProps {
  orderId: number;
  status: OrderStatus;
  remainingToPay?: string;
  onSuccess?: () => void;
}

export const StatusSelect = ({
  orderId,
  status,
  remainingToPay = "0",
  onSuccess,
}: StatusSelectProps) => {
  const getLocalizedName = useLocalizedName();
  const [closedStatusId, setClosedStatusId] = useState<number | null>(null);

  const { data } = useQuery({
    queryKey: queryKeys.dictionaries.orderStatuses(),
    queryFn: () => orderStatusesApi.getAll(1, 100),
  });

  const mutation = useMutation({
    mutationFn: (statusId: number) => ordersApi.changeStatus(orderId, statusId),
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      } else {
        return queryClient.invalidateQueries({
          queryKey: queryKeys.orders.all,
        });
      }
    },
  });

  const displayName = getLocalizedName(status);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group flex items-center gap-1 cursor-pointer focus:outline-none rounded-full">
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
              onSelect={() => {
                if (s.key === CLOSED_STATUS_KEY) {
                  setClosedStatusId(s.id);
                } else {
                  mutation.mutate(s.id);
                }
              }}
              disabled={s.id === status.id || mutation.isPending}
            >
              <StatusBadge
                name={getLocalizedName({
                  nameRu: s.name_ru,
                  nameUa: s.name_ua,
                })}
                color={s.color}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {closedStatusId !== null && (
        <Suspense>
          <CloseOrderModal
            open
            onClose={() => setClosedStatusId(null)}
            orderId={orderId}
            statusId={closedStatusId}
            remainingToPay={remainingToPay}
            onSuccess={
              onSuccess ??
              (() =>
                queryClient.invalidateQueries({
                  queryKey: queryKeys.orders.all,
                }))
            }
          />
        </Suspense>
      )}
    </>
  );
};
