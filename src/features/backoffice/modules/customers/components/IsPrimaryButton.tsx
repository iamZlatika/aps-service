import { Flag } from "lucide-react";

import { Button } from "@/shared/components/ui/button.tsx";
import { cn } from "@/shared/lib/utils.ts";

interface IsPrimaryButtonProps {
  isPrimary: boolean;
  onClick?: () => void;
}

export const IsPrimaryButton = ({
  isPrimary,
  onClick,
}: IsPrimaryButtonProps) => {
  return (
    <Button
      disabled={isPrimary}
      size="sm"
      variant="ghost"
      className={cn(
        "flex items-center justify-center",
        isPrimary
          ? "bg-blue-500 text-white cursor-default"
          : "bg-gray-200 text-gray-600 hover:bg-gray-400 hover:text-gray-800",
      )}
      onClick={onClick}
    >
      <Flag className="h-4 w-4 translate-x-[1px]" />
    </Button>
  );
};
