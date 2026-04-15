import { mapCustomerDtoToCustomer } from "@/features/backoffice/modules/customers/lib/adapters.ts";
import { mapLocationDtoToLocation } from "@/features/backoffice/modules/dictionaries/lib/adapter.ts";
import {
  type DocumentDto,
  type OrderDto,
  type OrderInfoDto,
  type PaginatedOrdersDto,
  type StatusDto,
  type StatusHistoryItemDto,
} from "@/features/backoffice/modules/orders/api/dto.ts";
import { type OrderDocument } from "@/features/backoffice/modules/orders/types.ts";
import { mapUserDtoToUser } from "@/features/backoffice/modules/users/lib/adapters.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";

import type {
  NewOrder,
  Order,
  OrderInfo,
  OrderStatus,
  StatusHistoryItem,
} from "../types.ts";

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
    assignee: dto.assignee ? mapUserDtoToUser(dto.assignee) : null,
    status: mapStatusDtoToOrderStatus(dto.status),
    issueType: dto.issue_type,
    deviceType: dto.device_type,
    manufacturer: dto.manufacturer,
    deviceModel: dto.device_model,
    deviceCondition: dto.device_condition,
    accessory: dto.accessory,
    devicePassword: dto.device_password,
    intakeNote: dto.intake_note,
    totalPrepayment: dto.total_prepayment,
    remainingToPay: dto.total_prepayment,
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

export const mapOrderInfoDtoToOrderInfo = (dto: OrderInfoDto): OrderInfo => {
  return {
    ...mapOrderDtoToOrder(dto),

    location: mapLocationDtoToLocation(dto.location),
    statusHistory: dto.status_history.map(
      mapStatusHistoryItemDtoToStatusHistoryItem,
    ),
    services: dto.services,
    products: dto.products,
    comments: dto.comments,
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
  assignee_id: order.assigneeId,
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
});
