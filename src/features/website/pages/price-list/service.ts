import {
  type PriceListCategory,
  type PriceListItem,
} from "@/entities/price-list/types";
import { type DeviceId } from "@/features/website/pages/home/components/devices/DevicesData";

export type PriceGroup = {
  category: PriceListCategory;
  items: PriceListItem[];
};

const CATEGORY_KEY_TO_DEVICE_ID: Record<string, DeviceId> = {
  computers: "computers",
  android: "phones",
  iphone: "apple",
  ipad: "apple",
  macbook: "apple",
  imac: "apple",
  "tv-monitors": "displays",
  "gaming-consoles": "consoles",
  "power-stations": "chargers",
};

export function getDeviceIdForCategory(categoryKey: string): DeviceId {
  return CATEGORY_KEY_TO_DEVICE_ID[categoryKey] ?? "other";
}

export function groupPriceListByCategory(items: PriceListItem[]): PriceGroup[] {
  const map = new Map<string, PriceGroup>();
  for (const item of items) {
    const key = item.category.key;
    let group = map.get(key);
    if (!group) {
      group = { category: item.category, items: [] };
      map.set(key, group);
    }
    group.items.push(item);
  }
  return Array.from(map.values());
}
