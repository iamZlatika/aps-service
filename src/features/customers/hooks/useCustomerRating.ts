import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import { useCallback } from "react";
import { toast } from "sonner";

import { customersApi } from "@/features/customers/api";
import { updateCustomerCache } from "@/features/customers/lib/cache.ts";
import type { RatingValue } from "@/features/customers/types.ts";

type UseCustomerRatingReturn = {
  handleRatingChange: (rating: RatingValue) => void;
  isRatingPending: boolean;
};

export const useCustomerRating = (
  customerId: number | null,
  onSuccess?: () => void,
): UseCustomerRatingReturn => {
  const changeRatingMutation = useMutation({
    mutationFn: ({ id, rating }: { id: number; rating: RatingValue }) =>
      customersApi.changeCustomerRating(id, rating!),
    onSuccess: async (updatedCustomer) => {
      await updateCustomerCache(updatedCustomer);
      toast.success(i18next.t("customers.profile.rating_updated"));
      onSuccess?.();
    },
  });

  const handleRatingChange = useCallback(
    (rating: RatingValue) => {
      if (customerId && rating !== null) {
        changeRatingMutation.mutate({ id: customerId, rating });
      }
    },
    [changeRatingMutation, customerId],
  );

  return {
    handleRatingChange,
    isRatingPending: changeRatingMutation.isPending,
  };
};
