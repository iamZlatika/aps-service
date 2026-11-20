import { z } from "zod";

import { LocationDtoSchema } from "@/entities/location/dto.ts";
import { SupplierDtoSchema } from "@/features/dictionaries/api/dto.ts";
import { UserDtoSchema } from "@/features/users/api/dto.ts";
import {
  DONOR_STATUSES,
  STOCK_MOVEMENT_REASONS,
  WAREHOUSE_CATEGORY_KINDS,
  WAREHOUSE_ITEM_KINDS,
  WAREHOUSE_SOURCES,
  WAREHOUSE_UNITS,
} from "@/features/warehouse/types.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";

const PaginationMetaDtoSchema = z.object({
  current_page: z.number(),
  last_page: z.number(),
  total: z.number(),
});

// ── Dictionaries ────────────────────────────────────────────────────────────

export const WarehouseCategoryDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  kind: zodEnumFromConst(WAREHOUSE_CATEGORY_KINDS),
});
export type WarehouseCategoryDto = z.infer<typeof WarehouseCategoryDtoSchema>;

export const WarehouseCategoryResponseDtoSchema = z.object({
  data: WarehouseCategoryDtoSchema,
});

export const WarehouseCategoriesDtoSchema = z.object({
  data: z.array(WarehouseCategoryDtoSchema),
});

export const StoragePlaceDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  location_id: z.number().nullable(),
});
export type StoragePlaceDto = z.infer<typeof StoragePlaceDtoSchema>;

export const StoragePlaceResponseDtoSchema = z.object({
  data: StoragePlaceDtoSchema,
});

export const StoragePlacesDtoSchema = z.object({
  data: z.array(StoragePlaceDtoSchema),
});

// ── Items ───────────────────────────────────────────────────────────────────

export const WarehouseStockDtoSchema = z.object({
  // null for an office where the item was never stocked (quantity 0).
  id: z.number().nullable(),
  location_id: z.number(),
  location: LocationDtoSchema,
  quantity: z.number(),
});
export type WarehouseStockDto = z.infer<typeof WarehouseStockDtoSchema>;

export const StockMovementDtoSchema = z.object({
  id: z.number(),
  location: LocationDtoSchema.nullable(),
  delta: z.number(),
  reason: zodEnumFromConst(STOCK_MOVEMENT_REASONS),
  order_id: z.number().nullable(),
  quick_order_id: z.number().nullable(),
  order_product_id: z.number().nullable(),
  user: UserDtoSchema.nullable(),
  // The item's purchase price at the moment of the movement.
  purchase_price: z.string().nullable(),
  note: z.string().nullable(),
  created_at: z.iso.datetime(),
});
export type StockMovementDto = z.infer<typeof StockMovementDtoSchema>;

export const WarehouseItemDtoSchema = z.object({
  id: z.number(),
  kind: zodEnumFromConst(WAREHOUSE_ITEM_KINDS),
  category: WarehouseCategoryDtoSchema,
  name: z.string(),
  price: z.string().nullable(),
  purchase_price: z.string().nullable(),
  supplier: SupplierDtoSchema.nullable(),
  order_url: z.string().nullable(),
  unit: zodEnumFromConst(WAREHOUSE_UNITS),
  photo_url: z.string().nullable(),
  stocks: z.array(WarehouseStockDtoSchema),
  total_quantity: z.number(),
});
export type WarehouseItemDto = z.infer<typeof WarehouseItemDtoSchema>;

export const WarehouseItemDetailDtoSchema = WarehouseItemDtoSchema.extend({
  movements: z.array(StockMovementDtoSchema),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});
export type WarehouseItemDetailDto = z.infer<
  typeof WarehouseItemDetailDtoSchema
>;

export const PaginatedWarehouseItemsDtoSchema = z.object({
  data: z.array(WarehouseItemDtoSchema),
  meta: PaginationMetaDtoSchema,
});
export type PaginatedWarehouseItemsDto = z.infer<
  typeof PaginatedWarehouseItemsDtoSchema
>;

// ── Donors & parts ──────────────────────────────────────────────────────────

export const DonorShortDtoSchema = z.object({
  id: z.number(),
  manufacturer: z.string().nullable(),
  device_type: z.string().nullable(),
  device_model: z.string().nullable(),
});
export type DonorShortDto = z.infer<typeof DonorShortDtoSchema>;

// Exactly one of the two is set: a dictionary place or free text kept on the card.
const StoragePlaceFieldsDtoSchema = z.object({
  storage_place: StoragePlaceDtoSchema.nullable(),
  storage_place_note: z.string().nullable(),
});

const SaleInfoDtoSchema = z.object({
  sold_in_order_id: z.number().nullable(),
  sold_in_quick_order_id: z.number().nullable(),
  sold_at: z.iso.datetime().nullable(),
  /** Price of the selling line itself (not the donor's whole revenue). */
  sold_price: z.string().nullable(),
});

export const DonorDtoSchema = DonorShortDtoSchema.extend({
  ...StoragePlaceFieldsDtoSchema.shape,
  ...SaleInfoDtoSchema.shape,
  status: zodEnumFromConst(DONOR_STATUSES),
  source_order_id: z.number().nullable(),
  origin: z.string().nullable(),
  supplier: SupplierDtoSchema.nullable(),
  location: LocationDtoSchema.nullable(),
  acquisition_cost: z.string().nullable(),
  note: z.string().nullable(),
  parts_count: z.number(),
  investments_count: z.number(),
  investments_total: z.string(),
});
export type DonorDto = z.infer<typeof DonorDtoSchema>;

export const DonorPartDtoSchema = z.object({
  id: z.number(),
  donor: DonorShortDtoSchema.nullable(),
  category: WarehouseCategoryDtoSchema,
  name: z.string().nullable(),
  cost_price: z.string().nullable(),
  is_sold: z.boolean(),
  sold_with_donor: z.boolean(),
  ...SaleInfoDtoSchema.shape,
  ...StoragePlaceFieldsDtoSchema.shape,
  location: LocationDtoSchema.nullable(),
  note: z.string().nullable(),
  photo_url: z.string().nullable(),
});
export type DonorPartDto = z.infer<typeof DonorPartDtoSchema>;

export const DonorInvestmentDtoSchema = z.object({
  id: z.number(),
  warehouse_item_id: z.number().nullable(),
  name: z.string(),
  quantity: z.number(),
  amount: z.string(),
  note: z.string().nullable(),
  created_at: z.iso.datetime(),
});
export type DonorInvestmentDto = z.infer<typeof DonorInvestmentDtoSchema>;

export const DonorEconomicsDtoSchema = z.object({
  acquisition_cost: z.string(),
  investments_total: z.string(),
  total_cost: z.string(),
  parts_cost_recovered: z.string(),
  revenue: z.string(),
  profit: z.string(),
});
export type DonorEconomicsDto = z.infer<typeof DonorEconomicsDtoSchema>;

export const DonorDetailDtoSchema = DonorDtoSchema.extend({
  parts: z.array(DonorPartDtoSchema),
  investments: z.array(DonorInvestmentDtoSchema),
  economics: DonorEconomicsDtoSchema,
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});
export type DonorDetailDto = z.infer<typeof DonorDetailDtoSchema>;

export const PaginatedDonorsDtoSchema = z.object({
  data: z.array(DonorDtoSchema),
  meta: PaginationMetaDtoSchema,
});
export type PaginatedDonorsDto = z.infer<typeof PaginatedDonorsDtoSchema>;

export const PaginatedDonorPartsDtoSchema = z.object({
  data: z.array(DonorPartDtoSchema),
  meta: PaginationMetaDtoSchema,
});
export type PaginatedDonorPartsDto = z.infer<
  typeof PaginatedDonorPartsDtoSchema
>;

// ── Unified search ──────────────────────────────────────────────────────────

export const WarehouseSearchResultDtoSchema = z.object({
  source: zodEnumFromConst(WAREHOUSE_SOURCES),
  id: z.number(),
  name: z.string(),
  category: WarehouseCategoryDtoSchema,
  price: z.string().nullable(),
  purchase_price: z.string().nullable(),
  quantity: z.number().nullable(),
  storage_place: StoragePlaceDtoSchema.nullable(),
  // v6 documents the note on donors and parts only — optional here until the
  // picker response is confirmed to carry it.
  storage_place_note: z.string().nullish(),
  location: LocationDtoSchema.nullable(),
  donor: DonorShortDtoSchema.nullable(),
});
export type WarehouseSearchResultDto = z.infer<
  typeof WarehouseSearchResultDtoSchema
>;

export const WarehouseSearchDtoSchema = z.object({
  data: z.array(WarehouseSearchResultDtoSchema),
});
export type WarehouseSearchDto = z.infer<typeof WarehouseSearchDtoSchema>;
