import {
  PaginatedBalancesDtoSchema,
  PaginatedTransactionsDtoSchema,
  SystemBalanceDtoSchema,
  TransactionDtoSchema,
} from "@/features/backoffice/modules/billing/api/dto.ts";
import { BILLING_API } from "@/features/backoffice/modules/billing/api/endpoints.ts";
import {
  mapNewTransactionToDto,
  mapPaginatedBalancesDtoToResponse,
  mapPaginatedTransactionsDtoToResponse,
  mapSystemBalanceDtoToSystemBalance,
  mapTransactionDtoToTransaction,
} from "@/features/backoffice/modules/billing/lib/adapters.ts";
import type {
  Balance,
  NewBillingTransaction,
  SystemBalance,
  Transaction,
} from "@/features/backoffice/modules/billing/types.ts";
import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";
import { buildPaginatedParams, get, post } from "@/shared/api/api.ts";
import { parseDto } from "@/shared/api/parseDto.ts";

export const billingApi = {
  balances: {
    getAll: async (
      page = 1,
      perPage = 20,
      sortColumn?: string | null,
      sortType?: SortType,
      filters?: Record<string, string>,
    ): Promise<PaginatedResponse<Balance>> => {
      const params = buildPaginatedParams(
        page,
        perPage,
        sortColumn,
        sortType,
        filters,
      );
      const response = await get(
        `${BILLING_API.balances()}?${params.toString()}`,
      );
      return mapPaginatedBalancesDtoToResponse(
        parseDto(PaginatedBalancesDtoSchema, response),
      );
    },
  },

  allTransactions: {
    getAll: async (
      page = 1,
      perPage = 20,
      sortColumn?: string | null,
      sortType?: SortType,
      filters?: Record<string, string>,
    ): Promise<PaginatedResponse<Transaction>> => {
      const params = buildPaginatedParams(
        page,
        perPage,
        sortColumn,
        sortType,
        filters,
      );
      const response = await get(
        `${BILLING_API.allTransactions()}?${params.toString()}`,
      );
      return mapPaginatedTransactionsDtoToResponse(
        parseDto(PaginatedTransactionsDtoSchema, response),
      );
    },
  },

  getSystemBalance: async (): Promise<SystemBalance> => {
    const response = await get<{ data: unknown }>(BILLING_API.systemBalance());
    return mapSystemBalanceDtoToSystemBalance(
      parseDto(SystemBalanceDtoSchema, response.data),
    );
  },

  createTransaction: async (
    data: NewBillingTransaction,
  ): Promise<Transaction> => {
    const payload = mapNewTransactionToDto(data);
    const response = await post<typeof payload, { data: unknown }>(
      BILLING_API.transactions(),
      payload,
    );
    return mapTransactionDtoToTransaction(
      parseDto(TransactionDtoSchema, response.data),
    );
  },
};
