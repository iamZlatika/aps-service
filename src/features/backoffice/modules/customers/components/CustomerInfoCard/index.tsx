import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CustomerSmsSection } from "@/features/backoffice/modules/customers/components/CustomerSmsSection.tsx";
import { CustomerTelegramSection } from "@/features/backoffice/modules/customers/components/CustomerTelegramSection.tsx";
import { Rating } from "@/features/backoffice/modules/customers/components/RatingStars.tsx";
import { useCustomerInfo } from "@/features/backoffice/modules/customers/hooks/useCustomerInfo.ts";
import { useCustomerRating } from "@/features/backoffice/modules/customers/hooks/useCustomerRating.ts";
import {
  type EditCustomerInfoFormValues,
  editCustomerInfoSchema,
} from "@/features/backoffice/modules/customers/lib/schemas.ts";
import type { CustomerInfo } from "@/features/backoffice/modules/customers/types.ts";
import { PersonCard } from "@/features/backoffice/widgets/person-card/PersonCard.tsx";
import { AcceptButton } from "@/shared/components/common/buttons/AcceptButton.tsx";
import { CancelButton } from "@/shared/components/common/buttons/CancelButton.tsx";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar.tsx";
import { Separator } from "@/shared/components/ui/separator.tsx";
import { Textarea } from "@/shared/components/ui/textarea.tsx";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { isApiError } from "@/shared/lib/errors/services.ts";

import { CustomerPhonesSection } from "./CustomerPhonesSection";
import { CustomerStatusToggle } from "./CustomerStatusToggle";

interface CustomerInfoCardProps {
  customer: CustomerInfo;
  showStatusToggle?: boolean;
  onSuccess?: () => void;
}

export const CustomerInfoCard = ({
  customer,
  showStatusToggle = true,
  onSuccess,
}: CustomerInfoCardProps) => {
  const { t } = useTranslation();
  const [isInfoEditing, setIsInfoEditing] = useState(false);

  const { handleChangeInfo } = useCustomerInfo(customer.id, onSuccess);
  const { handleRatingChange } = useCustomerRating(customer.id, onSuccess);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EditCustomerInfoFormValues>({
    resolver: zodResolver(editCustomerInfoSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email ?? "",
      comment: customer.comment ?? "",
    },
  });

  useEffect(() => {
    if (isInfoEditing) {
      reset({
        name: customer.name,
        email: customer.email ?? "",
        comment: customer.comment ?? "",
      });
    }
  }, [isInfoEditing, customer.name, customer.email, customer.comment, reset]);

  const onSubmit = async (data: EditCustomerInfoFormValues) => {
    try {
      await handleChangeInfo({
        name: data.name,
        email: data.email || null,
        comment: data.comment || null,
      });
      setIsInfoEditing(false);
    } catch (error) {
      if (isApiError(error) && error.status === 422) {
        handleFormError(error, setError);
      }
    }
  };

  const infoSlot = isInfoEditing ? (
    <div className="flex flex-col gap-2">
      <FormField
        {...register("name")}
        placeholder={t("customers.profile.name_placeholder")}
        className="text-2xl font-semibold h-auto py-1"
        error={errors.name}
      />
      <FormField
        {...register("email")}
        placeholder={t("customers.profile.email_placeholder")}
        className="text-xl text-muted-foreground h-auto py-1"
        error={errors.email}
      />
    </div>
  ) : (
    <div className="flex flex-col gap-1">
      <span className="text-2xl font-semibold">{customer.name}</span>
      <div className="flex flex-col gap-1">
        <span className="text-xl text-muted-foreground">
          {customer.email ?? "—"}
        </span>
        {customer.emailVerifiedAt && (
          <div className="flex items-center gap-1 text-green-600">
            <CircleCheck className="h-4 w-4 shrink-0" />
            <span className="text-xs font-medium">
              {t("customers.profile.email_verified")}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const commentSlot = isInfoEditing ? (
    <div className="flex flex-col gap-1">
      <Textarea
        {...register("comment")}
        placeholder={t("customers.profile.comment_placeholder")}
        className="resize-none"
        rows={3}
      />
      {errors.comment && (
        <p className="text-sm text-destructive">{errors.comment.message}</p>
      )}
    </div>
  ) : customer.comment ? (
    <p>{customer.comment}</p>
  ) : null;

  const rightAction = isInfoEditing ? (
    <>
      <AcceptButton type="submit" />
      <CancelButton onClick={() => setIsInfoEditing(false)} />
    </>
  ) : (
    <button
      type="button"
      onClick={() => setIsInfoEditing(true)}
      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
    >
      <Pencil className="h-4 w-4" />
    </button>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PersonCard
        avatarSlot={
          <div className="flex flex-col gap-2">
            <Avatar className="w-[130px] h-[130px]">
              <AvatarImage src={customer.avatarUrl} alt={customer.name} />
            </Avatar>
            {customer.portalName && (
              <span className="text-xs text-muted-foreground text-center break-words w-[130px]">
                {customer.portalName}
              </span>
            )}
            {customer.hasGoogle && (
              <>
                <Separator className="h-px bg-border" />
                <div className="flex items-center gap-1.5 text-green-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.5 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
                    />
                  </svg>
                  <CircleCheck className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-medium">
                    {t("customers.profile.has_google")}
                  </span>
                </div>
              </>
            )}
          </div>
        }
        infoSlot={infoSlot}
        metaSlot={
          <Rating value={customer.rating} onChange={handleRatingChange} />
        }
        commentSlot={commentSlot}
        leftAction={
          showStatusToggle ? (
            <CustomerStatusToggle customer={customer} />
          ) : undefined
        }
        rightAction={rightAction}
      >
        <CustomerSmsSection customer={customer} />
        <Separator className="my-2 h-px bg-border" />
        <CustomerPhonesSection
          customerId={customer.id}
          customer={customer}
          onSuccess={onSuccess}
        />
        <Separator className="my-2 h-px bg-border" />
        <CustomerTelegramSection
          customerId={customer.id}
          telegram={customer.telegram}
          onSuccess={onSuccess}
        />
      </PersonCard>
    </form>
  );
};
