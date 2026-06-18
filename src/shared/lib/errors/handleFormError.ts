import i18next from "i18next";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { type ValidationError } from "@/shared/api/types.ts";
import { isApiError } from "@/shared/lib/errors/services.ts";

type HandleFormErrorOptions<TFieldValues extends FieldValues> = {
  fieldMap?: Record<string, Path<TFieldValues>>;
  messageMap?: Record<string, string>;
};

function getBuiltInMessageMap(): Record<string, string> {
  return {
    "The name has already been taken.": i18next.t("errors.name_taken"),
    "The email has already been taken.": i18next.t("errors.email_taken"),
    "The verification code is incorrect or has expired.": i18next.t(
      "errors.code_invalid_or_expired",
    ),
    "Too Many Attempts.": i18next.t("errors.too_many_attempts"),
  };
}

export function handleFormError<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  options?: HandleFormErrorOptions<TFieldValues>,
) {
  if (!isApiError<ValidationError>(error)) {
    setError("root" as Path<TFieldValues>, {
      type: "server",
      message: i18next.t("errors.unknown"),
    });
    return;
  }

  const { data, message } = error;
  const builtInMessageMap = getBuiltInMessageMap();

  if (data?.errors) {
    Object.entries(data.errors).forEach(([field, messages]) => {
      const mappedField =
        options?.fieldMap?.[field] ?? (field as Path<TFieldValues>);
      const originalMessage = messages.join(", ");
      const mappedMessage =
        options?.messageMap?.[originalMessage] ??
        builtInMessageMap[originalMessage] ??
        originalMessage;

      setError(mappedField, {
        type: "server",
        message: mappedMessage,
      });
    });
    return;
  }

  const mappedMessage = message
    ? (options?.messageMap?.[message] ?? builtInMessageMap[message] ?? message)
    : i18next.t("errors.server");

  setError("root" as Path<TFieldValues>, {
    type: "server",
    message: mappedMessage,
  });
}
