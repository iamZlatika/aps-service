import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { locationApi } from "@/features/dictionaries/api";
import type { Location } from "@/features/dictionaries/types.ts";
import { ordersApi } from "@/features/orders/api";
import { queryKeys } from "@/shared/api/queryKeys";
import { notifyError } from "@/shared/lib/errors/services.ts";

type UseChangeOrderLocationReturn = {
  locations: Location[];
  isLoadingLocations: boolean;
  changeLocation: (locationId: number) => void;
  isPending: boolean;
};

export function useChangeOrderLocation(
  orderId: number,
  onSuccess: () => void,
): UseChangeOrderLocationReturn {
  const queryClient = useQueryClient();

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: queryKeys.dictionaries.locations(),
    queryFn: () => locationApi.getAll(1, 100),
  });

  const mutation = useMutation({
    mutationFn: (locationId: number) =>
      ordersApi.changeLocation(orderId, locationId),
    onSuccess: () => {
      toast.success(i18next.t("orders.changeLocation.success"));
      onSuccess();
      return queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(orderId),
      });
    },
    onError: (error) => notifyError(error),
  });

  return {
    locations: locationsData?.items ?? [],
    isLoadingLocations,
    changeLocation: mutation.mutate,
    isPending: mutation.isPending,
  };
}
