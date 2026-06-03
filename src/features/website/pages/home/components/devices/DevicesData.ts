export const DEVICES = [
  { id: "computers", categories: ["computers"] },
  { id: "apple", categories: ["imac", "ipad", "iphone", "macbook"] },
  { id: "displays", categories: ["tv-monitors"] },
  { id: "phones", categories: ["android", "ipad", "iphone"] },
  { id: "consoles", categories: ["gaming-consoles"] },
  { id: "chargers", categories: ["power-stations"] },
  { id: "other", categories: [] },
] as const;

export type DeviceId = (typeof DEVICES)[number]["id"];
