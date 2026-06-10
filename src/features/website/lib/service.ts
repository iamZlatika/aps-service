import { type MessengerKey } from "@/features/website/config";
import { assertNever } from "@/shared/lib/assertNever";

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("380")) {
    return `+380 (${digits.slice(3, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
  }
  return raw;
}

export function parseScheduleLines(scheduleDisplay: string): string[] {
  return scheduleDisplay.split(", ").filter(Boolean);
}

export function getMapsUrl(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

export function getMapEmbedSrc(address: string): string {
  return `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&q=${encodeURIComponent(address)}&zoom=15`;
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

export function getGoogleReviewUrl(reviewId: string): string {
  const match = reviewId.match(/^places\/([^/]+)\//);
  if (!match) return "https://www.google.com/maps";
  return `https://search.google.com/local/writereview?placeid=${match[1]}`;
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
  const digits = phone.replace(/\D/g, "");
  if (key === "telegram") return `https://t.me/+${digits}`;
  if (key === "viber") return `viber://chat?number=%2B${digits}`;
  if (key === "whatsapp") return `https://wa.me/${digits}`;
  return assertNever(key);
}
