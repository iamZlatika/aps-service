import { mapCustomerDtoToCustomer } from "@/features/backoffice/modules/customers/lib/adapters.ts";
import {
  type OrderDto,
  type PaginatedOrdersDto,
  type StatusDto,
  type StatusHistoryItemDto,
} from "@/features/backoffice/modules/orders/api/dto.ts";
import { mapUserDtoToUser } from "@/features/backoffice/modules/users/lib/adapters.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";

import type {
  NewOrder,
  Order,
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
    prepayment: dto.prepayment,
    dueDate: dto.due_date,
    estimatedCost: dto.estimated_cost,
    isUrgent: dto.is_urgent,
    isCalled: dto.is_called,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    closedAt: dto.closed_at,
    // statusHistory: dto.status_history.map(
    //   mapStatusHistoryItemDtoToStatusHistoryItem,
    // ),
    // items: dto.items,
  };
}

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
  customer_phone: order.customerPhone,
  customer_email: order.customerEmail,
  customer_comment: order.customerComment,
  issue_type: order.issueType,
  device_type: order.deviceType,
  manufacturer: order.manufacturer,
  device_model: order.deviceModel,
  device_password: order.devicePassword,
  device_condition: order.deviceCondition,
  accessory: order.accessory,
  intake_note: order.intakeNote,
  is_urgent: order.isUrgent,
  estimated_cost: order.estimatedCost,
  manager_id: order.managerId,
  assignee_id: order.assigneeId,
  prepayment: order.prepayment,
});
