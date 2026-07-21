import { buildPaginatedParams, del, get, post, put } from "@/shared/api/api";
import { parseDto } from "@/shared/api/parseDto";
import { type SortType } from "@/widgets/table/hooks/useSortParams";
import { type PaginatedResponse } from "@/widgets/table/models/types";

import { mapBackofficeWorkDtoToBackofficeWork } from "../lib/adapters";
import type { WorkEditFormValues } from "../lib/work-edit.schema";
import { type BackofficeWork, type SetPublishedPayload } from "../types";
import {
  BackofficeWorkItemDtoSchema,
  BackofficeWorksListDtoSchema,
} from "./dto";
import { WORKS_API } from "./endpoints";

export const worksApi = {
  getAll: async (
    page = 1,
    perPage = 15,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Record<string, string>,
  ): Promise<PaginatedResponse<BackofficeWork>> => {
    const params = buildPaginatedParams(
      page,
      perPage,
      sortColumn,
      sortType,
      filters,
    );
    const response = await get<unknown>(
      `${WORKS_API.list()}?${params.toString()}`,
    );
    const validated = parseDto(BackofficeWorksListDtoSchema, response);
    return {
      items: validated.data.map(mapBackofficeWorkDtoToBackofficeWork),
      meta: {
        currentPage: validated.meta.current_page,
        lastPage: validated.meta.last_page,
        total: validated.meta.total,
      },
    };
  },

  create: async (data: FormData): Promise<BackofficeWork> => {
    const response = await post<FormData, unknown>(WORKS_API.list(), data);
    const validated = parseDto(BackofficeWorkItemDtoSchema, response);
    return mapBackofficeWorkDtoToBackofficeWork(validated.data);
  },

  show: async (id: number): Promise<BackofficeWork> => {
    const response = await get<unknown>(WORKS_API.item(id));
    const validated = parseDto(BackofficeWorkItemDtoSchema, response);
    return mapBackofficeWorkDtoToBackofficeWork(validated.data);
  },

  delete: async (id: number): Promise<void> => {
    await del(WORKS_API.item(id));
  },

  setPublished: async (
    id: number,
    data: SetPublishedPayload,
  ): Promise<BackofficeWork> => {
    const response = await put<SetPublishedPayload, unknown>(
      WORKS_API.publish(id),
      data,
    );
    const validated = parseDto(BackofficeWorkItemDtoSchema, response);
    return mapBackofficeWorkDtoToBackofficeWork(validated.data);
  },

  update: async (
    id: number,
    data: WorkEditFormValues,
  ): Promise<BackofficeWork> => {
    const response = await put<WorkEditFormValues, unknown>(
      WORKS_API.item(id),
      data,
    );
    const validated = parseDto(BackofficeWorkItemDtoSchema, response);
    return mapBackofficeWorkDtoToBackofficeWork(validated.data);
  },
};
