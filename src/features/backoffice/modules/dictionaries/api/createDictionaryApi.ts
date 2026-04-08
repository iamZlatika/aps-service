import { z } from "zod";

import { mapPaginatedItems } from "@/features/backoffice/modules/dictionaries/lib/adapter.ts";
import type { PaginatedDictionaryItems } from "@/features/backoffice/modules/dictionaries/types.ts";
import { type SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import type { BaseItem } from "@/features/backoffice/widgets/table/models/types.ts";
import { del, get, post, put } from "@/shared/api/api.ts";

import {
  DictionaryItemDtoSchema,
  PaginationLinksDtoSchema,
  PaginationMetaDtoSchema,
} from "./dto.ts";

interface DictionaryApiRoutes {
  list: () => string;
  item: (id: number) => string;
}

export const createTypedDictionaryApi = <T extends BaseItem>(
  routes: DictionaryApiRoutes,
  itemSchema: z.ZodType<T>,
) => {
  const paginatedSchema = z.object({
    data: z.array(itemSchema),
    links: PaginationLinksDtoSchema,
    meta: PaginationMetaDtoSchema,
  });

  return {
    getAll: async (
      page = 1,
      perPage = 15,
      sortColumn?: string | null,
      sortType?: SortType,
      filters?: Record<string, string>,
    ): Promise<PaginatedDictionaryItems<T>> => {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
      });
      if (sortColumn && sortType && sortType !== "none") {
        params.set("sort_column", sortColumn);
        params.set("sort_type", sortType);
      }
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });
      }

      const response = await get<unknown>(
        `${routes.list()}?${params.toString()}`,
      );
      const validated = paginatedSchema.parse(response);
      return mapPaginatedItems(validated.data, validated.meta);
    },

    create: async (data: Partial<T>): Promise<T> => {
      const response = await post<Partial<T>, { data: unknown }>(
        routes.list(),
        data,
      );
      return itemSchema.parse(response.data);
    },

    update: async (id: number, data: Record<string, unknown>): Promise<T> => {
      const response = await put<Record<string, unknown>, { data: unknown }>(
        routes.item(id),
        data,
      );
      return itemSchema.parse(response.data);
    },

    remove: async (id: number): Promise<void> => {
      await del(routes.item(id));
    },
  };
};

export const createDictionaryApi = (routes: DictionaryApiRoutes) =>
  createTypedDictionaryApi(routes, DictionaryItemDtoSchema);
