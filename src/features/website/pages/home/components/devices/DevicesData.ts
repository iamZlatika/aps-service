export const DEVICES = [
  { id: "pc" },
  { id: "laptop" },
  { id: "monitor" },
  { id: "tv" },
  { id: "tablet" },
  { id: "phone" },
] as const;

export type DeviceId = (typeof DEVICES)[number]["id"];

export const DEVICE_IMAGES: Record<DeviceId, string> = {
  pc: "/computer.webp",
  laptop: "/notebook.webp",
  monitor: "/monitor.webp",
  tv: "/tvset.webp",
  tablet: "/tablet.webp",
  phone: "/phone.webp",
};
