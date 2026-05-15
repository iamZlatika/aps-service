import i18next from "i18next";

export function getErrorDescription(
  error: unknown,
  eventId?: string,
): string | undefined {
  if (import.meta.env.DEV) {
    if (error instanceof Error) return error.message;
    try {
      return typeof error === "string" ? error : JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  if (eventId) {
    return `${i18next.t("errors.error_id")}: ${eventId}`;
  }

  return undefined;
}
