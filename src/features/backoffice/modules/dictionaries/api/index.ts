import { post, put } from "@/shared/api/api.ts";
import { parseDto } from "@/shared/api/parseDto";

import {
  mapLocationDtoToLocation,
  mapOutsourcerDtoToOutsourcer,
  mapPriceListFormDataToPayload,
  mapPriceListItemDtoToPriceListItem,
  mapSupplierDtoToSupplier,
} from "../lib/adapters";
import type { PriceListItem } from "../types";
import {
  createDictionaryApi,
  createTypedDictionaryApi,
} from "./createDictionaryApi";
import {
  BankCardDtoSchema,
  LocationDtoSchema,
  type LocationPayload,
  OrderStatusDtoSchema,
  OutsourcerDtoSchema,
  PriceListItemDtoSchema,
  type PriceListItemPayload,
  SupplierDtoSchema,
} from "./dto";
import { DICTIONARIES_API } from "./endpoints";

export const accessoriesApi = createDictionaryApi({
  list: () => DICTIONARIES_API.accessories(),
  item: (id) => DICTIONARIES_API.accessory(id),
});
export const issueTypesApi = createDictionaryApi({
  list: () => DICTIONARIES_API.issueTypes(),
  item: (id) => DICTIONARIES_API.issueType(id),
});
export const deviceConditionsApi = createDictionaryApi({
  list: () => DICTIONARIES_API.deviceConditions(),
  item: (id) => DICTIONARIES_API.deviceCondition(id),
});
export const deviceModelsApi = createDictionaryApi({
  list: () => DICTIONARIES_API.deviceModels(),
  item: (id) => DICTIONARIES_API.deviceModel(id),
});
export const deviceTypesApi = createDictionaryApi({
  list: () => DICTIONARIES_API.deviceTypes(),
  item: (id) => DICTIONARIES_API.deviceType(id),
});
export const intakeNotesApi = createDictionaryApi({
  list: () => DICTIONARIES_API.intakeNotes(),
  item: (id) => DICTIONARIES_API.intakeNote(id),
});
export const manufacturersApi = createDictionaryApi({
  list: () => DICTIONARIES_API.manufacturers(),
  item: (id) => DICTIONARIES_API.manufacturer(id),
});
export const servicesApi = createDictionaryApi({
  list: () => DICTIONARIES_API.services(),
  item: (id) => DICTIONARIES_API.service(id),
});
export const orderStatusesApi = createTypedDictionaryApi(
  {
    list: () => DICTIONARIES_API.orderStatuses(),
    item: (id) => DICTIONARIES_API.orderStatus(id),
  },
  OrderStatusDtoSchema,
);
export const suppliersApi = createTypedDictionaryApi(
  {
    list: () => DICTIONARIES_API.suppliers(),
    item: (id) => DICTIONARIES_API.supplier(id),
  },
  SupplierDtoSchema,
  mapSupplierDtoToSupplier,
);
export const outsourcersApi = createTypedDictionaryApi(
  {
    list: () => DICTIONARIES_API.outsourcers(),
    item: (id) => DICTIONARIES_API.outsourcer(id),
  },
  OutsourcerDtoSchema,
  mapOutsourcerDtoToOutsourcer,
);
export const productsApi = createDictionaryApi({
  list: () => DICTIONARIES_API.products(),
  item: (id) => DICTIONARIES_API.product(id),
});
export const locationApi = {
  ...createTypedDictionaryApi(
    {
      list: () => DICTIONARIES_API.locations(),
      item: (id) => DICTIONARIES_API.location(id),
    },
    LocationDtoSchema,
    mapLocationDtoToLocation,
  ),
  create: async (data: LocationPayload) => {
    const response = await post<LocationPayload, { data: unknown }>(
      DICTIONARIES_API.locations(),
      data,
    );
    return mapLocationDtoToLocation(parseDto(LocationDtoSchema, response.data));
  },
  update: async (id: number, data: LocationPayload) => {
    const response = await put<LocationPayload, { data: unknown }>(
      DICTIONARIES_API.location(id),
      data,
    );
    return mapLocationDtoToLocation(parseDto(LocationDtoSchema, response.data));
  },
};
export const priceListApi = {
  ...createTypedDictionaryApi(
    {
      list: () => DICTIONARIES_API.priceList(),
      item: (id) => DICTIONARIES_API.priceListItem(id),
    },
    PriceListItemDtoSchema,
    mapPriceListItemDtoToPriceListItem,
  ),
  create: async (data: Record<string, unknown>): Promise<PriceListItem> => {
    const payload = mapPriceListFormDataToPayload(data);
    const response = await post<PriceListItemPayload, { data: unknown }>(
      DICTIONARIES_API.priceList(),
      payload,
    );
    return mapPriceListItemDtoToPriceListItem(
      parseDto(PriceListItemDtoSchema, response.data),
    );
  },
  update: async (
    id: number,
    data: Record<string, unknown>,
  ): Promise<PriceListItem> => {
    const payload = mapPriceListFormDataToPayload(data);
    const response = await put<PriceListItemPayload, { data: unknown }>(
      DICTIONARIES_API.priceListItem(id),
      payload,
    );
    return mapPriceListItemDtoToPriceListItem(
      parseDto(PriceListItemDtoSchema, response.data),
    );
  },
};

export const bankCardsApi = {
  ...createTypedDictionaryApi(
    {
      list: () => DICTIONARIES_API.bankCards(),
      item: (id) => DICTIONARIES_API.bankCard(id),
    },
    BankCardDtoSchema,
  ),
  toggleActive: async (id: number, isActive: boolean) => {
    const response = await put<{ is_active: boolean }, { data: unknown }>(
      DICTIONARIES_API.bankCardToggleActive(id),
      { is_active: isActive },
    );
    return parseDto(BankCardDtoSchema, response.data);
  },
};
