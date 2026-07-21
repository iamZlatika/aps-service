import { type ReactNode } from "react";

interface HistoryItemWrapperProps {
  date: string;
  children: ReactNode;
}

export const HistoryItemWrapper = ({
  date,
  children,
}: HistoryItemWrapperProps) => (
  <div className="px-4 py-3 border-b text-sm">
    {children}
    <div className="mt-1 text-muted-foreground text-xs">
      {new Date(date).toLocaleString()}
    </div>
  </div>
);
