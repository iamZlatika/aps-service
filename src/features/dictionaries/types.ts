import { type WeekDay } from "@/shared/types";
import { type BaseItem } from "@/widgets/table/models/types.ts";

export type { Location } from "@/entities/location/types";

export type DictionaryItem = {
  id: number;
  name: string;
};

export type Supplier = {
  id: number;
  name: string;
  managerName: string | null;
  phone: string | null;
  website: string | null;
};

export type Outsourcer = Supplier;

export type BankCard = {
  id: number;
  ownerName: string;
  number: string;
  prettyNumber: string;
  isActive: boolean;
};

export type PaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number | null;
  to: number | null;
};

export type PaginatedDictionaryItems<T extends BaseItem = DictionaryItem> = {
  items: T[];
  meta: PaginationMeta;
};

export type {
  PriceListCategory,
  PriceListItem,
} from "@/entities/price-list/types";
export type { StatusColor } from "@/shared/types.ts";

export type ScheduleGroup = {
  fromDay: WeekDay;
  toDay: WeekDay;
  from: string;
  to: string;
};
