import {
  type ActiveCountDto,
  type LocationDto,
  type OrderPreviewDto,
  type StatusDto,
  type TrackDto,
} from "@/features/website/api/dto";
import {
  type OrderPreview,
  type OrderStatus,
  type Track,
} from "@/features/website/types";
import { type Location, WEEK_DAYS } from "@/shared/types";

function mapStatusDtoToOrderStatus(dto: StatusDto): OrderStatus {
  return {
    id: dto.id,
    key: dto.key,
    nameRu: dto.name_ru,
    nameUa: dto.name_ua,
    color: dto.color,
    isSystem: dto.is_system,
  };
}

export function mapLocationDtoToLocation(dto: LocationDto): Location {
  return {
    id: dto.id,
    name: dto.name,
    cityRu: dto.city_ru,
    cityUa: dto.city_ua,
    districtRu: dto.district_ru,
    districtUa: dto.district_ua,
    streetRu: dto.street_ru,
    streetUa: dto.street_ua,
    building: dto.building,
    addressRu: dto.address_ru,
    addressUa: dto.address_ua,
    phone: dto.phone,
    schedule: Object.fromEntries(
      WEEK_DAYS.map((day) => {
        const slot = dto.schedule[day];
        return [day, slot ? { from: slot.from, to: slot.to } : null];
      }),
    ) as Location["schedule"],
    scheduleDisplay: dto.schedule_display,
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
    statusHistory: dto.status_history.map((item) => ({
      status: mapStatusDtoToOrderStatus(item.status),
      createdAt: item.created_at,
    })),
  };
}

export function mapActiveCountDtoToActiveCount(dto: ActiveCountDto): number {
  return dto.count;
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
    statusHistory: dto.status_history.map((item) => ({
      status: mapStatusDtoToOrderStatus(item.status),
      createdAt: item.created_at,
    })),
  };
}
