import { SendHorizonal, X } from "lucide-react";

import { useCommentPhoneForm } from "@/features/orders/pages/order-page/components/history-sidebar/hooks/useCommentPhoneForm.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { PhoneMaskInput } from "@/widgets/table/components/inputs/PhoneMaskInput.tsx";

interface CommentPhoneFormProps {
  orderId: number;
  onClose: () => void;
}

export const CommentPhoneForm = ({
  orderId,
  onClose,
}: CommentPhoneFormProps) => {
  const { phone, setPhone, canSend, isPending, handleSend } =
    useCommentPhoneForm(orderId, onClose);

  return (
    <div className="flex items-end gap-2">
      <Button
        variant="secondary"
        className="h-10 w-10 shrink-0"
        disabled={isPending}
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>

      <PhoneMaskInput
        className="h-10 flex-1"
        value={phone}
        onChange={setPhone}
        disabled={isPending}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0"
        disabled={!canSend}
        onClick={handleSend}
      >
        <SendHorizonal className="h-5 w-5" />
      </Button>
    </div>
  );
};
