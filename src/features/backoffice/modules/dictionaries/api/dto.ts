import { z } from "zod";

import type { LocationSchedule } from "@/features/backoffice/modules/dictionaries/types.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";
import { STATUS_COLORS } from "@/shared/types.ts";

export const DictionaryItemDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type DictionaryItemDto = z.infer<typeof DictionaryItemDtoSchema>;

export const DictionaryItemsDtoSchema = z.array(DictionaryItemDtoSchema);

export const PaginationLinksDtoSchema = z.object({
  first: z.string().nullable(),
  last: z.string().nullable(),
  prev: z.string().nullable(),
  next: z.string().nullable(),
});

export const PaginationMetaLinkDtoSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  page: z.number().nullable().optional(),
  active: z.boolean(),
});

export const PaginationMetaDtoSchema = z.object({
  current_page: z.number(),
  from: z.number().nullable(),
  last_page: z.number(),
  links: z.array(PaginationMetaLinkDtoSchema),
  path: z.string(),
  per_page: z.number(),
  to: z.number().nullable(),
  total: z.number(),
});

export type PaginationMetaDto = z.infer<typeof PaginationMetaDtoSchema>;

export const PaginatedDictionaryItemsDtoSchema = z.object({
  data: DictionaryItemsDtoSchema,
  links: PaginationLinksDtoSchema,
  meta: PaginationMetaDtoSchema,
});

export const OrderStatusDtoSchema = z.object({
  id: z.number(),
  key: z.string(),
  name_ru: z.string(),
  name_ua: z.string(),
  color: zodEnumFromConst(STATUS_COLORS),
  is_system: z.boolean(),
});

export type OrderStatusDto = z.infer<typeof OrderStatusDtoSchema>;

export const SupplierDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  manager_name: z.string().nullable().optional().default(""),
  phone: z.string().nullable().optional().default(""),
  website: z.string().nullable().optional().default(""),
});

export type Supplier = z.infer<typeof SupplierDtoSchema>;

export const ProductDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  purchase_price: z.string(),
  supplier: SupplierDtoSchema,
});

export type Product = z.infer<typeof ProductDtoSchema>;

const ScheduleDayDtoSchema = z
  .object({ from: z.string(), to: z.string() })
  .nullable();

const LocationScheduleDtoSchema = z.object({
  mon: ScheduleDayDtoSchema,
  tue: ScheduleDayDtoSchema,
  wed: ScheduleDayDtoSchema,
  thu: ScheduleDayDtoSchema,
  fri: ScheduleDayDtoSchema,
  sat: ScheduleDayDtoSchema,
  sun: ScheduleDayDtoSchema,
});

export const LocationDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  schedule: LocationScheduleDtoSchema.nullable(),
  schedule_display: z.string().nullable(),
});

export type LocationDto = z.infer<typeof LocationDtoSchema>;

export type LocationPayload = {
  name: string;
  address: string;
  phone: string;
  schedule: LocationSchedule | null;
};

export const BankCardDtoSchema = z.object({
  id: z.number(),
  owner_name: z.string(),
  number: z.string(),
  pretty_number: z.string(),
  is_active: z.boolean(),
});

export type BankCardDto = z.infer<typeof BankCardDtoSchema>;
