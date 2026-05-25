import { type MessengerKey } from "@/features/website/config";
import { assertNever } from "@/shared/lib/assertNever";

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("380")) {
    return `+380 (${digits.slice(3, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
  }
  return raw;
}

export function getMapsUrl(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

export function getMessengerHref(key: MessengerKey, phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (key === "telegram") return `https://t.me/+${digits}`;
  if (key === "viber") return `viber://chat?number=%2B${digits}`;
  if (key === "whatsapp") return `https://wa.me/${digits}`;
  return assertNever(key);
}
