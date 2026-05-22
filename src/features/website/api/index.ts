import {
  OrderPreviewDtoSchema,
  TrackDtoSchema,
} from "@/features/website/api/dto";
import { WEBSITE_API } from "@/features/website/api/endpoints";
import {
  mapOrderPreviewDtoToOrderPreview,
  mapTrackDtoToTrack,
} from "@/features/website/lib/adapters";
import { type OrderPreview, type Track } from "@/features/website/types";
import { get } from "@/shared/api/api";

export const websiteApi = {
  getOrderTracking: async (token: string): Promise<Track> => {
    const response = await get(WEBSITE_API.track(token));
    const validated = TrackDtoSchema.parse(response);
    return mapTrackDtoToTrack(validated);
  },
  getOrderStatus: async (orderNumber: string): Promise<OrderPreview> => {
    const response = await get(WEBSITE_API.status(orderNumber));
    const validated = OrderPreviewDtoSchema.parse(response);
    return mapOrderPreviewDtoToOrderPreview(validated);
  },
};
