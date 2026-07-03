import {
  PaginatedSmsMessagesDtoSchema,
  SmsBalanceDtoSchema,
} from "@/features/backoffice/modules/sms-integration/api/dto.ts";
import { SMS_INTEGRATION_API } from "@/features/backoffice/modules/sms-integration/api/endpoints.ts";
import {
  mapPaginatedSmsMessagesDtoToResponse,
  mapSmsBalanceDtoToSmsBalance,
} from "@/features/backoffice/modules/sms-integration/lib/adapters.ts";
import type {
  SmsBalance,
  SmsMessage,
} from "@/features/backoffice/modules/sms-integration/types.ts";
import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";
import { buildPaginatedParams, get } from "@/shared/api/api.ts";
import { parseDto } from "@/shared/api/parseDto.ts";

export const smsIntegrationApi = {
  getBalance: async (): Promise<SmsBalance> => {
    const response = await get<{ data: unknown }>(
      SMS_INTEGRATION_API.balance(),
    );
    return mapSmsBalanceDtoToSmsBalance(
      parseDto(SmsBalanceDtoSchema, response.data),
    );
  },

  messages: {
    getAll: async (
      page = 1,
      perPage = 20,
      sortColumn?: string | null,
      sortType?: SortType,
      filters?: Record<string, string>,
    ): Promise<PaginatedResponse<SmsMessage>> => {
      const params = buildPaginatedParams(
        page,
        perPage,
        sortColumn,
        sortType,
        filters,
      );
      const response = await get(
        `${SMS_INTEGRATION_API.messages()}?${params.toString()}`,
      );
      return mapPaginatedSmsMessagesDtoToResponse(
        parseDto(PaginatedSmsMessagesDtoSchema, response),
      );
    },
  },
};
