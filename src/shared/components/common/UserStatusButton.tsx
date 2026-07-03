import { Lock, Unlock } from "lucide-react";

import { Button } from "@/shared/components/ui/button.tsx";

interface UserStatusButtonProps {
  status: string;
  onClick: () => void;
  disabled?: boolean;
}

export const UserStatusButton = ({
  status,
  onClick,
  disabled,
}: UserStatusButtonProps) => {
  const isActive = status === "active";

  const icon = isActive ? (
    <Unlock className="mr-1 h-4 w-4" />
  ) : (
    <Lock className="mr-1 h-4 w-4" />
  );

  if (disabled) {
    return (
      <span
        className={
          isActive
            ? "inline-flex items-center text-green-600"
            : "inline-flex items-center text-red-600"
        }
      >
        {icon}
      </span>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className={
        isActive
          ? "text-green-600 hover:text-green-700 hover:bg-green-50"
          : "text-red-600 hover:text-red-700 hover:bg-red-50"
      }
      onClick={onClick}
    >
      {icon}
    </Button>
  );
};
