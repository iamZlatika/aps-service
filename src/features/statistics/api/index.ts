import { get } from "@/shared/api/api.ts";
import { parseDto } from "@/shared/api/parseDto.ts";

import {
  buildStatisticsParams,
  mapOrdersStatisticsDtoToOrdersStatistics,
  mapRevenueStatisticsDtoToRevenueStatistics,
  mapStaffStatisticsDtoToStaffStatistics,
  mapTopStatisticsDtoToTopStatistics,
} from "../lib/adapters.ts";
import type {
  Granularity,
  OrdersStatistics,
  RevenueStatistics,
  StaffStatistics,
  StatisticsFilters,
  TopStatistics,
} from "../types.ts";
import {
  OrdersStatisticsDtoSchema,
  RevenueStatisticsDtoSchema,
  StaffStatisticsDtoSchema,
  TopStatisticsDtoSchema,
} from "./dto.ts";
import { STATISTICS_API } from "./endpoints.ts";

export const statisticsApi = {
  getRevenue: async (
    filters: StatisticsFilters,
    granularity?: Granularity,
  ): Promise<RevenueStatistics> => {
    const params = buildStatisticsParams(
      filters,
      granularity ? { granularity } : undefined,
    );
    const response = await get<{ data: unknown }>(
      `${STATISTICS_API.revenue()}?${params.toString()}`,
    );
    return mapRevenueStatisticsDtoToRevenueStatistics(
      parseDto(RevenueStatisticsDtoSchema, response.data),
    );
  },

  getOrders: async (filters: StatisticsFilters): Promise<OrdersStatistics> => {
    const params = buildStatisticsParams(filters);
    const response = await get<{ data: unknown }>(
      `${STATISTICS_API.orders()}?${params.toString()}`,
    );
    return mapOrdersStatisticsDtoToOrdersStatistics(
      parseDto(OrdersStatisticsDtoSchema, response.data),
    );
  },

  getTop: async (
    filters: StatisticsFilters,
    limit?: number,
  ): Promise<TopStatistics> => {
    const params = buildStatisticsParams(
      filters,
      limit ? { limit: String(limit) } : undefined,
    );
    const response = await get<{ data: unknown }>(
      `${STATISTICS_API.top()}?${params.toString()}`,
    );
    return mapTopStatisticsDtoToTopStatistics(
      parseDto(TopStatisticsDtoSchema, response.data),
    );
  },

  getStaff: async (filters: StatisticsFilters): Promise<StaffStatistics> => {
    const params = buildStatisticsParams(filters);
    const response = await get<{ data: unknown }>(
      `${STATISTICS_API.staff()}?${params.toString()}`,
    );
    return mapStaffStatisticsDtoToStaffStatistics(
      parseDto(StaffStatisticsDtoSchema, response.data),
    );
  },
};
