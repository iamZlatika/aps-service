import {
  PaginatedReferralsDtoSchema,
  PaginatedReferralTransactionsDtoSchema,
  type ReferralDto,
  ReferralDtoSchema,
  type ReferralTransactionDto,
  ReferralTransactionDtoSchema,
} from "@/features/backoffice/modules/referrals/api/dto.ts";
import { REFERRALS_API } from "@/features/backoffice/modules/referrals/api/endpoints.ts";
import {
  mapEditReferralToDto,
  mapNewReferralBalanceTransactionToDto,
  mapNewReferralToDto,
  mapPaginatedReferralsDtoToResponse,
  mapPaginatedReferralTransactionsDtoToResponse,
  mapReferralDtoToReferral,
  mapReferralTransactionDtoToReferralTransaction,
} from "@/features/backoffice/modules/referrals/lib/adapters.ts";
import type {
  EditReferral,
  NewReferral,
  NewReferralBalanceTransaction,
  Referral,
  ReferralTransaction,
} from "@/features/backoffice/modules/referrals/types.ts";
import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import type {
  PaginatedResponse,
  SmartTableApi,
} from "@/features/backoffice/widgets/table/models/types.ts";
import { buildPaginatedParams, del, get, post, put } from "@/shared/api/api.ts";
import { parseDto } from "@/shared/api/parseDto.ts";

export const referralsApi = {
  getAll: async (
    page = 1,
    perPage = 20,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Record<string, string>,
  ): Promise<PaginatedResponse<Referral>> => {
    const params = buildPaginatedParams(
      page,
      perPage,
      sortColumn,
      sortType,
      filters,
    );
    const response = await get(
      `${REFERRALS_API.referrals()}?${params.toString()}`,
    );
    return mapPaginatedReferralsDtoToResponse(
      parseDto(PaginatedReferralsDtoSchema, response),
    );
  },

  getOne: async (id: number): Promise<Referral> => {
    const response = await get<{ data: ReferralDto }>(
      REFERRALS_API.referral(id),
    );
    return mapReferralDtoToReferral(parseDto(ReferralDtoSchema, response.data));
  },

  create: async (data: NewReferral): Promise<Referral> => {
    const payload = mapNewReferralToDto(data);
    const response = await post<typeof payload, { data: ReferralDto }>(
      REFERRALS_API.referrals(),
      payload,
    );
    return mapReferralDtoToReferral(parseDto(ReferralDtoSchema, response.data));
  },

  update: async (id: number, data: EditReferral): Promise<Referral> => {
    const payload = mapEditReferralToDto(data);
    const response = await put<typeof payload, { data: ReferralDto }>(
      REFERRALS_API.referral(id),
      payload,
    );
    return mapReferralDtoToReferral(parseDto(ReferralDtoSchema, response.data));
  },

  demote: async (id: number): Promise<void> => {
    await del<void>(REFERRALS_API.referral(id));
  },

  transactions: {
    getAll: async (
      referralId: number,
      page = 1,
      perPage = 20,
      sortColumn?: string | null,
      sortType?: SortType,
      filters?: Record<string, string>,
    ): Promise<PaginatedResponse<ReferralTransaction>> => {
      const params = buildPaginatedParams(
        page,
        perPage,
        sortColumn,
        sortType,
        filters,
      );
      const response = await get(
        `${REFERRALS_API.transactions(referralId)}?${params.toString()}`,
      );
      return mapPaginatedReferralTransactionsDtoToResponse(
        parseDto(PaginatedReferralTransactionsDtoSchema, response),
      );
    },
  },

  adjustBalance: async (
    id: number,
    data: NewReferralBalanceTransaction,
  ): Promise<ReferralTransaction> => {
    const payload = mapNewReferralBalanceTransactionToDto(data);
    const response = await post<
      typeof payload,
      { data: ReferralTransactionDto }
    >(REFERRALS_API.adjust(id), payload);
    return mapReferralTransactionDtoToReferralTransaction(
      parseDto(ReferralTransactionDtoSchema, response.data),
    );
  },
};

// Binds a referral id to a SmartTable-compatible `getAll`, mirroring how
// billingApi.withdrawalRequests forces fixed filters onto a shared endpoint.
export const createReferralTransactionsApi = (
  referralId: number,
): SmartTableApi<ReferralTransaction> => ({
  getAll: (page, perPage, sortColumn, sortType, filters) =>
    referralsApi.transactions.getAll(
      referralId,
      page,
      perPage,
      sortColumn,
      sortType,
      filters,
    ),
});
