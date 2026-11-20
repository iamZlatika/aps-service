import type { ReactNode } from "react";

interface InfoFieldProps {
  label: ReactNode;
  children: ReactNode;
}

export const InfoField = ({ label, children }: InfoFieldProps) => (
  <div className="min-w-0">
    <p className="text-sm text-muted-foreground">{label}</p>
    <div className="font-medium break-words">{children ?? "—"}</div>
  </div>
);
