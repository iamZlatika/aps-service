import { mapLocationDtoToLocation } from "@/entities/location/adapters";
import { mapStatusDtoToOrderStatus } from "@/entities/order-status/adapters";
import { mapPriceListItemDtoToPriceListItem } from "@/entities/price-list/adapters";
import {
  type LandingDto,
  type OrderPreviewDto,
  type ReviewDto,
  type TrackDto,
  type TrackPaymentDto,
  type TrackProductDto,
  type TrackServiceDto,
} from "@/features/website/api/dto";
import {
  type LandingData,
  type OrderPreview,
  type Review,
  type Track,
  type TrackPayment,
  type TrackProduct,
  type TrackService,
} from "@/features/website/types";

export { mapLocationDtoToLocation };
export { mapStatusDtoToOrderStatus };
export { mapPriceListItemDtoToPriceListItem };

function mapTrackProductDtoToTrackProduct(dto: TrackProductDto): TrackProduct {
  return {
    name: dto.name,
    price: dto.price,
    sum: dto.sum,
    quantity: dto.quantity,
    createdAt: dto.created_at,
    completedAt: dto.completed_at,
    deletedAt: dto.deleted_at,
  };
}

function mapTrackServiceDtoToTrackService(dto: TrackServiceDto): TrackService {
  return {
    name: dto.name,
    price: dto.price,
    sum: dto.sum,
    quantity: dto.quantity,
    createdAt: dto.created_at,
    completedAt: dto.completed_at,
    deletedAt: dto.deleted_at,
  };
}

function mapTrackPaymentDtoToTrackPayment(dto: TrackPaymentDto): TrackPayment {
  return {
    type: dto.type,
    method: dto.method,
    amount: dto.amount,
    createdAt: dto.created_at,
  };
}

export function mapTrackDtoToTrack(dto: TrackDto): Track {
  return {
    orderNumber: dto.order_number,
    status: mapStatusDtoToOrderStatus(dto.status),
    deviceType: dto.device_type,
    manufacturer: dto.manufacturer,
    deviceModel: dto.device_model,
    deviceCondition: dto.device_condition,
    accessory: dto.accessory,
    issueType: dto.issue_type,
    intakeNote: dto.intake_note,
    estimatedCost: dto.estimated_cost,
    totalPaid: dto.total_paid,
    dueDate: dto.due_date,
    isCalled: dto.is_called,
    isUrgent: dto.is_urgent,
    createdAt: dto.created_at,
    statusHistory: [...dto.status_history]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((item) => ({
        status: mapStatusDtoToOrderStatus(item.status),
        createdAt: item.created_at,
      })),
    products: dto.products.map(mapTrackProductDtoToTrackProduct),
    services: dto.services.map(mapTrackServiceDtoToTrackService),
    payments: dto.payments.map(mapTrackPaymentDtoToTrackPayment),
  };
}

export function mapReviewDtoToReview(dto: ReviewDto): Review {
  return {
    id: dto.id,
    authorName: dto.author_name,
    authorPhotoUrl: dto.author_photo_url,
    rating: dto.rating,
    text: dto.text,
    publishedAt: dto.published_at,
  };
}

export function mapLandingDtoToLandingData(dto: LandingDto): LandingData {
  return {
    activeCount: dto.orders.count,
    prices: dto.prices.map((p) => ({
      categoryKey: p.category.key,
      categoryNameRu: p.category.name_ru,
      categoryNameUk: p.category.name_uk,
      minPrice: p.min_price,
    })),
  };
}

export function mapOrderPreviewDtoToOrderPreview(
  dto: OrderPreviewDto,
): OrderPreview {
  return {
    orderNumber: dto.order_number,
    status: mapStatusDtoToOrderStatus(dto.status),
    manufacturer: dto.manufacturer,
    deviceType: dto.device_type,
    deviceModel: dto.device_model,
    issueType: dto.issue_type,
  };
}
