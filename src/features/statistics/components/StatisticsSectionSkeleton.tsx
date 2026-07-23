import { Skeleton } from "@/shared/components/ui/skeleton.tsx";

export const StatisticsSectionSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);
