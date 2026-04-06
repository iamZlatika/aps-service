import { Lock, Unlock } from "lucide-react";

import { Button } from "@/shared/components/ui/button.tsx";

interface UserStatusButtonProps {
  status: string;
  onClick: () => void;
}

export const UserStatusButton = ({
  status,
  onClick,
}: UserStatusButtonProps) => {
  const isActive = status === "active";

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
      {isActive ? (
        <>
          <Unlock className="mr-1 h-4 w-4" />
        </>
      ) : (
        <>
          <Lock className="mr-1 h-4 w-4" />
        </>
      )}
    </Button>
  );
};
