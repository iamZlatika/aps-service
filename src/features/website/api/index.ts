import { type Location } from "@/entities/location/types";
import { type PriceListItem } from "@/entities/price-list/types";
import {
  type ActiveCountDto,
  ActiveCountDtoSchema,
  type LocationsResponseDto,
  LocationsResponseDtoSchema,
  type OrderPreviewDto,
  OrderPreviewDtoSchema,
  PriceListResponseDtoSchema,
  type TrackDto,
  TrackDtoSchema,
} from "@/features/website/api/dto";
import { WEBSITE_API } from "@/features/website/api/endpoints";
import {
  mapActiveCountDtoToActiveCount,
  mapLocationDtoToLocation,
  mapOrderPreviewDtoToOrderPreview,
  mapPriceListItemDtoToPriceListItem,
  mapTrackDtoToTrack,
} from "@/features/website/lib/adapters";
import { type OrderPreview, type Track } from "@/features/website/types";
import { get } from "@/shared/api/api";
import { parseDto } from "@/shared/api/parseDto";

export const websiteApi = {
  getOrderTracking: async (token: string): Promise<Track> => {
    const response = await get<{ data: TrackDto }>(WEBSITE_API.track(token));
    const validated = parseDto(TrackDtoSchema, response.data);
    return mapTrackDtoToTrack(validated);
  },
  getOrderStatus: async (orderNumber: string): Promise<OrderPreview> => {
    const response = await get<{ data: OrderPreviewDto }>(
      WEBSITE_API.status(orderNumber),
    );
    const validated = parseDto(OrderPreviewDtoSchema, response.data);
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
  getPriceList: async (categories: string[]): Promise<PriceListItem[]> => {
    const params = new URLSearchParams();
    categories.forEach((cat) => params.append("categories[]", cat));
    params.set("per_page", "100");
    const response = await get<unknown>(
      `${WEBSITE_API.priceList()}?${params.toString()}`,
    );
    const validated = parseDto(PriceListResponseDtoSchema, response);
    return validated.data.map(mapPriceListItemDtoToPriceListItem);
  },
};
