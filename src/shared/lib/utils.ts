import { type ClassValue, clsx } from "clsx";
import { format, isValid, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatDate(value?: string | null): string | null {
  if (!value) return null;
  const date = parseISO(value);
  if (!isValid(date)) return null;
  return format(date, "dd.MM.yyyy");
}

export function formatDateTime(value?: string | null): string | null {
  if (!value) return null;
  const date = parseISO(value);
  if (!isValid(date)) return null;
  return format(date, "dd.MM.yyyy HH:mm");
}

export function formatMoney(value?: string | null): string {
  const num = Number.parseFloat(value ?? "0");
  const safe = Number.isFinite(num) ? num : 0;
  return `${new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe)} ₴`;
}
