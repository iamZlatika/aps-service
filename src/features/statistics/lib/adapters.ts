import type {
  OrdersStatisticsDto,
  RevenueStatisticsDto,
  StaffStatisticsDto,
  TopStatisticsDto,
} from "../api/dto.ts";
import type {
  OrdersStatistics,
  RevenueStatistics,
  StaffStatistics,
  StatisticsFilters,
  TopStatistics,
} from "../types.ts";

export function mapRevenueStatisticsDtoToRevenueStatistics(
  dto: RevenueStatisticsDto,
): RevenueStatistics {
  return {
    payments: dto.payments,
    accrued: dto.accrued,
    granularity: dto.granularity,
    series: dto.series,
  };
}

export function mapOrdersStatisticsDtoToOrdersStatistics(
  dto: OrdersStatisticsDto,
): OrdersStatistics {
  return {
    statusSnapshot: dto.status_snapshot,
    new: dto.new,
    closed: dto.closed,
    overdue: dto.overdue,
    avgRepairDays: dto.avg_repair_days,
  };
}

export function mapTopStatisticsDtoToTopStatistics(
  dto: TopStatisticsDto,
): TopStatistics {
  return {
    manufacturers: dto.manufacturers,
    deviceTypes: dto.device_types,
    customers: dto.customers.map((customer) => ({
      customerId: customer.customer_id,
      name: customer.name,
      orders: customer.orders,
      turnover: customer.turnover,
      profit: customer.profit,
    })),
    locations: dto.locations,
  };
}

export function mapStaffStatisticsDtoToStaffStatistics(
  dto: StaffStatisticsDto,
): StaffStatistics {
  return {
    rows: dto.rows.map((row) => ({
      userId: row.user_id,
      name: row.name,
      period: {
        closed: row.period.closed,
        turnover: row.period.turnover,
        margin: row.period.margin,
        earned: row.period.earned,
        paidOut: row.period.paid_out,
      },
      snapshot: {
        balance: row.snapshot.balance,
        available: row.snapshot.available,
      },
    })),
  };
}

// Builds the shared period[]/location_id query params every statistics endpoint
// takes, plus per-endpoint extras (granularity, limit). Kept here rather than in
// api/index.ts since it's pure/synchronous and reused by all 4 API methods.
export function buildStatisticsParams(
  filters: StatisticsFilters,
  extra?: Record<string, string>,
): URLSearchParams {
  const params = new URLSearchParams();
  params.append("period[]", filters.from);
  params.append("period[]", filters.to);
  if (filters.locationId !== null) {
    params.set("location_id", String(filters.locationId));
  }
  if (extra) {
    Object.entries(extra).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
  }
  return params;
}
