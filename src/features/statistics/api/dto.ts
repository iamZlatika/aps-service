import { z } from "zod";

import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";

import { GRANULARITIES } from "../types.ts";

export const GranularityDtoSchema = zodEnumFromConst(GRANULARITIES);

export const RevenueStatisticsDtoSchema = z.object({
  payments: z.object({
    total: z.string(),
    cash: z.string(),
    card: z.string(),
    count: z.number(),
  }),
  accrued: z.object({
    turnover: z.string(),
    margin: z.string(),
    cost: z.string(),
    paid: z.string(),
    orders: z.number(),
  }),
  granularity: GranularityDtoSchema,
  series: z.array(
    z.object({
      bucket: z.string(),
      payments: z.string(),
    }),
  ),
});
export type RevenueStatisticsDto = z.infer<typeof RevenueStatisticsDtoSchema>;

// color is a loose string (not restricted to STATUS_COLORS): this is a status-color
// name coming from a snapshot endpoint, and an unrecognized value here should fall
// back to a default at render time rather than fail DTO validation.
export const OrderStatusSnapshotDtoSchema = z.object({
  key: z.string(),
  name: z.string(),
  color: z.string().nullable(),
  count: z.number(),
});

export const OrdersStatisticsDtoSchema = z.object({
  status_snapshot: z.array(OrderStatusSnapshotDtoSchema),
  new: z.number(),
  closed: z.number(),
  overdue: z.number(),
  avg_repair_days: z.number().nullable(),
});
export type OrdersStatisticsDto = z.infer<typeof OrdersStatisticsDtoSchema>;

export const TopStatisticsDtoSchema = z.object({
  manufacturers: z.array(z.object({ value: z.string(), count: z.number() })),
  device_types: z.array(z.object({ value: z.string(), count: z.number() })),
  customers: z.array(
    z.object({
      customer_id: z.number(),
      name: z.string(),
      orders: z.number(),
      turnover: z.string(),
      profit: z.string(),
    }),
  ),
  locations: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      orders: z.number(),
      payments: z.string(),
    }),
  ),
});
export type TopStatisticsDto = z.infer<typeof TopStatisticsDtoSchema>;

export const StaffRowDtoSchema = z.object({
  user_id: z.number(),
  name: z.string(),
  period: z.object({
    closed: z.number(),
    turnover: z.string(),
    margin: z.string(),
    earned: z.string(),
    paid_out: z.string(),
  }),
  snapshot: z.object({
    balance: z.string(),
    available: z.string(),
  }),
});

export const StaffStatisticsDtoSchema = z.object({
  rows: z.array(StaffRowDtoSchema),
});
export type StaffStatisticsDto = z.infer<typeof StaffStatisticsDtoSchema>;
