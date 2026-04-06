import { Star } from "lucide-react";

import { type RatingValue } from "@/features/backoffice/modules/customers/types.ts";
import { cn } from "@/shared/lib/utils.ts";

interface RatingProps {
  value: RatingValue;
  onChange?: (value: RatingValue) => void;
  className?: string;
}

export const Rating = ({ value, onChange, className }: RatingProps) => {
  const stars = [1, 2, 3, 4, 5] as const;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {stars.map((star) => {
        const filled = value !== null && star <= value;

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className="transition hover:scale-110"
          >
            <Star
              className={`h-5 w-5 ${
                filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
