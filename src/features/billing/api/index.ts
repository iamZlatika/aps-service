import {
  OrderPaymentsSummaryDtoSchema,
  PaginatedBalancesDtoSchema,
  PaginatedOrderPaymentsDtoSchema,
  PaginatedTransactionsDtoSchema,
  SystemBalanceDtoSchema,
  TransactionDtoSchema,
} from "@/features/billing/api/dto.ts";
import { BILLING_API } from "@/features/billing/api/endpoints.ts";
import {
  mapNewSystemBalanceTransactionToDto,
  mapNewTransactionToDto,
  mapNewWithdrawalRequestToDto,
  mapOrderPaymentsFiltersToApiFilters,
  mapOrderPaymentsSummaryDtoToSummary,
  mapPaginatedBalancesDtoToResponse,
  mapPaginatedOrderPaymentsDtoToResponse,
  mapPaginatedTransactionsDtoToResponse,
  mapSystemBalanceDtoToSystemBalance,
  mapTransactionDtoToTransaction,
} from "@/features/billing/lib/adapters.ts";
import type {
  Balance,
  NewBillingTransaction,
  NewSystemBalanceTransaction,
  NewWithdrawalRequest,
  OrderPaymentRecord,
  OrderPaymentsSummary,
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

  orderPayments: {
    getAll: async (
      page = 1,
      perPage = 20,
      sortColumn?: string | null,
      sortType?: SortType,
      filters?: Record<string, string>,
    ): Promise<PaginatedResponse<OrderPaymentRecord>> => {
      const params = buildPaginatedParams(
        page,
        perPage,
        sortColumn,
        sortType,
        mapOrderPaymentsFiltersToApiFilters(filters ?? {}),
      );
      const response = await get(
        `${BILLING_API.orderPayments()}?${params.toString()}`,
      );
      return mapPaginatedOrderPaymentsDtoToResponse(
        parseDto(PaginatedOrderPaymentsDtoSchema, response),
      );
    },

    // Not paginated — totals cover the whole filtered set, per the backend
    // contract, so params are built directly rather than via
    // buildPaginatedParams (which always forces page/per_page).
    getSummary: async (
      filters?: Record<string, string>,
    ): Promise<OrderPaymentsSummary> => {
      const params = new URLSearchParams();
      Object.entries(
        mapOrderPaymentsFiltersToApiFilters(filters ?? {}),
      ).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(`${key}[]`, v));
        } else if (value) {
          params.set(key, value);
        }
      });
      const response = await get<{ data: unknown }>(
        `${BILLING_API.orderPaymentsSummary()}?${params.toString()}`,
      );
      return mapOrderPaymentsSummaryDtoToSummary(
        parseDto(OrderPaymentsSummaryDtoSchema, response.data),
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
