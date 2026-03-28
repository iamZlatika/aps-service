import { Pencil } from "lucide-react";

import { cn } from "@/shared/lib/utils.ts";

interface EditButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
  iconClassName?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const EditButton = ({
  onClick,
  label,
  className,
  iconClassName,
  type,
  disabled,
}: EditButtonProps) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-opacity hover:opacity-80",
        className,
      )}
      aria-label={label}
    >
      <Pencil className={cn("h-4 w-4", iconClassName)} />
    </button>
  );
};

export default EditButton;
