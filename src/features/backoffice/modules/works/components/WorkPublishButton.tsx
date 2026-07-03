import { BookCheck, BookDashed } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

interface WorkPublishButtonProps {
  isPublished: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const WorkPublishButton = ({
  isPublished,
  onClick,
  disabled,
}: WorkPublishButtonProps) => {
  const icon = isPublished ? (
    <BookCheck className="!h-5 !w-8" strokeWidth={2.5} />
  ) : (
    <BookDashed className="!h-5 !w-8" strokeWidth={2.5} />
  );

  if (disabled) {
    return (
      <span
        className={
          isPublished
            ? "inline-flex h-9 w-9 items-center justify-center text-green-600"
            : "inline-flex h-9 w-9 items-center justify-center text-red-600"
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
        isPublished
          ? "text-green-600 hover:bg-green-50 hover:text-green-700"
          : "text-red-600 hover:bg-red-50 hover:text-red-700"
      }
      onClick={onClick}
    >
      {icon}
    </Button>
  );
};
