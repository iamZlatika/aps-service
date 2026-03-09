import i18next from "i18next";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { type ValidationError } from "@/shared/api/types.ts";
import { isApiError } from "@/shared/lib/errorHandlers/services.ts";

export function handleFormError<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
) {
  if (!isApiError<ValidationError>(error)) {
    setError("root" as Path<TFieldValues>, {
      type: "server",
      message: i18next.t("errors.unknown"),
    });
    return;
  }
  const { data, message } = error;
  if (data?.errors) {
    Object.entries(data.errors).forEach(([field, messages]) => {
      setError(field as Path<TFieldValues>, {
        type: "server",
        message: messages.join(", "),
      });
    });
    return;
  }
  setError("root" as Path<TFieldValues>, {
    type: "server",
    message: message || i18next.t("errors.server"),
  });
}
