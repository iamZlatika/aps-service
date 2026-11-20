import type { DonorSchema } from "@/features/warehouse/lib/donor.schema.ts";
import {
  type DonorInvestmentSchema,
  INVESTMENT_MODES,
} from "@/features/warehouse/lib/investment.schema.ts";
import type { WarehouseItemSchema } from "@/features/warehouse/lib/item.schema.ts";
import type { DonorPartSchema } from "@/features/warehouse/lib/part.schema.ts";
import {
  type DictionaryRef,
  type Donor,
  DONOR_STATUS_FILTERS,
  DONOR_STATUSES,
  type DonorPart,
  type DonorSalePart,
  type DonorShort,
  type DonorStatusFilter,
  MANUAL_STOCK_REASONS,
  type ManualStockReason,
  type NewDonor,
  type NewDonorInvestment,
  type NewDonorPart,
  type NewStoragePlace,
  type NewWarehouseItem,
  type SaleInfo,
  type StoragePlace,
  type StoragePlaceFields,
  WAREHOUSE_CATEGORY_KINDS,
  WAREHOUSE_ITEM_KINDS,
  WAREHOUSE_SOURCES,
  WAREHOUSE_UNITS,
  type WarehouseCategoryKind,
  type WarehouseItem,
  type WarehouseItemKind,
  type WarehouseLineSource,
  type WarehouseSearchResult,
  type WarehouseSource,
} from "@/features/warehouse/types.ts";
import { assertNever } from "@/shared/lib/assertNever.ts";
import type { PaginatedResponse } from "@/widgets/table/models/types.ts";

const EMPTY_REF: DictionaryRef = { id: null, name: "" };

// ── Generic helpers ─────────────────────────────────────────────────────────

export function filterByName<T extends { name: string }>(
  items: readonly T[],
  search: string,
): T[] {
  const needle = search.trim().toLocaleLowerCase();
  if (!needle) return [...items];
  return items.filter((item) => item.name.toLocaleLowerCase().includes(needle));
}

function toRef(entity: { id: number; name: string } | null): DictionaryRef {
  return entity ? { id: entity.id, name: entity.name } : EMPTY_REF;
}

/** A card with free-text place opens the form with that text typed in. */
function toStoragePlaceRef(entity: StoragePlaceFields): DictionaryRef {
  if (entity.storagePlace) return toRef(entity.storagePlace);
  return entity.storagePlaceNote
    ? { id: null, name: entity.storagePlaceNote }
    : EMPTY_REF;
}

// ── Display ─────────────────────────────────────────────────────────────────

/** "Where it lies" — the dictionary place or the free text on the card. */
export function getStoragePlaceLabel(
  entity: StoragePlaceFields,
): string | null {
  return entity.storagePlace?.name ?? entity.storagePlaceNote;
}

/** "Lenovo Ноутбук IdeaPad 3", or null when the donor has no device data at all. */
export function getDonorTitle(donor: DonorShort): string | null {
  const parts = [donor.manufacturer, donor.deviceType, donor.deviceModel]
    .map((part) => part?.trim())
    .filter(Boolean);
  return parts.length ? parts.join(" ") : null;
}

/** A nameless part is shown by its category name. */
export function getPartDisplayName(part: DonorPart): string {
  return part.name || part.category.name;
}

/**
 * Purchase and write-off are entered as a positive amount and get their sign
 * from the action; a correction is entered already signed (+5 / -2).
 */
export function getSignedStockQuantity(
  reason: ManualStockReason,
  quantity: number,
): number {
  switch (reason) {
    case MANUAL_STOCK_REASONS.PURCHASE:
      return Math.abs(quantity);
    case MANUAL_STOCK_REASONS.WRITEOFF:
      return -Math.abs(quantity);
    case MANUAL_STOCK_REASONS.CORRECTION:
      return quantity;
    default:
      return assertNever(reason);
  }
}

/**
 * Money fields prefilled from a card (an item's purchase price, a part's cost
 * price): only a changed, non-empty value is sent — it overwrites the card.
 */
export function getChangedMoneyValue(
  value: string,
  current: string | null,
): string | null {
  const next = value.trim();
  return next && next !== current ? next : null;
}

/** Switches one picker source on / off, keeping the canonical order. */
export function toggleSource(
  sources: readonly WarehouseSource[],
  source: WarehouseSource,
): WarehouseSource[] {
  const next = sources.includes(source)
    ? sources.filter((item) => item !== source)
    : [...sources, source];
  return Object.values(WAREHOUSE_SOURCES).filter((item) => next.includes(item));
}

export function getWarehouseLineSource(
  result: Pick<WarehouseSearchResult, "source" | "id">,
): WarehouseLineSource {
  return result.source === WAREHOUSE_SOURCES.DONOR_PART
    ? { warehouseItemId: null, donorPartId: result.id }
    : { warehouseItemId: result.id, donorPartId: null };
}

export function isDonorPartSource(
  result: Pick<WarehouseSearchResult, "source">,
): boolean {
  return result.source === WAREHOUSE_SOURCES.DONOR_PART;
}

// ── Donor sale & status ─────────────────────────────────────────────────────

export function isDonorSold(donor: Pick<Donor, "status">): boolean {
  return donor.status === DONOR_STATUSES.SOLD;
}

/** `?status=` from the URL; missing / unknown → in stock (the backend default). */
export function parseDonorStatusFilter(
  value: string | undefined,
): DonorStatusFilter {
  return (
    Object.values(DONOR_STATUS_FILTERS).find((status) => status === value) ??
    DONOR_STATUS_FILTERS.IN_STOCK
  );
}

/** In stock is the default — the parameter is then left out of the URL. */
export function toDonorStatusParam(status: DonorStatusFilter): string {
  return status === DONOR_STATUS_FILTERS.IN_STOCK ? "" : status;
}

export type SaleDocument =
  | { kind: "order"; id: number }
  | { kind: "quickOrder"; id: number };

/** The order or quick sale a donor / part left in, if any. */
export function getSaleDocument(sale: SaleInfo): SaleDocument | null {
  if (sale.soldInOrderId !== null) {
    return { kind: "order", id: sale.soldInOrderId };
  }
  if (sale.soldInQuickOrderId !== null) {
    return { kind: "quickOrder", id: sale.soldInQuickOrderId };
  }
  return null;
}

/** One donor part in the "sell donor" form. */
export type DonorSalePartRow = {
  id: number;
  label: string;
  selected: boolean;
  costPrice: string;
  /** The value on the card — sent again only when edited. */
  cardCostPrice: string | null;
};

/** Only parts on the shelf can go with the donor. */
export function getDonorSalePartRows(
  parts: readonly DonorPart[],
): DonorSalePartRow[] {
  return parts
    .filter((part) => !part.isSold)
    .map((part) => ({
      id: part.id,
      label: getPartDisplayName(part),
      selected: false,
      costPrice: part.costPrice ?? "",
      cardCostPrice: part.costPrice,
    }));
}

export function mapDonorSalePartRows(
  rows: readonly DonorSalePartRow[],
): DonorSalePart[] {
  return rows
    .filter((row) => row.selected)
    .map((row) => ({
      id: row.id,
      costPrice: getChangedMoneyValue(row.costPrice, row.cardCostPrice),
    }));
}

/**
 * The purchase the line will get: picked parts → the sum of their cost
 * prices; nothing picked → the donor's full cost (acquisition + investments).
 */
export function getDonorSalePurchase(
  rows: readonly Pick<DonorSalePartRow, "selected" | "costPrice">[],
  donorTotalCost: string,
): string {
  const selected = rows.filter((row) => row.selected);
  if (!selected.length) return donorTotalCost;
  return String(
    selected.reduce((sum, row) => sum + (Number(row.costPrice) || 0), 0),
  );
}

// ── Donor investments ───────────────────────────────────────────────────────

export function mapInvestmentFormToNew(
  values: DonorInvestmentSchema,
): NewDonorInvestment {
  if (values.mode === INVESTMENT_MODES.WAREHOUSE && values.itemId !== null) {
    return {
      warehouseItemId: values.itemId,
      quantity: Number(values.quantity),
      amount: values.amount,
      note: values.note,
    };
  }
  return {
    warehouseItemId: null,
    name: values.name,
    amount: values.amount,
    note: values.note,
  };
}

// ── Item form ───────────────────────────────────────────────────────────────

export function getWarehouseItemFormDefaults(
  kind: WarehouseItemKind,
  item?: WarehouseItem,
): WarehouseItemSchema {
  if (!item) {
    return {
      kind,
      category: EMPTY_REF,
      name: "",
      price: "",
      purchasePrice: "",
      supplierName: "",
      orderUrl: "",
      unit: WAREHOUSE_UNITS.PIECE,
    };
  }
  return {
    kind: item.kind,
    category: toRef(item.category),
    name: item.name,
    price: item.price ?? "",
    purchasePrice: item.purchasePrice ?? "",
    supplierName: item.supplier?.name ?? "",
    orderUrl: item.orderUrl ?? "",
    unit: item.unit,
  };
}

export function mapWarehouseItemFormToNewItem(
  values: WarehouseItemSchema,
): NewWarehouseItem {
  return {
    kind: values.kind,
    category: values.category,
    name: values.name,
    price: values.price,
    purchasePrice: values.purchasePrice,
    supplierName: values.supplierName,
    orderUrl: values.orderUrl,
    unit: values.unit,
  };
}

export function isShowcaseKind(kind: WarehouseItemKind): boolean {
  return kind === WAREHOUSE_ITEM_KINDS.SHOWCASE;
}

// ── Donor form ──────────────────────────────────────────────────────────────

export function getDonorFormDefaults(
  donor: Donor | undefined,
  defaultLocationId: number | null,
): Partial<DonorSchema> {
  if (!donor) {
    return {
      manufacturer: "",
      deviceType: "",
      deviceModel: "",
      origin: "",
      acquisitionCost: "",
      storagePlace: EMPTY_REF,
      saveStoragePlace: false,
      locationId: defaultLocationId ?? undefined,
      note: "",
    };
  }
  return {
    manufacturer: donor.manufacturer ?? "",
    deviceType: donor.deviceType ?? "",
    deviceModel: donor.deviceModel ?? "",
    origin: donor.origin ?? "",
    acquisitionCost: donor.acquisitionCost ?? "",
    storagePlace: toStoragePlaceRef(donor),
    saveStoragePlace: false,
    locationId: donor.location?.id ?? defaultLocationId ?? undefined,
    note: donor.note ?? "",
  };
}

/**
 * PUT replaces every field, so the form always sends the whole card. The
 * status is not part of it: only a sale makes a donor `sold` (and removing
 * the sale line brings it back to `in_stock`).
 */
export function mapDonorFormToNewDonor(
  values: DonorSchema,
  donor?: Donor,
): NewDonor {
  return {
    manufacturer: values.manufacturer,
    deviceType: values.deviceType,
    deviceModel: values.deviceModel,
    origin: values.origin,
    supplierId: donor?.supplier?.id ?? null,
    acquisitionCost: values.acquisitionCost,
    storagePlace: values.storagePlace,
    saveStoragePlace: values.saveStoragePlace,
    locationId: values.locationId,
    note: values.note,
  };
}

// ── Part form ───────────────────────────────────────────────────────────────

export function getDonorPartFormDefaults(
  part: DonorPart | undefined,
  defaultLocationId: number | null,
): Partial<DonorPartSchema> {
  if (!part) {
    return {
      category: EMPTY_REF,
      name: "",
      costPrice: "",
      storagePlace: EMPTY_REF,
      saveStoragePlace: false,
      locationId: defaultLocationId ?? undefined,
      note: "",
    };
  }
  return {
    category: toRef(part.category),
    name: part.name ?? "",
    costPrice: part.costPrice ?? "",
    storagePlace: toStoragePlaceRef(part),
    saveStoragePlace: false,
    locationId: part.location?.id ?? defaultLocationId ?? undefined,
    note: part.note ?? "",
  };
}

export function mapDonorPartFormToNewPart(
  values: DonorPartSchema,
): NewDonorPart {
  return {
    category: values.category,
    name: values.name,
    costPrice: values.costPrice,
    storagePlace: values.storagePlace,
    saveStoragePlace: values.saveStoragePlace,
    locationId: values.locationId,
    note: values.note,
  };
}

// ── Server errors ───────────────────────────────────────────────────────────

const SOURCE_ERROR_KEY =
  /(^|\.)(warehouse_item_id|donor_part_id|warehouse_donor_id|donor_parts(\.\d+\.\w+)?)$/;

/**
 * Validation messages about the warehouse source of a line (part already used,
 * both sources passed, single-piece quantity…), matched both as a plain key
 * and nested (`products.0.donor_part_id`). Null when there are none.
 */
export function getWarehouseSourceErrorMessage(
  errors: Record<string, string[]> | undefined,
): string | null {
  if (!errors) return null;
  const messages = Object.entries(errors)
    .filter(([key]) => SOURCE_ERROR_KEY.test(key))
    .flatMap(([, list]) => list);
  return messages.length ? messages.join(" ") : null;
}

// ── Categories ──────────────────────────────────────────────────────────────

/** Categories come unpaginated — present them to the table as a single page. */
export function toSinglePageResponse<T extends { id: number }>(
  items: T[],
): PaginatedResponse<T> {
  return {
    items,
    meta: { currentPage: 1, lastPage: 1, total: items.length },
  };
}

// ── Storage places dictionary ───────────────────────────────────────────────

/** Select value for "no office" — Radix Select can't hold an empty string. */
export const NO_LOCATION_VALUE = "none";

/**
 * The dictionary list: optionally one office (`?location_id=`), grouped by
 * office (places without one last), then by name.
 */
export function prepareStoragePlaceList(
  places: readonly StoragePlace[],
  locationFilter: string | undefined,
  search: string,
): StoragePlace[] {
  const locationId = locationFilter ? Number(locationFilter) : null;
  return filterByName(places, search)
    .filter((place) => locationId === null || place.locationId === locationId)
    .sort(
      (a, b) =>
        (a.locationId ?? Number.MAX_SAFE_INTEGER) -
          (b.locationId ?? Number.MAX_SAFE_INTEGER) ||
        a.name.localeCompare(b.name),
    );
}

/**
 * "Save to dictionary" makes sense only for typed text that the dictionary
 * doesn't have yet in that office: a picked place is linked by id, and an
 * existing name is linked by the backend on its own.
 */
export function canSaveStoragePlace(
  places: readonly StoragePlace[],
  ref: DictionaryRef,
  locationId: number | null,
): boolean {
  const needle = ref.name.trim().toLocaleLowerCase();
  if (ref.id !== null || !needle) return false;
  return !places.some(
    (place) =>
      place.locationId === locationId &&
      place.name.trim().toLocaleLowerCase() === needle,
  );
}

/** The dictionary form's flat string values → a storage place. */
export function mapStoragePlaceFormValues(
  values: Partial<Record<string, unknown>>,
): NewStoragePlace {
  const location = String(values.location_id ?? "");
  return {
    name: String(values.name ?? "").trim(),
    locationId:
      location && location !== NO_LOCATION_VALUE ? Number(location) : null,
  };
}

/** `?kind=` from the URL, falling back to showcase for a missing/unknown value. */
export function parseCategoryKind(
  value: string | undefined,
): WarehouseCategoryKind {
  return (
    Object.values(WAREHOUSE_CATEGORY_KINDS).find((kind) => kind === value) ??
    WAREHOUSE_CATEGORY_KINDS.SHOWCASE
  );
}
