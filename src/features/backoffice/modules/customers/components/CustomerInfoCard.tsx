import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Pencil, Plus, Unlock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CustomerTelegramSection } from "@/features/backoffice/modules/customers/components/CustomerTelegramSection.tsx";
import { IsPrimaryButton } from "@/features/backoffice/modules/customers/components/IsPrimaryButton.tsx";
import { Rating } from "@/features/backoffice/modules/customers/components/RatingStars.tsx";
import { useCustomerInfo } from "@/features/backoffice/modules/customers/hooks/useCustomerInfo.ts";
import { useCustomerPhones } from "@/features/backoffice/modules/customers/hooks/useCustomerPhones.ts";
import { useCustomerRating } from "@/features/backoffice/modules/customers/hooks/useCustomerRating.ts";
import { useCustomerStatus } from "@/features/backoffice/modules/customers/hooks/useCustomerStatus.ts";
import {
  addPhoneSchema,
  type EditCustomerInfoFormValues,
  editCustomerInfoSchema,
} from "@/features/backoffice/modules/customers/lib/schemas.ts";
import type { CustomerInfo } from "@/features/backoffice/modules/customers/types.ts";
import { PersonCard } from "@/features/backoffice/widgets/person-card/PersonCard.tsx";
import {
  DeleteConfirmDialog,
  ItemFormDialog,
} from "@/features/backoffice/widgets/table/components/dialogs";
import type { FieldConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { AcceptButton } from "@/shared/components/common/buttons/AcceptButton.tsx";
import { CancelButton } from "@/shared/components/common/buttons/CancelButton.tsx";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { CardTitle } from "@/shared/components/ui/card.tsx";
import { Separator } from "@/shared/components/ui/separator.tsx";
import { Textarea } from "@/shared/components/ui/textarea.tsx";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

interface CustomerInfoCardProps {
  customer: CustomerInfo;
}

export const CustomerInfoCard = ({ customer }: CustomerInfoCardProps) => {
  const { t } = useTranslation();
  const [isInfoEditing, setIsInfoEditing] = useState(false);

  const { handleChangeInfo } = useCustomerInfo(customer.id);
  const { handleRatingChange } = useCustomerRating(customer.id);
  const {
    isConfirmOpened,
    setIsConfirmOpened,
    handleConfirm,
    isStatusPending,
  } = useCustomerStatus(customer.id, customer);
  const {
    phones,
    phoneNumberToDelete,
    isAddOpened,
    setIsAddOpened,
    isDeleteOpened,
    setIsDeleteOpened,
    handleAddPhone,
    handleDeletePhone,
    openDeleteDialog,
    changeIsPrimaryMutation,
    isAddPending,
    isDeletePending,
  } = useCustomerPhones(customer.id, customer);

  const phoneFields: FieldConfig[] = [
    {
      key: "phone",
      label: t("customers.register_form.new_phone"),
      placeholder: t("customers.register_form.phone_placeholder"),
      required: true,
      type: "phone",
    },
  ];

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
      onClick={() => setIsInfoEditing(true)}
      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
    >
      <Pencil className="h-4 w-4" />
    </button>
  );

  const leftAction = (
    <button
      onClick={() => setIsConfirmOpened(true)}
      className={
        customer.status === "active"
          ? "p-2 text-green-600 hover:text-green-700 transition-colors"
          : "p-2 text-red-600 hover:text-red-700 transition-colors"
      }
    >
      {customer.status === "active" ? (
        <Unlock className="h-4 w-4" />
      ) : (
        <Lock className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <>
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
          leftAction={leftAction}
          rightAction={rightAction}
        >
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl font-bold">
              {t("customers.profile.phones")}
            </CardTitle>
            <Button onClick={() => setIsAddOpened(true)}>
              {t("customers.actions.add_phone")}
              <Plus />
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            {phones?.map((phone) => (
              <div key={phone.id} className="flex items-center gap-2">
                <IsPrimaryButton
                  isPrimary={phone.isPrimary}
                  onClick={() =>
                    changeIsPrimaryMutation.mutate({
                      customerId: customer.id,
                      phoneId: phone.id,
                    })
                  }
                />
                <span className="text-sm">{phone.phoneNumber}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDeleteDialog(phone.id)}
                  disabled={phone.isPrimary}
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>
          <Separator className="my-4 h-px bg-border" />
          <CustomerTelegramSection
            customerId={customer.id}
            telegram={customer.telegram}
          />
        </PersonCard>
      </form>

      <DeleteConfirmDialog
        isOpen={isDeleteOpened}
        onOpenChange={setIsDeleteOpened}
        title={t("customers.actions.delete_phone")}
        description={t("customers.actions.delete_confirm", {
          number: phoneNumberToDelete,
        })}
        cancelLabel={t("customers.actions.cancel")}
        confirmLabel={t("customers.actions.delete")}
        onConfirm={handleDeletePhone}
        isPending={isDeletePending}
      />
      <DeleteConfirmDialog
        isOpen={isConfirmOpened}
        onOpenChange={setIsConfirmOpened}
        title={
          customer.status === "active"
            ? t("customers.actions.block")
            : t("customers.actions.unblock")
        }
        description={
          customer.status === "active"
            ? t("customers.actions.block_confirm", { name: customer.name })
            : t("customers.actions.unblock_confirm", { name: customer.name })
        }
        cancelLabel={t("customers.actions.cancel")}
        confirmLabel={
          customer.status === "active"
            ? t("customers.actions.block")
            : t("customers.actions.unblock")
        }
        onConfirm={handleConfirm}
        isPending={isStatusPending}
      />
      <ItemFormDialog
        isOpen={isAddOpened}
        onOpenChange={setIsAddOpened}
        title={t("customers.register_form.add_phone")}
        fields={phoneFields}
        schema={addPhoneSchema}
        cancelLabel={t("customers.register_form.cancel")}
        confirmLabel={t("customers.register_form.submit")}
        onConfirm={handleAddPhone}
        isPending={isAddPending}
      />
    </>
  );
};
