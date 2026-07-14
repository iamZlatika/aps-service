import { type MessengerKey } from "@/features/website/config";
import { assertNever } from "@/shared/lib/assertNever";
import { stripNonDigits } from "@/shared/lib/utils";

export function formatPhone(raw: string): string {
  const digits = stripNonDigits(raw);
  if (digits.length === 12 && digits.startsWith("380")) {
    return `+380 (${digits.slice(3, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
  }
  return raw;
}

export function parseScheduleLines(scheduleDisplay: string): string[] {
  return scheduleDisplay.split(", ").filter(Boolean);
}

const TOVARYSKA_OFFICE_MAPS_URL =
  "https://www.google.com/maps/place/%D0%A1%D0%B5%D1%80%D0%B2%D0%B8%D1%81%D0%BD%D1%8B%D0%B9+%D0%A6%D0%B5%D0%BD%D1%82%D1%80+%22Aps%22/@47.8900086,35.0634377,17z/data=!4m6!3m5!1s0x45b6c0ba7c5de5b7:0xedc27dfe0990c397!8m2!3d47.890005!4d35.0660126!16s%2Fg%2F11zfs38wd2?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D";
const TOVARYSKA_OFFICE_COORDS = "47.890005,35.0660126";

function isTovaryskaOffice(address: string): boolean {
  const normalized = address.toLowerCase();
  return normalized.includes("товарищеск") || normalized.includes("товариськ");
}

export function getMapsUrl(address: string): string {
  if (isTovaryskaOffice(address)) return TOVARYSKA_OFFICE_MAPS_URL;
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

export function getMapEmbedSrc(address: string): string {
  const query = isTovaryskaOffice(address)
    ? TOVARYSKA_OFFICE_COORDS
    : encodeURIComponent(address);
  return `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&q=${query}&zoom=15`;
}

const AVATAR_COLORS = [
  "#ee7a3a",
  "#5db86f",
  "#3a8fd9",
  "#d8553e",
  "#7b5cd4",
  "#2db5a3",
  "#b94a14",
];

export function getAvatarColor(name: string): string {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

export type ReviewStats = {
  avg: number;
  dist: Array<{ star: number; pct: number }>;
};

export function computeReviewStats(ratings: number[]): ReviewStats {
  const total = ratings.length;
  if (total === 0)
    return { avg: 0, dist: [5, 4, 3, 2, 1].map((star) => ({ star, pct: 0 })) };
  const sum = ratings.reduce((s, r) => s + r, 0);
  const avg = sum / total;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    pct: Math.round((ratings.filter((r) => r === star).length / total) * 100),
  }));
  return { avg, dist };
}

export function getMessengerHref(key: MessengerKey, phone: string): string {
  const digits = stripNonDigits(phone);
  if (key === "telegram") return `https://telegram.me/+${digits}`;
  if (key === "viber") return `viber://chat?number=%2B${digits}`;
  if (key === "whatsapp") return `https://wa.me/${digits}`;
  return assertNever(key);
}
