import { cn, formatMoney } from "@/shared/lib/utils.ts";

interface MoneyAmountProps {
  value: string;
  className?: string;
  prefix?: string;
}

export const MoneyAmount = ({ value, className, prefix }: MoneyAmountProps) => {
  const isDebt = Number.parseFloat(value) < 0;

  return (
    <span className={cn(isDebt && "text-red-600 font-semibold", className)}>
      {prefix}
      {formatMoney(value)}
    </span>
  );
};
