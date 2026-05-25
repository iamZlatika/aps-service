import {
  type ActiveCountDto,
  ActiveCountDtoSchema,
  type LocationsResponseDto,
  LocationsResponseDtoSchema,
  type OrderPreviewDto,
  OrderPreviewDtoSchema,
  type TrackDto,
  TrackDtoSchema,
} from "@/features/website/api/dto";
import { WEBSITE_API } from "@/features/website/api/endpoints";
import {
  mapActiveCountDtoToActiveCount,
  mapLocationDtoToLocation,
  mapOrderPreviewDtoToOrderPreview,
  mapTrackDtoToTrack,
} from "@/features/website/lib/adapters";
import { type OrderPreview, type Track } from "@/features/website/types";
import { get } from "@/shared/api/api";
import { parseDto } from "@/shared/api/parseDto";
import { type Location } from "@/shared/types";

export const websiteApi = {
  getOrderTracking: async (token: string): Promise<Track> => {
    const response = await get<TrackDto>(WEBSITE_API.track(token));
    const validated = parseDto(TrackDtoSchema, response);
    return mapTrackDtoToTrack(validated);
  },
  getOrderStatus: async (orderNumber: string): Promise<OrderPreview> => {
    const response = await get<OrderPreviewDto>(
      WEBSITE_API.status(orderNumber),
    );
    const validated = parseDto(OrderPreviewDtoSchema, response);
    return mapOrderPreviewDtoToOrderPreview(validated);
  },
  getLocationsInfo: async (): Promise<Location[]> => {
    const response = await get<LocationsResponseDto>(WEBSITE_API.locations());
    const validated = parseDto(LocationsResponseDtoSchema, response);
    return validated.data.map(mapLocationDtoToLocation);
  },
  getActiveCount: async (): Promise<number> => {
    const response = await get<{ data: ActiveCountDto }>(
      WEBSITE_API.activeCount(),
    );
    const validated = parseDto(ActiveCountDtoSchema, response.data);
    return mapActiveCountDtoToActiveCount(validated);
  },
};
