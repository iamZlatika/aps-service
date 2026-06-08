import { BookCheck, BookDashed } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

interface WorkPublishButtonProps {
  isPublished: boolean;
  onClick: () => void;
}

export const WorkPublishButton = ({
  isPublished,
  onClick,
}: WorkPublishButtonProps) => {
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
      {isPublished ? (
        <BookCheck className="!h-5 !w-8" strokeWidth={2.5} />
      ) : (
        <BookDashed className="!h-5 !w-8" strokeWidth={2.5} />
      )}
    </Button>
  );
};
