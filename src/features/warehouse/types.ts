import type { Location } from "@/entities/location/types.ts";
import type { Supplier } from "@/features/dictionaries/types.ts";
import type { User } from "@/features/users/types.ts";

// ── Fixed value sets ────────────────────────────────────────────────────────

export const WAREHOUSE_ITEM_KINDS = {
  SHOWCASE: "showcase",
  SUPPLY: "supply",
} as const;
export type WarehouseItemKind =
  (typeof WAREHOUSE_ITEM_KINDS)[keyof typeof WAREHOUSE_ITEM_KINDS];

export const WAREHOUSE_CATEGORY_KINDS = {
  ...WAREHOUSE_ITEM_KINDS,
  PART: "part",
} as const;
export type WarehouseCategoryKind =
  (typeof WAREHOUSE_CATEGORY_KINDS)[keyof typeof WAREHOUSE_CATEGORY_KINDS];

export const WAREHOUSE_UNITS = {
  PIECE: "piece",
  ML: "ml",
  G: "g",
  PACK: "pack",
} as const;
export type WarehouseUnit =
  (typeof WAREHOUSE_UNITS)[keyof typeof WAREHOUSE_UNITS];

export const STOCK_MOVEMENT_REASONS = {
  PURCHASE: "purchase",
  SALE: "sale",
  ORDER: "order",
  WRITEOFF: "writeoff",
  CORRECTION: "correction",
  RETURN: "return",
  DONOR_INVESTMENT: "donor_investment",
} as const;
export type StockMovementReason =
  (typeof STOCK_MOVEMENT_REASONS)[keyof typeof STOCK_MOVEMENT_REASONS];

/** Reasons a user can pick by hand on the item card (the rest are system-made). */
export const MANUAL_STOCK_REASONS = {
  PURCHASE: STOCK_MOVEMENT_REASONS.PURCHASE,
  WRITEOFF: STOCK_MOVEMENT_REASONS.WRITEOFF,
  CORRECTION: STOCK_MOVEMENT_REASONS.CORRECTION,
} as const;
export type ManualStockReason =
  (typeof MANUAL_STOCK_REASONS)[keyof typeof MANUAL_STOCK_REASONS];

export const DONOR_STATUSES = {
  IN_STOCK: "in_stock",
  SOLD: "sold",
} as const;
export type DonorStatus = (typeof DONOR_STATUSES)[keyof typeof DONOR_STATUSES];

/** `?status=` of the donors list; without it the backend lists in-stock only. */
export const DONOR_STATUS_FILTERS = {
  ...DONOR_STATUSES,
  ALL: "all",
} as const;
export type DonorStatusFilter =
  (typeof DONOR_STATUS_FILTERS)[keyof typeof DONOR_STATUS_FILTERS];

export const WAREHOUSE_SOURCES = {
  SHOWCASE: "showcase",
  SUPPLY: "supply",
  DONOR_PART: "donor_part",
} as const;
export type WarehouseSource =
  (typeof WAREHOUSE_SOURCES)[keyof typeof WAREHOUSE_SOURCES];

export const WAREHOUSE_SEARCH_CONTEXTS = {
  ORDER: "order",
  QUICK_ORDER: "quick_order",
} as const;
export type WarehouseSearchContext =
  (typeof WAREHOUSE_SEARCH_CONTEXTS)[keyof typeof WAREHOUSE_SEARCH_CONTEXTS];

// ── Dictionaries ────────────────────────────────────────────────────────────

export type WarehouseCategory = {
  id: number;
  name: string;
  kind: WarehouseCategoryKind;
};

export type StoragePlace = {
  id: number;
  name: string;
  locationId: number | null;
};

export type NewStoragePlace = Omit<StoragePlace, "id">;

// ── Items (showcase / supplies) ─────────────────────────────────────────────

/** One row per office — offices where the item was never stocked come as 0. */
export type WarehouseStock = {
  locationId: number;
  location: Location;
  quantity: number;
};

export type StockMovement = {
  id: number;
  location: Location | null;
  delta: number;
  reason: StockMovementReason;
  orderId: number | null;
  quickOrderId: number | null;
  orderProductId: number | null;
  user: User | null;
  /** The item's purchase price at the moment of the movement. */
  purchasePrice: string | null;
  note: string | null;
  createdAt: string;
};

export type WarehouseItem = {
  id: number;
  kind: WarehouseItemKind;
  category: WarehouseCategory;
  name: string;
  price: string | null;
  purchasePrice: string | null;
  supplier: Supplier | null;
  orderUrl: string | null;
  unit: WarehouseUnit;
  photoUrl: string | null;
  stocks: WarehouseStock[];
  totalQuantity: number;
};

export type WarehouseItemDetail = WarehouseItem & {
  movements: StockMovement[];
  createdAt: string;
  updatedAt: string;
};

/** "Pick existing by id, or type a new name" — used by the on-the-fly dictionaries. */
export type DictionaryRef = {
  id: number | null;
  name: string;
};

export type NewWarehouseItem = {
  kind: WarehouseItemKind;
  category: DictionaryRef;
  name: string;
  price: string;
  purchasePrice: string;
  supplierName: string;
  orderUrl: string;
  unit: WarehouseUnit;
};

export type NewStockMovement = {
  locationId: number;
  quantity: number;
  reason: ManualStockReason;
  note: string;
  /** Overwrites the item's purchase price everywhere; null leaves it as is. */
  purchasePrice: string | null;
};

// ── Donors & parts ──────────────────────────────────────────────────────────

/**
 * "Where it lies": a dictionary place, or free text kept on the card only —
 * exactly one of the two is set.
 */
export type StoragePlaceFields = {
  storagePlace: StoragePlace | null;
  storagePlaceNote: string | null;
};

/** Form side: a typed place goes to the dictionary only on explicit request. */
export type StoragePlaceInput = {
  storagePlace: DictionaryRef;
  saveStoragePlace: boolean;
};

export type DonorShort = {
  id: number;
  manufacturer: string | null;
  deviceType: string | null;
  deviceModel: string | null;
};

/** Where and when a donor / part left the workshop (all null while in stock). */
export type SaleInfo = {
  soldInOrderId: number | null;
  soldInQuickOrderId: number | null;
  soldAt: string | null;
  /**
   * Price of the selling order / quick-sale line. For a donor it is not
   * `economics.revenue` — that also counts parts sold separately earlier.
   */
  soldPrice: string | null;
};

/**
 * A sold donor stays (status `sold`) and its card keeps the history; DELETE
 * means only "this record was a mistake" and is refused for a sold donor.
 */
export type Donor = DonorShort &
  StoragePlaceFields &
  SaleInfo & {
    status: DonorStatus;
    /** Set by the system when the donor was born from an order (read-only). */
    sourceOrderId: number | null;
    /** Free text: where the donor came from ("bought dead on OLX", …). */
    origin: string | null;
    supplier: Supplier | null;
    location: Location | null;
    acquisitionCost: string | null;
    note: string | null;
    /** On-the-shelf parts only. */
    partsCount: number;
  };

/**
 * Lists and the picker show only parts on the shelf; the donor card shows the
 * sold ones too (history). A sold part comes back when its line is removed.
 */
export type DonorPart = StoragePlaceFields &
  SaleInfo & {
    id: number;
    donor: DonorShort | null;
    category: WarehouseCategory;
    name: string | null;
    /** What the part costs us ("market average + delivery"). */
    costPrice: string | null;
    isSold: boolean;
    /** Left inside a whole sold donor — then there is no price of its own. */
    soldWithDonor: boolean;
    location: Location | null;
    note: string | null;
    photoUrl: string | null;
  };

/** Money spent on a donor after buying it: a warehouse item or a free line. */
export type DonorInvestment = {
  id: number;
  /** Set for a line taken from the warehouse (its stock was written off). */
  warehouseItemId: number | null;
  name: string;
  quantity: number;
  amount: string;
  note: string | null;
  createdAt: string;
};

export type DonorEconomics = {
  acquisitionCost: string;
  investmentsTotal: string;
  /** acquisition + investments. */
  totalCost: string;
  /** Σ cost prices of sold parts — cost against cost, NOT a profit. */
  partsCostRecovered: string;
  /** The donor itself + parts sold separately. */
  revenue: string;
  /** revenue − total cost. */
  profit: string;
};

export type DonorDetail = Donor & {
  /** Sold parts included — the card shows the history. */
  parts: DonorPart[];
  investments: DonorInvestment[];
  economics: DonorEconomics;
  createdAt: string;
  updatedAt: string;
};

export type NewDonor = StoragePlaceInput & {
  manufacturer: string;
  deviceType: string;
  deviceModel: string;
  origin: string;
  supplierId: number | null;
  acquisitionCost: string;
  locationId: number;
  note: string;
};

/** Which donor a part belongs to is decided by the endpoint, not the body. */
export type NewDonorPart = StoragePlaceInput & {
  category: DictionaryRef;
  name: string;
  costPrice: string;
  locationId: number;
  note: string;
};

export type NewDonorInvestment =
  | {
      warehouseItemId: number;
      quantity: number;
      /** Empty → purchase price × quantity, computed by the backend. */
      amount: string;
      note: string;
    }
  | { warehouseItemId: null; name: string; amount: string; note: string };

/**
 * Parts picked when selling a donor: the line's purchase becomes the sum of
 * their cost prices, and only they leave with it (the rest stay on the shelf).
 * A sent cost price is saved on the part card.
 */
export type DonorSalePart = {
  id: number;
  costPrice: string | null;
};

// ── Unified "+ product" search ──────────────────────────────────────────────

export type WarehouseSearchResult = StoragePlaceFields & {
  source: WarehouseSource;
  id: number;
  name: string;
  category: WarehouseCategory;
  price: string | null;
  purchasePrice: string | null;
  quantity: number | null;
  location: Location | null;
  /** Only for `donor_part` — which donor the part was taken from. */
  donor: DonorShort | null;
};

export type WarehouseSearchParams = {
  q: string;
  locationId: number | null;
  context: WarehouseSearchContext;
  /** Empty = all sources (the parameter is not sent). */
  sources: WarehouseSource[];
};

/** Which warehouse record a sold order/quick-order line points to. */
export type WarehouseLineSource =
  | { warehouseItemId: number; donorPartId: null }
  | { warehouseItemId: null; donorPartId: number };
