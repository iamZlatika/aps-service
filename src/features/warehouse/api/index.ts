import {
  type DonorDetailDto,
  DonorDetailDtoSchema,
  type DonorPartDto,
  DonorPartDtoSchema,
  PaginatedDonorPartsDtoSchema,
  PaginatedDonorsDtoSchema,
  PaginatedWarehouseItemsDtoSchema,
  StoragePlaceResponseDtoSchema,
  StoragePlacesDtoSchema,
  WarehouseCategoriesDtoSchema,
  WarehouseCategoryResponseDtoSchema,
  type WarehouseItemDetailDto,
  WarehouseItemDetailDtoSchema,
  WarehouseSearchDtoSchema,
} from "@/features/warehouse/api/dto.ts";
import { WAREHOUSE_API } from "@/features/warehouse/api/endpoints.ts";
import {
  mapDonorDetailDto,
  mapDonorPartDto,
  mapNewDonorInvestmentToDto,
  mapNewDonorPartToDto,
  mapNewDonorToDto,
  mapNewStockMovementToDto,
  mapNewWarehouseItemToDto,
  mapPaginatedDonorPartsDto,
  mapPaginatedDonorsDto,
  mapPaginatedWarehouseItemsDto,
  mapStoragePlaceDto,
  mapWarehouseCategoryDto,
  mapWarehouseItemDetailDto,
  mapWarehouseSearchResultDto,
} from "@/features/warehouse/lib/adapters.ts";
import type {
  DictionaryRef,
  Donor,
  DonorDetail,
  DonorPart,
  NewDonor,
  NewDonorInvestment,
  NewDonorPart,
  NewStockMovement,
  NewStoragePlace,
  NewWarehouseItem,
  StoragePlace,
  WarehouseCategory,
  WarehouseCategoryKind,
  WarehouseItem,
  WarehouseItemDetail,
  WarehouseSearchParams,
  WarehouseSearchResult,
} from "@/features/warehouse/types.ts";
import { buildPaginatedParams, del, get, post, put } from "@/shared/api/api.ts";
import { parseDto } from "@/shared/api/parseDto.ts";
import type { SortType } from "@/widgets/table/hooks/useSortParams.ts";
import type { PaginatedResponse } from "@/widgets/table/models/types.ts";

type DataEnvelope<T> = { data: T };

const MULTIPART_CONFIG = {
  headers: { "Content-Type": "multipart/form-data" },
} as const;

function buildPhotoForm(file: File): FormData {
  const formData = new FormData();
  formData.append("photo", file);
  return formData;
}

async function getPaginated(
  url: string,
  page: number,
  perPage: number,
  sortColumn?: string | null,
  sortType?: SortType,
  filters?: Record<string, string>,
): Promise<unknown> {
  const params = buildPaginatedParams(
    page,
    perPage,
    sortColumn,
    sortType,
    filters,
  );
  return get(`${url}?${params.toString()}`);
}

export const warehouseApi = {
  // ── Items ────────────────────────────────────────────────────────────────
  getItems: async (
    page = 1,
    perPage = 20,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Record<string, string>,
  ): Promise<PaginatedResponse<WarehouseItem>> => {
    const response = await getPaginated(
      WAREHOUSE_API.items(),
      page,
      perPage,
      sortColumn,
      sortType,
      filters,
    );
    const dto = parseDto(PaginatedWarehouseItemsDtoSchema, response);
    return mapPaginatedWarehouseItemsDto(dto);
  },

  getItem: async (id: number): Promise<WarehouseItemDetail> => {
    const response = await get<DataEnvelope<WarehouseItemDetailDto>>(
      WAREHOUSE_API.item(id),
    );
    const dto = parseDto(WarehouseItemDetailDtoSchema, response.data);
    return mapWarehouseItemDetailDto(dto);
  },

  createItem: async (data: NewWarehouseItem): Promise<WarehouseItemDetail> => {
    const payload = mapNewWarehouseItemToDto(data);
    const response = await post<
      typeof payload,
      DataEnvelope<WarehouseItemDetailDto>
    >(WAREHOUSE_API.items(), payload);
    const dto = parseDto(WarehouseItemDetailDtoSchema, response.data);
    return mapWarehouseItemDetailDto(dto);
  },

  updateItem: async (
    id: number,
    data: NewWarehouseItem,
  ): Promise<WarehouseItemDetail> => {
    const payload = mapNewWarehouseItemToDto(data);
    const response = await put<
      typeof payload,
      DataEnvelope<WarehouseItemDetailDto>
    >(WAREHOUSE_API.item(id), payload);
    const dto = parseDto(WarehouseItemDetailDtoSchema, response.data);
    return mapWarehouseItemDetailDto(dto);
  },

  deleteItem: async (id: number): Promise<void> => {
    await del<void>(WAREHOUSE_API.item(id));
  },

  changeStock: async (
    id: number,
    data: NewStockMovement,
  ): Promise<WarehouseItemDetail> => {
    const payload = mapNewStockMovementToDto(data);
    const response = await post<
      typeof payload,
      DataEnvelope<WarehouseItemDetailDto>
    >(WAREHOUSE_API.itemStock(id), payload);
    const dto = parseDto(WarehouseItemDetailDtoSchema, response.data);
    return mapWarehouseItemDetailDto(dto);
  },

  uploadItemPhoto: async (
    id: number,
    file: File,
  ): Promise<WarehouseItemDetail> => {
    const response = await post<FormData, DataEnvelope<WarehouseItemDetailDto>>(
      WAREHOUSE_API.itemPhoto(id),
      buildPhotoForm(file),
      MULTIPART_CONFIG,
    );
    const dto = parseDto(WarehouseItemDetailDtoSchema, response.data);
    return mapWarehouseItemDetailDto(dto);
  },

  // ── Donors ───────────────────────────────────────────────────────────────
  getDonors: async (
    page = 1,
    perPage = 20,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Record<string, string>,
  ): Promise<PaginatedResponse<Donor>> => {
    const response = await getPaginated(
      WAREHOUSE_API.donors(),
      page,
      perPage,
      sortColumn,
      sortType,
      filters,
    );
    const dto = parseDto(PaginatedDonorsDtoSchema, response);
    return mapPaginatedDonorsDto(dto);
  },

  getDonor: async (id: number): Promise<DonorDetail> => {
    const response = await get<DataEnvelope<DonorDetailDto>>(
      WAREHOUSE_API.donor(id),
    );
    const dto = parseDto(DonorDetailDtoSchema, response.data);
    return mapDonorDetailDto(dto);
  },

  createDonor: async (data: NewDonor): Promise<DonorDetail> => {
    const payload = mapNewDonorToDto(data);
    const response = await post<typeof payload, DataEnvelope<DonorDetailDto>>(
      WAREHOUSE_API.donors(),
      payload,
    );
    const dto = parseDto(DonorDetailDtoSchema, response.data);
    return mapDonorDetailDto(dto);
  },

  updateDonor: async (id: number, data: NewDonor): Promise<DonorDetail> => {
    const payload = mapNewDonorToDto(data);
    const response = await put<typeof payload, DataEnvelope<DonorDetailDto>>(
      WAREHOUSE_API.donor(id),
      payload,
    );
    const dto = parseDto(DonorDetailDtoSchema, response.data);
    return mapDonorDetailDto(dto);
  },

  deleteDonor: async (id: number): Promise<void> => {
    await del<void>(WAREHOUSE_API.donor(id));
  },

  orderToDonor: async (
    orderId: number,
    storagePlaceId: number,
  ): Promise<DonorDetail> => {
    const payload = { storage_place_id: storagePlaceId };
    const response = await post<typeof payload, DataEnvelope<DonorDetailDto>>(
      WAREHOUSE_API.orderToDonor(orderId),
      payload,
    );
    const dto = parseDto(DonorDetailDtoSchema, response.data);
    return mapDonorDetailDto(dto);
  },

  // ── Parts ────────────────────────────────────────────────────────────────
  getParts: async (
    page = 1,
    perPage = 20,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Record<string, string>,
  ): Promise<PaginatedResponse<DonorPart>> => {
    const response = await getPaginated(
      WAREHOUSE_API.parts(),
      page,
      perPage,
      sortColumn,
      sortType,
      filters,
    );
    const dto = parseDto(PaginatedDonorPartsDtoSchema, response);
    return mapPaginatedDonorPartsDto(dto);
  },

  /**
   * With a donor — attached to it (`POST /donors/{id}/parts`); without — a
   * standalone part (`POST /parts`). A part can't be re-attached later.
   */
  createPart: async (
    data: NewDonorPart,
    donorId: number | null,
  ): Promise<DonorPart> => {
    const payload = mapNewDonorPartToDto(data);
    const response = await post<typeof payload, DataEnvelope<DonorPartDto>>(
      donorId === null
        ? WAREHOUSE_API.parts()
        : WAREHOUSE_API.donorParts(donorId),
      payload,
    );
    const dto = parseDto(DonorPartDtoSchema, response.data);
    return mapDonorPartDto(dto);
  },

  updatePart: async (id: number, data: NewDonorPart): Promise<DonorPart> => {
    const payload = mapNewDonorPartToDto(data);
    const response = await put<typeof payload, DataEnvelope<DonorPartDto>>(
      WAREHOUSE_API.part(id),
      payload,
    );
    const dto = parseDto(DonorPartDtoSchema, response.data);
    return mapDonorPartDto(dto);
  },

  deletePart: async (id: number): Promise<void> => {
    await del<void>(WAREHOUSE_API.part(id));
  },

  uploadPartPhoto: async (id: number, file: File): Promise<DonorPart> => {
    const response = await post<FormData, DataEnvelope<DonorPartDto>>(
      WAREHOUSE_API.partPhoto(id),
      buildPhotoForm(file),
      MULTIPART_CONFIG,
    );
    const dto = parseDto(DonorPartDtoSchema, response.data);
    return mapDonorPartDto(dto);
  },

  // ── Dictionaries ─────────────────────────────────────────────────────────
  getCategories: async (
    kind?: WarehouseCategoryKind,
  ): Promise<WarehouseCategory[]> => {
    const query = kind ? `?kind=${kind}` : "";
    const response = await get(`${WAREHOUSE_API.categories()}${query}`);
    const dto = parseDto(WarehouseCategoriesDtoSchema, response);
    return dto.data.map(mapWarehouseCategoryDto);
  },

  /** Find-or-create: an existing name of the same kind is returned as is. */
  createCategory: async (
    name: string,
    kind: WarehouseCategoryKind,
  ): Promise<WarehouseCategory> => {
    const payload = { name, kind };
    const response = await post<typeof payload, unknown>(
      WAREHOUSE_API.categories(),
      payload,
    );
    const dto = parseDto(WarehouseCategoryResponseDtoSchema, response);
    return mapWarehouseCategoryDto(dto.data);
  },

  /** Rename only — the kind never changes. */
  renameCategory: async (
    id: number,
    name: string,
  ): Promise<WarehouseCategory> => {
    const payload = { name };
    const response = await put<typeof payload, unknown>(
      WAREHOUSE_API.category(id),
      payload,
    );
    const dto = parseDto(WarehouseCategoryResponseDtoSchema, response);
    return mapWarehouseCategoryDto(dto.data);
  },

  /** 422 `category_in_use` when any item or part still uses it. */
  deleteCategory: async (id: number): Promise<void> => {
    await del<void>(WAREHOUSE_API.category(id));
  },

  getStoragePlaces: async (): Promise<StoragePlace[]> => {
    const response = await get(WAREHOUSE_API.storagePlaces());
    const dto = parseDto(StoragePlacesDtoSchema, response);
    return dto.data.map(mapStoragePlaceDto);
  },

  /** Find-or-create by name + office (the same name may exist per office). */
  createStoragePlace: async (
    name: string,
    locationId: number | null,
  ): Promise<StoragePlace> => {
    const payload = { name, location_id: locationId };
    const response = await post<typeof payload, unknown>(
      WAREHOUSE_API.storagePlaces(),
      payload,
    );
    const dto = parseDto(StoragePlaceResponseDtoSchema, response);
    return mapStoragePlaceDto(dto.data);
  },

  /** Rename and / or move to another office; a duplicate name → 422 on `name`. */
  updateStoragePlace: async (
    id: number,
    place: NewStoragePlace,
  ): Promise<StoragePlace> => {
    const payload = { name: place.name, location_id: place.locationId };
    const response = await put<typeof payload, unknown>(
      WAREHOUSE_API.storagePlace(id),
      payload,
    );
    const dto = parseDto(StoragePlaceResponseDtoSchema, response);
    return mapStoragePlaceDto(dto.data);
  },

  // ── Donor investments ────────────────────────────────────────────────────
  /** In-stock donors only (422 `donor_sold_no_investments`); returns the full card. */
  addDonorInvestment: async (
    donorId: number,
    data: NewDonorInvestment,
  ): Promise<DonorDetail> => {
    const payload = mapNewDonorInvestmentToDto(data);
    const response = await post<typeof payload, DataEnvelope<DonorDetailDto>>(
      WAREHOUSE_API.donorInvestments(donorId),
      payload,
    );
    const dto = parseDto(DonorDetailDtoSchema, response.data);
    return mapDonorDetailDto(dto);
  },

  /** A warehouse line gives its stock back (a `return` movement). */
  deleteDonorInvestment: async (
    donorId: number,
    investmentId: number,
  ): Promise<DonorDetail> => {
    const response = await del<DataEnvelope<DonorDetailDto>>(
      WAREHOUSE_API.donorInvestment(donorId, investmentId),
    );
    const dto = parseDto(DonorDetailDtoSchema, response.data);
    return mapDonorDetailDto(dto);
  },

  /** 422 while any donor or part is still kept there. */
  deleteStoragePlace: async (id: number): Promise<void> => {
    await del<void>(WAREHOUSE_API.storagePlace(id));
  },

  /**
   * Endpoints that take only `storage_place_id`: a newly typed place is
   * found-or-created first (in the given office).
   */
  resolveStoragePlaceId: async (
    ref: DictionaryRef,
    locationId: number | null,
  ): Promise<number> => {
    if (ref.id !== null) return ref.id;
    const place = await warehouseApi.createStoragePlace(
      ref.name.trim(),
      locationId,
    );
    return place.id;
  },

  // ── Unified "+ product" search ───────────────────────────────────────────
  search: async ({
    q,
    locationId,
    context,
    sources,
  }: WarehouseSearchParams): Promise<WarehouseSearchResult[]> => {
    const params = new URLSearchParams({ context });
    if (q) params.set("q", q);
    // Nothing picked = everything, so the parameter is left out.
    if (sources.length) params.set("sources", sources.join(","));
    if (locationId !== null) params.set("location_id", String(locationId));
    const response = await get(
      `${WAREHOUSE_API.search()}?${params.toString()}`,
    );
    const dto = parseDto(WarehouseSearchDtoSchema, response);
    return dto.data.map(mapWarehouseSearchResultDto);
  },
};
