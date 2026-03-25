import { Trash2 } from "lucide-react";
import { type MouseEvent } from "react";

import { Button } from "@/shared/components/ui/button.tsx";

interface DeleteButtonProps {
  onClick: (e: MouseEvent) => void;
  disabled?: boolean;
}

export const DeleteButton = ({ onClick, disabled }: DeleteButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-destructive hover:bg-destructive/10"
      onClick={onClick}
      disabled={disabled}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};
export default DeleteButton;
