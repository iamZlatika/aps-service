import { lazy, Suspense, useState } from "react";

const CloseOrderModal = lazy(() =>
  import("@/features/backoffice/modules/orders/components/CloseOrderModal.tsx").then(
    (m) => ({ default: m.CloseOrderModal }),
  ),
);
import { useQueryClient } from "@tanstack/react-query";

import { useChangeOrderStatus } from "@/features/backoffice/modules/orders/hooks/useChangeOrderStatus.ts";
import type { OrderStatus } from "@/features/backoffice/modules/orders/types.ts";
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
  const queryClient = useQueryClient();
  const [closedStatusId, setClosedStatusId] = useState<number | null>(null);

  const { statuses, changeStatus, isPending } = useChangeOrderStatus(
    orderId,
    onSuccess,
  );

  const displayName = getLocalizedName(status);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group flex items-center gap-1 cursor-pointer focus:outline-none rounded-full">
            <StatusBadge
              name={displayName}
              color={status.color}
              isPending={isPending}
              selectable
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {statuses.map((s) => (
            <DropdownMenuItem
              key={s.id}
              onSelect={() => {
                if (s.key === CLOSED_STATUS_KEY) {
                  setClosedStatusId(s.id);
                } else {
                  changeStatus(s.id, s.key);
                }
              }}
              disabled={s.id === status.id || isPending}
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
                void queryClient.invalidateQueries({
                  queryKey: queryKeys.orders.all,
                }))
            }
          />
        </Suspense>
      )}
    </>
  );
};
