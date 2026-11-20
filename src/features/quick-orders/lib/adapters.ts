import { mapTransactionDtoToTransaction } from "@/features/billing/lib/adapters.ts";
import { mapLocationDtoToLocation } from "@/features/dictionaries/lib/adapters.ts";
import {
  mapOrderProductDtoToOrderProduct,
  mapOrderServiceDtoToOrderService,
} from "@/features/orders/lib/adapters.ts";
import type {
  PaginatedQuickOrdersDto,
  QuickOrderDetailDto,
  QuickOrderDto,
} from "@/features/quick-orders/api/dto.ts";
import type { NewQuickOrderItemSchema } from "@/features/quick-orders/lib/schema.ts";
import type {
  NewQuickOrder,
  QuickOrder,
  QuickOrderDetail,
} from "@/features/quick-orders/types.ts";
import { mapUserDtoToUser } from "@/features/users/lib/adapters.ts";
import { mapDonorSalePartsToDto } from "@/features/warehouse/lib/adapters.ts";
import type { PaginatedResponse } from "@/widgets/table/models/types.ts";

// from dto
export function mapQuickOrderDtoToQuickOrder(dto: QuickOrderDto): QuickOrder {
  return {
    id: dto.id,
    number: dto.number,
    manager: mapUserDtoToUser(dto.manager),
    location: dto.location ? mapLocationDtoToLocation(dto.location) : null,
    paymentMethod: dto.payment_method,
    totalPrice: dto.total_price,
    totalCost: dto.total_cost,
    totalIncome: dto.total_income,
    createdAt: dto.created_at,
  };
}

export function mapPaginatedQuickOrdersDtoToResponse(
  dto: PaginatedQuickOrdersDto,
): PaginatedResponse<QuickOrder> {
  return {
    items: dto.data.map(mapQuickOrderDtoToQuickOrder),
    meta: {
      currentPage: dto.meta.current_page,
      lastPage: dto.meta.last_page,
      total: dto.meta.total,
    },
  };
}

export function mapQuickOrderDetailDtoToQuickOrderDetail(
  dto: QuickOrderDetailDto,
): QuickOrderDetail {
  return {
    ...mapQuickOrderDtoToQuickOrder(dto),
    createdBy: dto.created_by ? mapUserDtoToUser(dto.created_by) : null,
    comment: dto.comment,
    services: dto.services.map(mapOrderServiceDtoToOrderService),
    products: dto.products.map(mapOrderProductDtoToOrderProduct),
    transactions: dto.transactions.map(mapTransactionDtoToTransaction),
    updatedAt: dto.updated_at,
    deletedAt: dto.deleted_at,
  };
}

// to dto
export function mapNewQuickOrderToDto(order: NewQuickOrder) {
  return {
    manager_id: order.managerId ?? undefined,
    location_id: order.locationId,
    payment_method: order.paymentMethod,
    comment: order.comment,
    services: order.services.map((service) => ({
      name: service.name,
      price: service.price,
      cost_price: service.costPrice || undefined,
      quantity: service.quantity,
    })),
    products: order.products.map(mapNewQuickOrderProductToDto),
  };
}

function mapNewQuickOrderProductToDto(product: NewQuickOrderItemSchema) {
  // Warehouse lines: name and purchase price come from the card, never sent.
  if (product.warehouseItemId !== null) {
    return {
      warehouse_item_id: product.warehouseItemId,
      price: product.price,
      quantity: product.quantity,
    };
  }
  if (product.donorPartId !== null) {
    return {
      donor_part_id: product.donorPartId,
      ...(product.costPrice && { cost_price: product.costPrice }),
      price: product.price,
      quantity: product.quantity,
    };
  }
  if (product.warehouseDonorId !== null) {
    return {
      warehouse_donor_id: product.warehouseDonorId,
      ...(product.donorParts.length > 0 && {
        donor_parts: mapDonorSalePartsToDto(product.donorParts),
      }),
      price: product.price,
      quantity: product.quantity,
    };
  }
  return {
    name: product.name,
    price: product.price,
    purchase_price: product.purchasePrice || undefined,
    quantity: product.quantity,
  };
}
