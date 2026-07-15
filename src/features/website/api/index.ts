import { type Location } from "@/entities/location/types";
import { type PriceListItem } from "@/entities/price-list/types";
import { mapWorkDtoToWork } from "@/entities/work/adapters";
import { WorksResponseDtoSchema } from "@/entities/work/dto";
import { type Work } from "@/entities/work/types";
import {
  type LandingDto,
  LandingDtoSchema,
  type LocationsResponseDto,
  LocationsResponseDtoSchema,
  type OrderPreviewDto,
  OrderPreviewDtoSchema,
  PriceListResponseDtoSchema,
  ReviewsResponseDtoSchema,
  type TrackDto,
  TrackDtoSchema,
} from "@/features/website/api/dto";
import { WEBSITE_API } from "@/features/website/api/endpoints";
import {
  mapLandingDtoToLandingData,
  mapLocationDtoToLocation,
  mapOrderPreviewDtoToOrderPreview,
  mapPriceListItemDtoToPriceListItem,
  mapReviewDtoToReview,
  mapTrackDtoToTrack,
} from "@/features/website/lib/adapters";
import {
  type LandingData,
  type OrderPreview,
  type Review,
  type Track,
} from "@/features/website/types";
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
      { silentErrorStatuses: [404] },
    );
    const validated = parseDto(OrderPreviewDtoSchema, response.data);
    return mapOrderPreviewDtoToOrderPreview(validated);
  },
  getLocationsInfo: async (): Promise<Location[]> => {
    const response = await get<LocationsResponseDto>(WEBSITE_API.locations());
    const validated = parseDto(LocationsResponseDtoSchema, response);
    return validated.data.map(mapLocationDtoToLocation);
  },
  getLanding: async (): Promise<LandingData> => {
    const response = await get<{ data: LandingDto }>(WEBSITE_API.landing());
    const validated = parseDto(LandingDtoSchema, response.data);
    return mapLandingDtoToLandingData(validated);
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
  getPriceListPage: async (
    page: number,
  ): Promise<{ items: PriceListItem[]; lastPage: number }> => {
    const params = new URLSearchParams();
    params.set("per_page", "100");
    params.set("page", String(page));
    const response = await get<unknown>(
      `${WEBSITE_API.priceList()}?${params.toString()}`,
    );
    const validated = parseDto(PriceListResponseDtoSchema, response);
    return {
      items: validated.data.map(mapPriceListItemDtoToPriceListItem),
      lastPage: validated.meta.last_page,
    };
  },
  getWorksPage: async (
    page: number,
  ): Promise<{ items: Work[]; lastPage: number }> => {
    const response = await get<unknown>(
      `${WEBSITE_API.landingWorks()}?page=${page}`,
    );
    const validated = parseDto(WorksResponseDtoSchema, response);
    return {
      items: validated.data.map(mapWorkDtoToWork),
      lastPage: validated.meta.last_page,
    };
  },
  getReviews: async (locationId: number): Promise<Review[]> => {
    const response = await get<unknown>(WEBSITE_API.reviews(locationId));
    const validated = parseDto(ReviewsResponseDtoSchema, response);
    return validated.data.map(mapReviewDtoToReview);
  },
};
