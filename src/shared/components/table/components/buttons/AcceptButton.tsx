import { Check } from "lucide-react";
import { type MouseEvent } from "react";

import { Button } from "@/shared/components/ui/button.tsx";

interface AcceptButtonProps {
  onClick: (e: MouseEvent) => void;
  disabled?: boolean;
}

export const AcceptButton = ({ onClick, disabled }: AcceptButtonProps) => {
  return (
    <Button
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
