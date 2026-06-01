import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";

import { useOrderStatus } from "@/features/website/hooks/useOrderStatus";
import { type OrderPreview } from "@/features/website/types";
import { isApiError } from "@/shared/lib/errors/services";
import { cn } from "@/shared/lib/utils";

import { trackOrderSchema, type TrackOrderValues } from "./trackOrder.schema";

interface TrackStatusModalFormProps {
  onSuccess: (data: OrderPreview) => void;
  onClose: () => void;
}

export const TrackStatusModalForm = ({
  onSuccess,
  onClose,
}: TrackStatusModalFormProps) => {
  const { t } = useTranslation("website");

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TrackOrderValues>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: { orderNumber: "" },
  });

  const {
    onSubmit,
    resetError,
    isPending,
    error: apiError,
  } = useOrderStatus({
    onSuccess: (data) => {
      reset();
      onSuccess(data);
    },
  });

  const orderNumber = watch("orderNumber");

  const errorMessage =
    errors.orderNumber?.message ??
    (isApiError(apiError) && apiError.status === 404
      ? t("trackModal.notFound")
      : apiError
        ? t("trackModal.error")
        : null);

  return (
    <form onSubmit={handleSubmit(({ orderNumber: num }) => onSubmit(num))}>
      <p className="ws-section-eyebrow !mb-[14px]">{t("trackModal.eyebrow")}</p>

      <p className="mb-6 text-[21px] font-medium leading-[1.3] tracking-[-0.005em] text-ws-ink">
        {t("trackModal.title")}
      </p>

      <label
        htmlFor="track-order-input"
        className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[.16em] text-ws-ink-mute"
      >
        {t("trackModal.label")}
      </label>

      <IMaskInput
        id="track-order-input"
        autoFocus
        mask="APS-0000-000000"
        lazy={false}
        value={orderNumber}
        onAccept={(value: string) => {
          setValue("orderNumber", value);
          if (apiError) resetError();
        }}
        placeholder="APS-2306-002755"
        aria-invalid={!!(errors.orderNumber || apiError)}
        aria-describedby={
          errorMessage ? "track-order-error" : "track-order-hint"
        }
        className={cn(
          "w-full rounded-[12px] border border-ws-line bg-[rgba(255,255,255,.025)] px-[18px] py-4 font-[inherit] text-[18px] font-semibold tracking-[.04em] text-ws-ink transition-[border-color,box-shadow] placeholder:font-normal placeholder:text-ws-ink-mute focus:border-ws-ember focus:outline-none",
          (errors.orderNumber || apiError) &&
            "border-ws-red shadow-[0_0_0_4px_rgba(216,85,62,.18)]",
        )}
      />

      {errorMessage ? (
        <p
          id="track-order-error"
          role="alert"
          className="mt-2 text-[12px] text-ws-red"
        >
          {errorMessage}
        </p>
      ) : (
        <p
          id="track-order-hint"
          className="mt-2 text-[12px] tracking-[.04em] text-ws-ink-mute"
        >
          {t("trackModal.hint")}
        </p>
      )}

      <div className="mt-6 flex gap-2.5 max-sm:flex-col">
        <button
          type="submit"
          disabled={isPending}
          className="ws-btn ws-btn-primary flex-1 justify-center"
        >
          {isPending ? t("trackModal.loading") : t("trackModal.submit")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ws-btn ws-btn-ghost flex-1 justify-center"
        >
          {t("trackModal.cancel")}
        </button>
      </div>
    </form>
  );
};
