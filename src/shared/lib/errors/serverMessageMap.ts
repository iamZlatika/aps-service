import i18next from "i18next";

export function getSharedServerMessageMap(): Record<string, string> {
  return {
    "The name has already been taken.": i18next.t("errors.name_taken"),
    "The verification code is incorrect or has expired.": i18next.t(
      "errors.code_invalid_or_expired",
    ),
    "Too Many Attempts.": i18next.t("errors.too_many_attempts"),
    "This phone number is already registered. Please log in instead.":
      i18next.t("errors.phone_already_registered"),
    "The phone must be a valid phone number in format +380XXXXXXXXX.":
      i18next.t("validation.phone_invalid"),
    "The phone must belong to a supported Ukrainian mobile operator.":
      i18next.t("validation.phone_operator_invalid"),
  };
}
