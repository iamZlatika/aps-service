import {
  PaginatedBalancesDtoSchema,
  PaginatedTransactionsDtoSchema,
  SystemBalanceDtoSchema,
  TransactionDtoSchema,
} from "@/features/billing/api/dto.ts";
import { BILLING_API } from "@/features/billing/api/endpoints.ts";
import {
  mapNewSystemBalanceTransactionToDto,
  mapNewTransactionToDto,
  mapNewWithdrawalRequestToDto,
  mapPaginatedBalancesDtoToResponse,
  mapPaginatedTransactionsDtoToResponse,
  mapSystemBalanceDtoToSystemBalance,
  mapTransactionDtoToTransaction,
} from "@/features/billing/lib/adapters.ts";
import type {
  Balance,
  NewBillingTransaction,
  NewSystemBalanceTransaction,
  NewWithdrawalRequest,
  SystemBalance,
  Transaction,
} from "@/features/billing/types.ts";
import { buildPaginatedParams, get, post } from "@/shared/api/api.ts";
import { parseDto } from "@/shared/api/parseDto.ts";
import { TRANSACTION_STATUSES, TRANSACTION_TYPES } from "@/shared/types.ts";
import type { SortType } from "@/widgets/table/hooks/useSortParams.ts";
import type { PaginatedResponse } from "@/widgets/table/models/types.ts";

async function fetchPaginatedTransactions(
  endpoint: string,
  page = 1,
  perPage = 20,
  sortColumn?: string | null,
  sortType?: SortType,
  filters?: Record<string, string>,
): Promise<PaginatedResponse<Transaction>> {
  const params = buildPaginatedParams(
    page,
    perPage,
    sortColumn,
    sortType,
    filters,
  );
  const response = await get(`${endpoint}?${params.toString()}`);
  return mapPaginatedTransactionsDtoToResponse(
    parseDto(PaginatedTransactionsDtoSchema, response),
  );
}

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
    getAll: (
      page?: number,
      perPage?: number,
      sortColumn?: string | null,
      sortType?: SortType,
      filters?: Record<string, string>,
    ): Promise<PaginatedResponse<Transaction>> =>
      fetchPaginatedTransactions(
        BILLING_API.allTransactions(),
        page,
        perPage,
        sortColumn,
        sortType,
        filters,
      ),
  },

  myTransactions: {
    getAll: (
      page?: number,
      perPage?: number,
      sortColumn?: string | null,
      sortType?: SortType,
      filters?: Record<string, string>,
    ): Promise<PaginatedResponse<Transaction>> =>
      fetchPaginatedTransactions(
        BILLING_API.transactions(),
        page,
        perPage,
        sortColumn,
        sortType,
        filters,
      ),
  },

  // Always forces type/status regardless of whatever filters the table passes in —
  // this is a fixed "pending withdrawal requests" view, not a user-editable filter.
  withdrawalRequests: {
    getAll: (
      page?: number,
      perPage?: number,
      sortColumn?: string | null,
      sortType?: SortType,
      filters?: Record<string, string>,
    ): Promise<PaginatedResponse<Transaction>> =>
      fetchPaginatedTransactions(
        BILLING_API.allTransactions(),
        page,
        perPage,
        sortColumn,
        sortType,
        {
          ...filters,
          type: TRANSACTION_TYPES.WITHDRAWAL_REQUEST,
          status: TRANSACTION_STATUSES.PENDING,
        },
      ),
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

  requestWithdrawal: async (
    data: NewWithdrawalRequest,
  ): Promise<Transaction> => {
    const payload = mapNewWithdrawalRequestToDto(data);
    const response = await post<typeof payload, { data: unknown }>(
      BILLING_API.withdrawals(),
      payload,
    );
    return mapTransactionDtoToTransaction(
      parseDto(TransactionDtoSchema, response.data),
    );
  },

  approveWithdrawal: async (id: number): Promise<Transaction> => {
    const response = await post<undefined, { data: unknown }>(
      BILLING_API.withdrawalApprove(id),
    );
    return mapTransactionDtoToTransaction(
      parseDto(TransactionDtoSchema, response.data),
    );
  },

  rejectWithdrawal: async (id: number): Promise<Transaction> => {
    const response = await post<undefined, { data: unknown }>(
      BILLING_API.withdrawalReject(id),
    );
    return mapTransactionDtoToTransaction(
      parseDto(TransactionDtoSchema, response.data),
    );
  },

  adjustSystemBalance: async (
    data: NewSystemBalanceTransaction,
  ): Promise<Transaction> => {
    const payload = mapNewSystemBalanceTransactionToDto(data);
    const response = await post<typeof payload, { data: unknown }>(
      BILLING_API.transactions(),
      payload,
    );
    return mapTransactionDtoToTransaction(
      parseDto(TransactionDtoSchema, response.data),
    );
  },
};
