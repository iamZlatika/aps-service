import { z } from "zod";

import { type Schedule } from "@/entities/location/types";

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

export {
  type StatusDto as OrderStatusDto,
  StatusDtoSchema as OrderStatusDtoSchema,
} from "@/entities/order-status/dto";

export const SupplierDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  manager_name: z.string().nullable().optional().default(""),
  phone: z.string().nullable().optional().default(""),
  website: z.string().nullable().optional().default(""),
});

export type SupplierDto = z.infer<typeof SupplierDtoSchema>;

export const OutsourcerDtoSchema = SupplierDtoSchema;
export type OutsourcerDto = z.infer<typeof OutsourcerDtoSchema>;

export type SupplierPayload = {
  name: string;
  manager_name: string | null;
  phone: string | null;
  website: string | null;
};

export const ProductDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  purchase_price: z.string(),
  supplier: SupplierDtoSchema,
});

export type Product = z.infer<typeof ProductDtoSchema>;

export { type LocationDto, LocationDtoSchema } from "@/entities/location/dto";

export type LocationPayload = {
  name: string;
  city_ru: string;
  city_ua: string;
  district_ru: string;
  district_ua: string;
  street_ru: string;
  street_ua: string;
  building: string;
  phone: string;
  schedule: Schedule;
};

export {
  type PriceListItemDto,
  PriceListItemDtoSchema,
} from "@/entities/price-list/dto";

export type PriceListItemPayload = {
  name_ru: string;
  name_uk: string;
  category: string;
  price: number;
  price_note_ru: string | null;
  price_note_uk: string | null;
  sort_order: number;
};

export const BankCardDtoSchema = z.object({
  id: z.number(),
  owner_name: z.string(),
  number: z.string(),
  pretty_number: z.string(),
  is_active: z.boolean(),
});

export type BankCardDto = z.infer<typeof BankCardDtoSchema>;

export type BankCardPayload = {
  owner_name: string;
  number: string;
};
