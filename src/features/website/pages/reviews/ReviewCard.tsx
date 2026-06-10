import { getAvatarColor } from "@/features/website/lib/service";
import { GoogleSpinnerIcon } from "@/features/website/pages/reviews/GoogleSpinnerIcon";
import { type Review } from "@/features/website/types";
import { formatDate } from "@/shared/lib/utils";

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const color = getAvatarColor(review.authorName);
  const initial = review.authorName.charAt(0).toUpperCase();
  const date = formatDate(review.publishedAt);

  return (
    <article className="mb-[18px] break-inside-avoid rounded-[16px] border border-ws-line bg-[rgba(255,255,255,0.022)] p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-ws-ink-mute">
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-[42px] w-[42px] flex-shrink-0 select-none items-center justify-center rounded-full text-base font-semibold text-white"
          style={{ background: color }}
          aria-hidden="true"
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-[3px] truncate text-[14.5px] font-semibold leading-tight text-ws-ink">
            {review.authorName}
          </div>
          <div className="text-[10.5px] uppercase tracking-[0.05em] text-ws-ink-mute">
            {date ?? "—"}
          </div>
        </div>
        <GoogleSpinnerIcon
          className="h-[18px] w-[18px] flex-shrink-0 opacity-85"
          strokeWidth={6}
        />
      </div>
      <div
        className="mb-2.5 flex gap-[2px] text-sm"
        aria-label={`${review.rating} / 5`}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={
              i < review.rating
                ? "text-yellow-400"
                : "text-ws-ink-mute opacity-35"
            }
          >
            ★
          </span>
        ))}
      </div>
      <p className="text-sm leading-[1.6] text-ws-ink-soft">{review.text}</p>
    </article>
  );
};
