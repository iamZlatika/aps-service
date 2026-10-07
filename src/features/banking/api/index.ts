import { PaginatedBankTransactionsDtoSchema } from "@/features/banking/api/dto.ts";
import { BANKING_API } from "@/features/banking/api/endpoints.ts";
import {
  mapBankTransactionsFiltersToApiFilters,
  mapPaginatedBankTransactionsDtoToResponse,
} from "@/features/banking/lib/adapters.ts";
import type { BankTransaction } from "@/features/banking/types.ts";
import { buildPaginatedParams, get } from "@/shared/api/api.ts";
import { parseDto } from "@/shared/api/parseDto.ts";
import type { SortType } from "@/widgets/table/hooks/useSortParams.ts";
import type { PaginatedResponse } from "@/widgets/table/models/types.ts";

export const bankingApi = {
  transactions: {
    getAll: async (
      page = 1,
      perPage = 20,
      sortColumn?: string | null,
      sortType?: SortType,
      filters?: Record<string, string>,
    ): Promise<PaginatedResponse<BankTransaction>> => {
      const params = buildPaginatedParams(
        page,
        perPage,
        sortColumn,
        sortType,
        mapBankTransactionsFiltersToApiFilters(filters ?? {}),
      );
      const response = await get(
        `${BANKING_API.transactions()}?${params.toString()}`,
      );
      return mapPaginatedBankTransactionsDtoToResponse(
        parseDto(PaginatedBankTransactionsDtoSchema, response),
      );
    },
  },
};
