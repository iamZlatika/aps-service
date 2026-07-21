import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { billingApi } from "@/features/billing/api";
import type { Transaction } from "@/features/billing/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseWithdrawalActionsReturn = {
  approve: (id: number) => void;
  reject: (id: number) => void;
  isPending: boolean;
};

export const useWithdrawalActions = (): UseWithdrawalActionsReturn => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const invalidateAfterDecision = (transaction: Transaction): void => {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.billing.allTransactions(),
    });
    void queryClient.invalidateQueries({
      queryKey: queryKeys.billing.balances(),
    });
    void queryClient.invalidateQueries({
      queryKey: queryKeys.billing.withdrawalRequests(),
    });
    void queryClient.invalidateQueries({
      queryKey: queryKeys.billing.myTransactions(),
    });
    if (transaction.user?.id === currentUser?.id) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    }
  };

  const approveMutation = useMutation({
    mutationFn: (id: number) => billingApi.approveWithdrawal(id),
    onSuccess: (transaction) => {
      invalidateAfterDecision(transaction);
      toast.success(i18next.t("billing.withdrawal.approve_success"));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => billingApi.rejectWithdrawal(id),
    onSuccess: (transaction) => {
      invalidateAfterDecision(transaction);
      toast.success(i18next.t("billing.withdrawal.reject_success"));
    },
  });

  return {
    approve: approveMutation.mutate,
    reject: rejectMutation.mutate,
    isPending: approveMutation.isPending || rejectMutation.isPending,
  };
};
