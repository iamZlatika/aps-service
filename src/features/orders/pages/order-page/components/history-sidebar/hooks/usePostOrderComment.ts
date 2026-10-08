import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { ordersApi } from "@/features/orders/api";
import type { OrderInfo } from "@/features/orders/types";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type PostCommentPayload = {
  comment?: string;
  file?: File;
};

type UsePostOrderCommentReturn = {
  postComment: (payload: PostCommentPayload) => void;
  isPending: boolean;
};

export function usePostOrderComment(
  orderId: number,
  onPosted: () => void,
): UsePostOrderCommentReturn {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate: postComment, isPending } = useMutation({
    mutationFn: (payload: PostCommentPayload) =>
      ordersApi.postComment(orderId, payload),
    onSuccess: (newComment) => {
      onPosted();
      toast.success(t("orders.successAddComment"));
      queryClient.setQueryData<OrderInfo>(
        queryKeys.orders.detail(orderId),
        (old) =>
          old ? { ...old, comments: [...old.comments, newComment] } : old,
      );
    },
  });

  return { postComment, isPending };
}
