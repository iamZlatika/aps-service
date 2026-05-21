export const DEVICES = [
  { id: "computers" },
  { id: "apple" },
  { id: "displays" },
  { id: "phones" },
  { id: "consoles" },
  { id: "chargers" },
  { id: "other" },
] as const;

export type DeviceId = (typeof DEVICES)[number]["id"];
