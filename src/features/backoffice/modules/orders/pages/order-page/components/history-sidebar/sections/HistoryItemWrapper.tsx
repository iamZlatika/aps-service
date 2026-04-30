import { type ReactNode, useMemo } from "react";

interface HistoryItemWrapperProps {
  date: string;
  children: ReactNode;
}

export const HistoryItemWrapper = ({
  date,
  children,
}: HistoryItemWrapperProps) => {
  const formattedDateTime = useMemo(
    () => new Date(date).toLocaleString(),
    [date],
  );

  return (
    <div className="px-4 py-3 border-b text-sm">
      {children}
      <div className="mt-1 text-muted-foreground text-xs">
        {formattedDateTime}
      </div>
    </div>
  );
};
