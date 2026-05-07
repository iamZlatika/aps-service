import {
  type OrderCommentDto,
  OrderCommentDtoSchema,
  type OrderDto,
  OrderDtoSchema,
  type OrderInfoDto,
  OrderInfoDtoSchema,
  OrderPaymentSchema,
  type OrderProductDto,
  OrderProductSchema,
  type OrderServiceDto,
  OrderServiceSchema,
  PaginatedOrdersDtoSchema,
} from "@/features/backoffice/modules/orders/api/dto.ts";
import { ORDERS_API } from "@/features/backoffice/modules/orders/api/endpoints.ts";
import {
  mapEditOrderInfoToDto,
  mapNewOrderToDto,
  mapNewPaymentToDto,
  mapNewProductToDto,
  mapNewServiceToDto,
  mapOrderCommentDtoToOrderComment,
  mapOrderDtoToOrder,
  mapOrderInfoDtoToOrderInfo,
  mapOrderProductDtoToOrderProduct,
  mapOrderServiceDtoToOrderService,
  mapPaginatedOrdersDtoToResponse,
  mapPaymentDtoToPayment,
} from "@/features/backoffice/modules/orders/lib/adapters.ts";
import type { EditOrderInfoFormValues } from "@/features/backoffice/modules/orders/lib/schema.ts";
import {
  type NewOrder,
  type NewOrderPayment,
  type NewOrderProduct,
  type NewOrderService,
  type Order,
  type OrderComment,
  type OrderInfo,
  type OrderPayment,
  type OrderProduct,
  type OrderService,
} from "@/features/backoffice/modules/orders/types.ts";
import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";
import { buildPaginatedParams, del, get, post, put } from "@/shared/api/api.ts";

export const ordersApi = {
  getAll: async (
    page = 1,
    perPage = 20,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Record<string, string>,
  ): Promise<PaginatedResponse<Order>> => {
    const params = buildPaginatedParams(
      page,
      perPage,
      sortColumn,
      sortType,
      filters,
    );
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
  changeIsCalled: async (orderId: number, isCalled: boolean): Promise<void> => {
    await put(ORDERS_API.changeIsCalled(orderId), { is_called: isCalled });
  },
  changeIsUrgent: async (orderId: number, isUrgent: boolean): Promise<void> => {
    await put(ORDERS_API.changeIsUrgent(orderId), { is_urgent: isUrgent });
  },
  getOrder: async (id: number): Promise<OrderInfo> => {
    const response = await get<{ data: OrderInfoDto }>(
      `${ORDERS_API.order(id)}`,
    );
    const validatedData = OrderInfoDtoSchema.parse(response.data);
    return mapOrderInfoDtoToOrderInfo(validatedData);
  },
  changeOrderInfo: async (
    orderId: number,
    data: EditOrderInfoFormValues,
  ): Promise<void> => {
    const payload = mapEditOrderInfoToDto(data);
    await put(ORDERS_API.order(orderId), payload);
  },
  postComment: async (
    id: number,
    { comment, file }: { comment?: string; file?: File },
  ): Promise<OrderComment> => {
    const formData = new FormData();
    if (file) formData.append("image", file);
    if (comment) formData.append("body", comment);

    const response = await post<FormData, { data: OrderCommentDto }>(
      ORDERS_API.addComment(id),
      formData,
      { headers: { "Content-Type": undefined } },
    );

    const validatedData = OrderCommentDtoSchema.parse(response.data);
    return mapOrderCommentDtoToOrderComment(validatedData);
  },
  addProductToOrder: async (
    orderId: number,
    data: NewOrderProduct,
  ): Promise<OrderProduct> => {
    const payload = mapNewProductToDto(data);

    const response = await post<typeof payload, { data: OrderProductDto }>(
      ORDERS_API.addProduct(orderId),
      payload,
    );
    const validated = OrderProductSchema.parse(response.data);
    return mapOrderProductDtoToOrderProduct(validated);
  },
  editProductInOrder: async (
    orderId: number,
    data: NewOrderProduct,
    productId: number,
  ): Promise<OrderProduct> => {
    const payload = mapNewProductToDto(data);
    const response = await put<typeof payload, { data: OrderProductDto }>(
      ORDERS_API.changeProduct(orderId, productId),
      payload,
    );
    const validated = OrderProductSchema.parse(response.data);
    return mapOrderProductDtoToOrderProduct(validated);
  },
  deleteProductInOrder: async (
    orderId: number,
    productId: number,
  ): Promise<void> => {
    await del<void>(ORDERS_API.changeProduct(orderId, productId));
  },
  addServiceToOrder: async (
    orderId: number,
    data: NewOrderService,
  ): Promise<OrderService> => {
    const payload = mapNewServiceToDto(data);
    const response = await post<typeof payload, { data: OrderServiceDto }>(
      ORDERS_API.addService(orderId),
      payload,
    );
    const validated = OrderServiceSchema.parse(response.data);
    return mapOrderServiceDtoToOrderService(validated);
  },
  editServiceInOrder: async (
    orderId: number,
    data: NewOrderService,
    serviceId: number,
  ): Promise<OrderService> => {
    const payload = mapNewServiceToDto(data);
    const response = await put<typeof payload, { data: OrderServiceDto }>(
      ORDERS_API.changeService(orderId, serviceId),
      payload,
    );
    const validated = OrderServiceSchema.parse(response.data);
    return mapOrderServiceDtoToOrderService(validated);
  },
  deleteServiceInOrder: async (
    orderId: number,
    serviceId: number,
  ): Promise<void> => {
    await del<void>(ORDERS_API.changeService(orderId, serviceId));
  },
  makePayment: async (
    orderId: number,
    prepayment: NewOrderPayment,
  ): Promise<OrderPayment> => {
    const payload = mapNewPaymentToDto(prepayment);
    const response = await post<typeof payload, { data: OrderPayment }>(
      ORDERS_API.makePayment(orderId),
      payload,
    );
    const validated = OrderPaymentSchema.parse(response.data);
    return mapPaymentDtoToPayment(validated);
  },
  deletePayment: async (orderId: number, paymentId: number): Promise<void> => {
    await del<void>(ORDERS_API.deletePayment(orderId, paymentId));
  },
};
