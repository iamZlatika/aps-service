import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
      handleFormError(error, setError);
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
      <span className="text-xl text-muted-foreground">
        {customer.email ?? "—"}
      </span>
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
          <Avatar className="w-[130px] h-[130px]">
            <AvatarImage src={customer.avatarUrl} alt={customer.name} />
          </Avatar>
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
