import { mapCustomerDtoToCustomer } from "@/features/backoffice/modules/customers/lib/adapters.ts";
import { mapLocationDtoToLocation } from "@/features/backoffice/modules/dictionaries/lib/adapter.ts";
import type {
  DocumentDto,
  OrderCommentDto,
  OrderDto,
  OrderInfoDto,
  OrderPaymentDto,
  OrderProductDto,
  OrderServiceDto,
  PaginatedOrdersDto,
  StatusDto,
  StatusHistoryItemDto,
} from "@/features/backoffice/modules/orders/api/dto.ts";
import {
  type NewOrder,
  type NewOrderPayment,
  type newOrderProduct,
  type newOrderService,
  type Order,
  type OrderComment,
  type OrderDocument,
  type OrderInfo,
  type OrderPayment,
  type OrderProduct,
  type OrderService,
  type OrderStatus,
  type StatusHistoryItem,
} from "@/features/backoffice/modules/orders/types.ts";
import { mapUserDtoToUser } from "@/features/backoffice/modules/users/lib/adapters.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";

export function mapStatusDtoToOrderStatus(dto: StatusDto): OrderStatus {
  return {
    id: dto.id,
    key: dto.key,
    nameRu: dto.name_ru,
    nameUa: dto.name_ua,
    color: dto.color,
    isSystem: dto.is_system,
  };
}

export function mapStatusHistoryItemDtoToStatusHistoryItem(
  dto: StatusHistoryItemDto,
): StatusHistoryItem {
  return {
    id: dto.id,
    status: mapStatusDtoToOrderStatus(dto.status),
    changedByUser: mapUserDtoToUser(dto.changed_by_user),
    createdAt: dto.created_at,
  };
}

export function mapDocumentDtoToOrderDocumentStatus(
  dto: DocumentDto,
): OrderDocument {
  return {
    id: dto.id,
    type: dto.type,
    name: dto.name,
    url: dto.url,
    createdAt: dto.created_at,
  };
}
export function mapOrderDtoToOrder(dto: OrderDto): Order {
  return {
    id: dto.id,
    orderNumber: dto.order_number,
    customer: mapCustomerDtoToCustomer(dto.customer),
    manager: mapUserDtoToUser(dto.manager),
    status: mapStatusDtoToOrderStatus(dto.status),
    issueType: dto.issue_type,
    deviceType: dto.device_type,
    manufacturer: dto.manufacturer,
    deviceModel: dto.device_model,
    deviceCondition: dto.device_condition,
    accessory: dto.accessory,
    devicePassword: dto.device_password,
    intakeNote: dto.intake_note,
    totalPaid: dto.total_paid,
    remainingToPay: dto.remaining_to_pay,
    dueDate: dto.due_date,
    estimatedCost: dto.estimated_cost,
    isUrgent: dto.is_urgent,
    isCalled: dto.is_called,
    location: dto.location,
    totalCost: dto.total_cost,
    totalIncome: dto.total_income,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    closedAt: dto.closed_at,
    documents: dto.documents.map(mapDocumentDtoToOrderDocumentStatus),
  };
}
export const mapOrderCommentDtoToOrderComment = (
  dto: OrderCommentDto,
): OrderComment => ({
  id: dto.id,
  user: mapUserDtoToUser(dto.user),
  body: dto.body,
  imageUrl: dto.image_url,
  createdAt: dto.created_at,
});

export const mapOrderServiceDtoToOrderService = (
  dto: OrderServiceDto,
): OrderService => ({
  id: dto.id,
  manager: mapUserDtoToUser(dto.manager),
  repairOperationId: dto.repair_operation_id ?? null,
  name: dto.name,
  price: dto.price,
  costPrice: dto.cost_price,
  quantity: dto.quantity,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at ?? null,
  deletedByUser: dto.deleted_by_user
    ? mapUserDtoToUser(dto.deleted_by_user)
    : null,
});

export const mapOrderProductDtoToOrderProduct = (
  dto: OrderProductDto,
): OrderProduct => ({
  id: dto.id,
  manager: mapUserDtoToUser(dto.manager),
  supplierName: dto.supplier_name ?? null,
  name: dto.name,
  price: dto.price,
  purchasePrice: dto.purchase_price ?? null,
  quantity: dto.quantity,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at ?? null,
  deletedByUser: dto.deleted_by_user
    ? mapUserDtoToUser(dto.deleted_by_user)
    : null,
});
export const mapPaymentDtoToPayment = (dto: OrderPaymentDto): OrderPayment => ({
  id: dto.id,
  type: dto.type,
  amount: dto.amount,
  note: dto.note,
  manager: dto.manager ? mapUserDtoToUser(dto.manager) : null,
  createdAt: dto.created_at,
});

export const mapOrderInfoDtoToOrderInfo = (dto: OrderInfoDto): OrderInfo => {
  return {
    ...mapOrderDtoToOrder(dto),

    location: mapLocationDtoToLocation(dto.location),
    statusHistory: dto.status_history.map(
      mapStatusHistoryItemDtoToStatusHistoryItem,
    ),
    services: dto.services.map(mapOrderServiceDtoToOrderService),
    products: dto.products.map(mapOrderProductDtoToOrderProduct),
    comments: dto.comments.map(mapOrderCommentDtoToOrderComment),
    payments: dto.payments.map(mapPaymentDtoToPayment),
  };
};

export const mapPaginatedOrdersDtoToResponse = (
  dto: PaginatedOrdersDto,
): PaginatedResponse<Order> => ({
  items: dto.data.map(mapOrderDtoToOrder),
  meta: {
    currentPage: dto.meta.current_page,
    lastPage: dto.meta.last_page,
    total: dto.meta.total,
  },
});

// to dto

export const mapNewOrderToDto = (order: NewOrder) => ({
  customer_name: order.customerName,
  customer_primary_phone: order.customerPrimaryPhone,
  customer_secondary_phone: order.customerSecondaryPhone,
  customer_email: order.customerEmail,
  customer_comment: order.customerComment,
  manager_id: order.managerId,
  location_id: order.locationId,
  prepayment: order.prepayment,
  is_urgent: order.isUrgent,
  issue_type: order.issueType,
  device_type: order.deviceType,
  manufacturer: order.manufacturer,
  device_model: order.deviceModel,
  device_condition: order.deviceCondition?.join(", "),
  accessory: order.accessory?.join(", "),
  intake_note: order.intakeNote,
  device_password: order.devicePassword,
  estimated_cost: order.estimatedCost,
  due_date: order.dueDate ? `${order.dueDate} 15:00:00` : undefined,
});

export const mapNewProductToDto = (product: newOrderProduct) => ({
  name: product.name,
  price: product.price,
  purchase_price: product.purchasePrice || null,
  quantity: product.quantity,
  supplier_name: product.supplierName,
  manager_id: product.managerId ?? null,
});

export const mapNewServiceToDto = (service: newOrderService) => ({
  name: service.name,
  price: service.price,
  cost_price: service.costPrice || null,
  quantity: service.quantity,
  manager_id: service.managerId ?? null,
});
export const mapNewPaymentToDto = (payment: NewOrderPayment) => ({
  type: payment.type,
  amount: payment.amount,
  manager_id: payment.managerId,
  note: payment.note,
});
