import {
  PaginatedQuickOrdersDtoSchema,
  type QuickOrderDetailDto,
  QuickOrderDetailDtoSchema,
} from "@/features/quick-orders/api/dto.ts";
import { QUICK_ORDERS_API } from "@/features/quick-orders/api/endpoints.ts";
import {
  mapNewQuickOrderToDto,
  mapPaginatedQuickOrdersDtoToResponse,
  mapQuickOrderDetailDtoToQuickOrderDetail,
} from "@/features/quick-orders/lib/adapters.ts";
import type {
  NewQuickOrder,
  QuickOrder,
  QuickOrderDetail,
} from "@/features/quick-orders/types.ts";
import { buildPaginatedParams, del, get, post } from "@/shared/api/api.ts";
import { parseDto } from "@/shared/api/parseDto";
import type { SortType } from "@/widgets/table/hooks/useSortParams.ts";
import type { PaginatedResponse } from "@/widgets/table/models/types.ts";

export const quickOrdersApi = {
  getAll: async (
    page = 1,
    perPage = 20,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Record<string, string>,
  ): Promise<PaginatedResponse<QuickOrder>> => {
    const params = buildPaginatedParams(
      page,
      perPage,
      sortColumn,
      sortType,
      filters,
    );
    const response = await get(
      `${QUICK_ORDERS_API.quickOrders()}?${params.toString()}`,
    );
    const validatedData = parseDto(PaginatedQuickOrdersDtoSchema, response);
    return mapPaginatedQuickOrdersDtoToResponse(validatedData);
  },

  getQuickOrder: async (id: number): Promise<QuickOrderDetail> => {
    const response = await get<{ data: QuickOrderDetailDto }>(
      QUICK_ORDERS_API.quickOrder(id),
    );
    const validatedData = parseDto(QuickOrderDetailDtoSchema, response.data);
    return mapQuickOrderDetailDtoToQuickOrderDetail(validatedData);
  },

  addNewQuickOrder: async (data: NewQuickOrder): Promise<QuickOrderDetail> => {
    const payload = mapNewQuickOrderToDto(data);

    const response = await post<typeof payload, { data: QuickOrderDetailDto }>(
      QUICK_ORDERS_API.quickOrders(),
      payload,
    );

    const validatedData = parseDto(QuickOrderDetailDtoSchema, response.data);
    return mapQuickOrderDetailDtoToQuickOrderDetail(validatedData);
  },

  deleteQuickOrder: async (id: number): Promise<void> => {
    await del<void>(QUICK_ORDERS_API.quickOrder(id));
  },
};
