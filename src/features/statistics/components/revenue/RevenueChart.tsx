import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatDate, formatMoney } from "@/shared/lib/utils.ts";

import type { RevenueStatistics } from "../../types.ts";

interface RevenueChartProps {
  series: RevenueStatistics["series"];
}

export const RevenueChart = ({ series }: RevenueChartProps) => {
  const data = series.map((point) => ({
    bucket: point.bucket,
    payments: Number.parseFloat(point.payments),
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="bucket"
            tickFormatter={(value: string) => formatDate(value) ?? value}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} width={70} />
          <Tooltip
            labelFormatter={(label) =>
              formatDate(String(label)) ?? String(label)
            }
            formatter={(value) => formatMoney(String(value))}
          />
          <Area
            type="monotone"
            dataKey="payments"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.15}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
