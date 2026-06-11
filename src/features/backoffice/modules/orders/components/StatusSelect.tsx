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
const STATUSES_THAT_RESET_IS_CALLED = [
  "waiting_for_approval",
  "ready",
] as const;

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
    mutationFn: ({ id }: { id: number; key: string }) =>
      ordersApi.changeStatus(orderId, id),
    onSuccess: (_, { key }) => {
      const resetsIsCalled = (
        STATUSES_THAT_RESET_IS_CALLED as readonly string[]
      ).includes(key);
      if (onSuccess) {
        onSuccess();
        if (resetsIsCalled) {
          queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
        }
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
                  mutation.mutate({ id: s.id, key: s.key });
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
