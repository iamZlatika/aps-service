import { Skeleton } from "@/shared/components/ui/skeleton.tsx";
import { TableCell, TableRow } from "@/shared/components/ui/table.tsx";

interface TableSkeletonProps {
  rowCount?: number;
}

export const TableSkeleton = ({ rowCount = 15 }: TableSkeletonProps) => (
  <>
    {[...Array(rowCount)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-5 w-[200px]" />
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </TableCell>
      </TableRow>
    ))}
  </>
);
export default TableSkeleton;
