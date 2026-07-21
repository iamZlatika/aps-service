import { z } from "zod";

import { mapPaginatedItems } from "@/features/dictionaries/lib/adapters.ts";
import type { PaginatedDictionaryItems } from "@/features/dictionaries/types.ts";
import { buildPaginatedParams, del, get, post, put } from "@/shared/api/api.ts";
import { parseDto } from "@/shared/api/parseDto";
import { type SortType } from "@/widgets/table/hooks/useSortParams.ts";
import type { BaseItem } from "@/widgets/table/models/types.ts";

import {
  DictionaryItemDtoSchema,
  PaginationLinksDtoSchema,
  PaginationMetaDtoSchema,
} from "./dto.ts";

interface DictionaryApiRoutes {
  list: () => string;
  item: (id: number) => string;
}

export const createTypedDictionaryApi = <
  TDto extends BaseItem,
  TOut extends BaseItem = TDto,
>(
  routes: DictionaryApiRoutes,
  itemSchema: z.ZodType<TDto>,
  map?: (dto: TDto) => TOut,
) => {
  const resolve = map ?? ((dto: TDto) => dto as unknown as TOut);

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
      filters?: Record<string, string | string[]>,
    ): Promise<PaginatedDictionaryItems<TOut>> => {
      const params = buildPaginatedParams(
        page,
        perPage,
        sortColumn,
        sortType,
        filters,
      );
      const response = await get<unknown>(
        `${routes.list()}?${params.toString()}`,
      );
      const validated = parseDto(paginatedSchema, response);
      return mapPaginatedItems(validated.data.map(resolve), validated.meta);
    },

    create: async (data: Partial<TDto>): Promise<TOut> => {
      const response = await post<Partial<TDto>, { data: unknown }>(
        routes.list(),
        data,
      );
      return resolve(parseDto(itemSchema, response.data));
    },

    update: async (
      id: number,
      data: Record<string, unknown>,
    ): Promise<TOut> => {
      const response = await put<Record<string, unknown>, { data: unknown }>(
        routes.item(id),
        data,
      );
      return resolve(parseDto(itemSchema, response.data));
    },

    remove: async (id: number): Promise<void> => {
      await del(routes.item(id));
    },
  };
};

export const createDictionaryApi = (routes: DictionaryApiRoutes) =>
  createTypedDictionaryApi(routes, DictionaryItemDtoSchema);
