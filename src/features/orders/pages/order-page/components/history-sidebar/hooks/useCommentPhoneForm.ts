import { useState } from "react";

import { usePostOrderComment } from "@/features/orders/pages/order-page/components/history-sidebar/hooks/usePostOrderComment.ts";
import { isPhoneNumber } from "@/shared/lib/phone.ts";

type UseCommentPhoneFormReturn = {
  phone: string;
  setPhone: (value: string) => void;
  canSend: boolean;
  isPending: boolean;
  handleSend: () => void;
};

export function useCommentPhoneForm(
  orderId: number,
  onSent: () => void,
): UseCommentPhoneFormReturn {
  const [phone, setPhone] = useState("");
  const { postComment, isPending } = usePostOrderComment(orderId, onSent);

  const canSend = !isPending && isPhoneNumber(phone);

  return {
    phone,
    setPhone,
    canSend,
    isPending,
    handleSend: () => {
      if (canSend) postComment({ comment: phone });
    },
  };
}
