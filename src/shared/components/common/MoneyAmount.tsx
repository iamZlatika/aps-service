import { cn, formatMoney } from "@/shared/lib/utils.ts";

interface MoneyAmountProps {
  value: string;
  className?: string;
}

export const MoneyAmount = ({ value, className }: MoneyAmountProps) => {
  const isDebt = Number.parseFloat(value) < 0;

  return (
    <span className={cn(isDebt && "text-red-600 font-semibold", className)}>
      {formatMoney(value)}
    </span>
  );
};
