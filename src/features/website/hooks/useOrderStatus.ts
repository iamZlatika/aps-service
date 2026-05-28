import { useMutation } from "@tanstack/react-query";

import { websiteApi } from "@/features/website/api";
import { type OrderPreview } from "@/features/website/types";

type UseOrderStatusParams = {
  onSuccess: (data: OrderPreview) => void;
};

type UseOrderStatusReturn = {
  onSubmit: (orderNumber: string) => void;
  resetError: () => void;
  isPending: boolean;
  error: Error | null;
};

export const useOrderStatus = ({
  onSuccess,
}: UseOrderStatusParams): UseOrderStatusReturn => {
  const mutation = useMutation<OrderPreview, Error, string>({
    mutationFn: (orderNumber) => websiteApi.getOrderStatus(orderNumber),
    onSuccess,
  });

  return {
    onSubmit: mutation.mutate,
    resetError: mutation.reset,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
