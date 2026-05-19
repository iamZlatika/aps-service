import {
  mapCustomerDtoToCustomer,
  mapCustomerInfoDtoToCustomerInfo,
} from "@/features/backoffice/modules/customers/lib/adapters.ts";
import { mapLocationDtoToLocation } from "@/features/backoffice/modules/dictionaries/lib/adapter.ts";
import type {
  CallHistoryDto,
  DocumentDto,
  OrderCommentDto,
  OrderDto,
  OrderInfoDto,
  OrderPaymentDto,
  OrderProductDto,
  OrderServiceDto,
  OrderTransactionDto,
  PaginatedOrdersDto,
  StatusDto,
  StatusHistoryItemDto,
} from "@/features/backoffice/modules/orders/api/dto.ts";
import type { EditOrderInfoFormValues } from "@/features/backoffice/modules/orders/lib/schema.ts";
import {
  type CallHistoryItem,
  type NewOrder,
  type NewOrderPayment,
  type NewOrderProduct,
  type NewOrderService,
  type Order,
  type OrderComment,
  type OrderDocument,
  type OrderInfo,
  type OrderPayment,
  type OrderProduct,
  type OrderService,
  type OrderStatus,
  type OrderTransaction,
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

export function mapDocumentDtoToOrderDocument(dto: DocumentDto): OrderDocument {
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
    location: mapLocationDtoToLocation(dto.location),
    totalCost: dto.total_cost,
    totalIncome: dto.total_income,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    closedAt: dto.closed_at,
    documents: dto.documents.map(mapDocumentDtoToOrderDocument),
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
  completedAt: dto.completed_at,
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
  completedAt: dto.completed_at,
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
  method: dto.method,
  amount: dto.amount,
  note: dto.note,
  manager: mapUserDtoToUser(dto.manager),
  createdAt: dto.created_at,
  deletedAt: dto.deleted_at,
  deletedByUser: dto.deleted_by_user
    ? mapUserDtoToUser(dto.deleted_by_user)
    : null,
});

export function mapCallHistoryDtoToCallHistoryItem(
  dto: CallHistoryDto,
): CallHistoryItem {
  return {
    id: dto.id,
    isCalled: dto.is_called,
    user: dto.changed_by_user ? mapUserDtoToUser(dto.changed_by_user) : null,
    createdAt: dto.created_at,
  };
}

export function mapOrderTransactionDtoToOrderTransaction(
  dto: OrderTransactionDto,
): OrderTransaction {
  return {
    id: dto.id,
    amount: dto.amount,
    type: dto.type,
    label: dto.label,
    status: dto.status,
    user: dto.user ? mapUserDtoToUser(dto.user) : null,
    orderId: dto.order_id,
    orderNumber: dto.order_number,
    orderServiceId: dto.order_service_id,
    orderProductId: dto.order_product_id,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export const mapOrderInfoDtoToOrderInfo = (dto: OrderInfoDto): OrderInfo => {
  return {
    ...mapOrderDtoToOrder(dto),
    customer: mapCustomerInfoDtoToCustomerInfo(dto.customer),
    location: mapLocationDtoToLocation(dto.location),
    statusHistory: dto.status_history.map(
      mapStatusHistoryItemDtoToStatusHistoryItem,
    ),
    services: dto.services.map(mapOrderServiceDtoToOrderService),
    products: dto.products.map(mapOrderProductDtoToOrderProduct),
    comments: dto.comments.map(mapOrderCommentDtoToOrderComment),
    payments: dto.payments.map(mapPaymentDtoToPayment),
    callHistory: dto.call_history.map(mapCallHistoryDtoToCallHistoryItem),
    transactions: dto.transactions.map(
      mapOrderTransactionDtoToOrderTransaction,
    ),
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

export const mapOrderInfoToEditFormValues = (
  order: OrderInfo,
): EditOrderInfoFormValues => ({
  dueDate: order.dueDate?.split(/[T ]/)[0] ?? "",
  issueType: order.issueType ?? "",
  deviceType: order.deviceType ?? "",
  manufacturer: order.manufacturer ?? "",
  deviceModel: order.deviceModel ?? "",
  devicePassword: order.devicePassword ?? "",
  deviceCondition: order.deviceCondition?.split(", ").filter(Boolean) ?? [],
  accessory: order.accessory?.split(", ").filter(Boolean) ?? [],
  intakeNote: order.intakeNote ?? "",
  estimatedCost: order.estimatedCost ?? "",
});

// to dto

export const mapEditOrderInfoToDto = (data: EditOrderInfoFormValues) => ({
  due_date: data.dueDate ? `${data.dueDate} 15:00:00` : undefined,
  issue_type: data.issueType,
  device_type: data.deviceType,
  manufacturer: data.manufacturer,
  device_model: data.deviceModel,
  device_password: data.devicePassword,
  device_condition: data.deviceCondition?.length
    ? data.deviceCondition.join(", ")
    : null,
  accessory: data.accessory?.length ? data.accessory.join(", ") : null,
  intake_note: data.intakeNote || null,
  estimated_cost: data.estimatedCost || null,
});

export const mapNewOrderToDto = (order: NewOrder) => ({
  customer_name: order.customerName,
  customer_primary_phone: order.customerPrimaryPhone,
  customer_secondary_phone: order.customerSecondaryPhone,
  customer_email: order.customerEmail,
  customer_comment: order.customerComment,
  manager_id: order.managerId,
  location_id: order.locationId,
  prepayment: order.prepayment,
  prepayment_method: order.prepaymentMethod,
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

export const mapNewProductToDto = (product: NewOrderProduct) => ({
  name: product.name,
  price: product.price,
  purchase_price: product.purchasePrice || null,
  quantity: product.quantity,
  supplier_name: product.supplierName,
  manager_id: product.managerId ?? null,
});

export const mapNewServiceToDto = (service: NewOrderService) => ({
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
  method: payment.method,
});
