import { Check } from "lucide-react";
import { type MouseEvent } from "react";

import { Button } from "@/shared/components/ui/button.tsx";

interface AcceptButtonProps {
  onClick?: (e: MouseEvent) => void;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  form?: string;
}

export const AcceptButton = ({
  onClick,
  disabled,
  type,
  form,
}: AcceptButtonProps) => {
  return (
    <Button
      type={type}
      form={form}
      variant="ghost"
      size="icon"
      className="text-green-600 hover:bg-green-50 hover:text-green-700"
      onClick={onClick}
      disabled={disabled}
    >
      <Check className="h-4 w-4" />
    </Button>
  );
};
export default AcceptButton;
