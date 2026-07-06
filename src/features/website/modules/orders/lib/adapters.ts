import { mapLocationDtoToLocation } from "@/entities/location/adapters";
import { mapStatusDtoToOrderStatus } from "@/entities/order-status/adapters";
import { mapTrackPaymentDtoToTrackPayment } from "@/features/website/lib/adapters";
import {
  type OrderDetailDto,
  type OrderDocumentDto,
  type OrderLineItemDto,
  type OrderListItemDto,
  type PaginatedOrdersDto,
} from "@/features/website/modules/orders/api/dto";
import {
  type OrderDetail,
  type OrderDocument,
  type OrderLineItem,
  type OrderListItem,
  type OrdersListResult,
} from "@/features/website/modules/orders/types";

export function mapOrderListItemDtoToOrderListItem(
  dto: OrderListItemDto,
): OrderListItem {
  return {
    id: dto.id,
    orderNumber: dto.order_number,
    status: mapStatusDtoToOrderStatus(dto.status),
    deviceType: dto.device_type,
    manufacturer: dto.manufacturer,
    deviceModel: dto.device_model,
    isUrgent: dto.is_urgent,
    estimatedCost: dto.estimated_cost,
    totalPaid: dto.total_paid,
    remainingToPay: dto.remaining_to_pay,
    dueDate: dto.due_date,
    closedAt: dto.closed_at,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapOrderDocumentDtoToOrderDocument(
  dto: OrderDocumentDto,
): OrderDocument {
  return {
    id: dto.id,
    type: dto.type,
    name: dto.name,
    createdAt: dto.created_at,
    downloadUrl: dto.download_url,
  };
}

export function mapOrderLineItemDtoToOrderLineItem(
  dto: OrderLineItemDto,
): OrderLineItem {
  return {
    name: dto.name,
    quantity: dto.quantity,
    price: dto.price,
    sum: dto.sum,
  };
}

export function mapOrderDetailDtoToOrderDetail(
  dto: OrderDetailDto,
): OrderDetail {
  return {
    ...mapOrderListItemDtoToOrderListItem(dto),
    issueType: dto.issue_type,
    deviceCondition: dto.device_condition,
    accessory: dto.accessory,
    location: mapLocationDtoToLocation(dto.location),
    payments: dto.payments.map(mapTrackPaymentDtoToTrackPayment),
    services: dto.services.map(mapOrderLineItemDtoToOrderLineItem),
    products: dto.products.map(mapOrderLineItemDtoToOrderLineItem),
    documents: dto.documents
      .map(mapOrderDocumentDtoToOrderDocument)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}

export function mapPaginatedOrdersDtoToOrdersListResult(
  dto: PaginatedOrdersDto,
): OrdersListResult {
  return {
    items: dto.data.map(mapOrderListItemDtoToOrderListItem),
    meta: {
      currentPage: dto.meta.current_page,
      lastPage: dto.meta.last_page,
      total: dto.meta.total,
    },
  };
}
