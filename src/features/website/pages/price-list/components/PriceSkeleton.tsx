import { cn } from "@/shared/lib/utils";

const NAV_PILL_WIDTHS = [
  "w-20",
  "w-24",
  "w-28",
  "w-20",
  "w-32",
  "w-24",
  "w-20",
] as const;

export const PriceSkeleton = () => (
  <div className="lg:grid lg:grid-cols-[248px_1fr] lg:items-start lg:gap-12">
    <div>
      {/* mobile: pill bar */}
      <div className="sticky top-[var(--ws-header-height,0px)] z-30 mb-6 flex flex-wrap gap-2 border-b border-ws-line-soft bg-[color-mix(in_oklab,var(--ws-bg)_92%,transparent)] py-3 backdrop-blur-[10px] lg:hidden">
        {NAV_PILL_WIDTHS.map((w, i) => (
          <div
            key={i}
            className={cn("h-9 animate-pulse rounded-full bg-ws-bg-3", w)}
          />
        ))}
      </div>
      {/* desktop: sidebar */}
      <div className="hidden lg:sticky lg:top-[calc(var(--ws-header-height,0px)+24px)] lg:block">
        <div className="mb-3.5 h-3 w-20 animate-pulse rounded bg-ws-bg-3" />
        <div className="flex flex-col gap-0.5">
          {NAV_PILL_WIDTHS.map((w, i) => (
            <div
              key={i}
              className={cn("h-9 animate-pulse rounded-[10px] bg-ws-bg-3", w)}
            />
          ))}
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[18px] border border-ws-line bg-[rgba(255,255,255,0.015)]"
        >
          <div className="flex items-center gap-3.5 border-b border-ws-line-soft px-[26px] py-[22px]">
            <div className="size-11 animate-pulse rounded-[12px] bg-ws-bg-3" />
            <div className="h-5 w-48 animate-pulse rounded bg-ws-bg-3" />
          </div>
          <div className="px-[26px] pb-4 pt-1.5">
            {Array.from({ length: 5 }).map((_, j) => (
              <div
                key={j}
                className="flex items-center justify-between border-b border-ws-line-soft py-3.5 last:border-0"
              >
                <div className="h-4 w-2/3 animate-pulse rounded bg-ws-bg-3" />
                <div className="h-4 w-16 animate-pulse rounded bg-ws-bg-3" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
