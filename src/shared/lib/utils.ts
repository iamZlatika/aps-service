import { type ClassValue, clsx } from "clsx";
import { format, isValid, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | null): string | null {
  if (!value) return null;
  const date = parseISO(value);
  if (!isValid(date)) return null;
  return format(date, "dd.MM.yyyy");
}
