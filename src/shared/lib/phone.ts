export const MOBILE_OPERATOR_CODES = [
  "50",
  "66",
  "75",
  "95",
  "99", // Vodafone
  "39",
  "67",
  "68",
  "77",
  "96",
  "97",
  "98", // Київстар
  "63",
  "73",
  "93", // lifecell
] as const;

export function isSupportedMobileOperator(phone: string): boolean {
  const code = phone.slice(4, 6);
  return (MOBILE_OPERATOR_CODES as readonly string[]).includes(code);
}

export function extractLocalPhoneDigits(chars: string): string {
  if (chars.length <= 1) return chars;

  const digits = chars.replace(/\D/g, "");
  if (digits.startsWith("380")) return "0" + digits.slice(3);
  if (digits.startsWith("38")) return "0" + digits.slice(2);
  return digits;
}
