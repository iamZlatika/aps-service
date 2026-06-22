import {
  OrderDetailDtoSchema,
  PaginatedOrdersDtoSchema,
} from "@/features/website/modules/orders/api/dto";
import { CUSTOMER_ORDERS_API } from "@/features/website/modules/orders/api/endpoints";
import {
  mapOrderDetailDtoToOrderDetail,
  mapPaginatedOrdersDtoToOrdersListResult,
} from "@/features/website/modules/orders/lib/adapters";
import {
  type OrderDetail,
  type OrdersListResult,
} from "@/features/website/modules/orders/types";
import { buildPaginatedParams, get } from "@/shared/api/api";
import { apiClient } from "@/shared/api/apiClient";
import { parseDto } from "@/shared/api/parseDto";

export const customerOrdersApi = {
  getAll: async (page = 1, perPage = 10): Promise<OrdersListResult> => {
    const params = buildPaginatedParams(page, perPage);
    const response = await get(
      `${CUSTOMER_ORDERS_API.orders()}?${params.toString()}`,
    );
    const validated = parseDto(PaginatedOrdersDtoSchema, response);
    return mapPaginatedOrdersDtoToOrdersListResult(validated);
  },

  getOrder: async (id: number): Promise<OrderDetail> => {
    const response = await get<{ data: unknown }>(
      CUSTOMER_ORDERS_API.order(id),
    );
    const validated = parseDto(OrderDetailDtoSchema, response.data);
    return mapOrderDetailDtoToOrderDetail(validated);
  },

  downloadDocument: async (
    orderId: number,
    documentId: number,
    filename: string,
  ): Promise<void> => {
    const response = await apiClient.get(
      CUSTOMER_ORDERS_API.downloadDocument(orderId, documentId),
      { responseType: "blob" },
    );
    const objectUrl = URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
  },
};
