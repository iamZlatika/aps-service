import {
  type OrderDto,
  OrderDtoSchema,
  OrderInfoDto,
  OrderInfoDtoSchema,
  PaginatedOrdersDtoSchema,
} from "@/features/backoffice/modules/orders/api/dto.ts";
import { ORDERS_API } from "@/features/backoffice/modules/orders/api/endpoints.ts";
import {
  mapNewOrderToDto,
  mapOrderDtoToOrder,
  mapOrderInfoDtoToOrderInfo,
  mapPaginatedOrdersDtoToResponse,
} from "@/features/backoffice/modules/orders/lib/adapters.ts";
import {
  type NewOrder,
  type Order,
  OrderInfo,
} from "@/features/backoffice/modules/orders/types.ts";
import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";
import { get, post, put } from "@/shared/api/api.ts";

export const ordersApi = {
  getAll: async (
    page = 1,
    perPage = 20,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Record<string, string>,
  ): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });
    if (sortColumn && sortType && sortType !== "none") {
      params.set("sort_column", sortColumn);
      params.set("sort_type", sortType);
    }
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
    }
    const response = await get(`${ORDERS_API.orders()}?${params.toString()}`);
    const validatedData = PaginatedOrdersDtoSchema.parse(response);
    return mapPaginatedOrdersDtoToResponse(validatedData);
  },
  addNewOrder: async (data: NewOrder): Promise<Order> => {
    const payload = mapNewOrderToDto(data);

    const response = await post<typeof payload, { data: OrderDto }>(
      `${ORDERS_API.orders()}`,
      payload,
    );

    const validated = OrderDtoSchema.parse(response.data);
    return mapOrderDtoToOrder(validated);
  },
  changeStatus: async (orderId: number, statusId: number): Promise<void> => {
    await put(ORDERS_API.changeStatus(orderId), { status_id: statusId });
  },
  getOrder: async (id: number): Promise<OrderInfo> => {
    const response = await get<{ data: OrderInfoDto }>(
      `${ORDERS_API.order(id)}`,
    );
    const validatedData = OrderInfoDtoSchema.parse(response.data);
    return mapOrderInfoDtoToOrderInfo(validatedData);
  },
};
