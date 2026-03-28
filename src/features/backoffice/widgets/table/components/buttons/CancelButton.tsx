import { X } from "lucide-react";
import { type MouseEvent } from "react";

import { Button } from "@/shared/components/ui/button.tsx";

interface CancelButtonProps {
  onClick: (e: MouseEvent) => void;
  disabled?: boolean;
}

export const CancelButton = ({ onClick, disabled }: CancelButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-red-600 hover:bg-red-50 hover:text-red-700"
      onClick={onClick}
      disabled={disabled}
    >
      <X className="h-4 w-4" />
    </Button>
  );
};
export default CancelButton;
