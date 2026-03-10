import { Pencil } from "lucide-react";
import { type MouseEvent } from "react";

import { Button } from "@/shared/components/ui/button.tsx";

interface EditButtonProps {
  onClick: (e: MouseEvent) => void;
  disabled?: boolean;
}

export const EditButton = ({ onClick, disabled }: EditButtonProps) => {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} disabled={disabled}>
      <Pencil className="h-4 w-4" />
    </Button>
  );
};
export default EditButton;
