import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { IsPrimaryButton } from "@/features/backoffice/modules/customers/components/IsPrimaryButton.tsx";
import { Rating } from "@/features/backoffice/modules/customers/components/RatingStars.tsx";
import { useCustomer } from "@/features/backoffice/modules/customers/hooks/useCustomer.ts";
import { useCustomerPhones } from "@/features/backoffice/modules/customers/hooks/useCustomerPhones.ts";
import { useCustomerStatus } from "@/features/backoffice/modules/customers/hooks/useCustomerStatus.ts";
import { addPhoneSchema } from "@/features/backoffice/modules/customers/lib/schemas.ts";
import { DeleteConfirmDialog } from "@/features/backoffice/widgets/table/components/dialogs";
import { ItemFormDialog } from "@/features/backoffice/widgets/table/components/dialogs";
import type { FieldConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import Loader from "@/shared/components/common/Loader.tsx";
import { UserStatusButton } from "@/shared/components/common/UserStatusButton.tsx";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card.tsx";
import { Separator } from "@/shared/components/ui/separator.tsx";

const CustomerPage = () => {
  const { id } = useParams<{ id: string }>();
  const customerId = id ? parseInt(id, 10) : null;
  const { t } = useTranslation();

  const { selectedCustomer, isLoading } = useCustomer(customerId);
  const {
    isConfirmOpened,
    setIsConfirmOpened,
    handleConfirm,
    isStatusPending,
  } = useCustomerStatus(customerId, selectedCustomer);
  const {
    sortedPhones,
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
  } = useCustomerPhones(customerId, selectedCustomer);

  const registerFields: FieldConfig[] = [
    {
      key: "phone",
      label: t("customers.register_form.new_phone"),
      placeholder: t("customers.register_form.phone_placeholder"),
      required: true,
      type: "phone",
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  if (!selectedCustomer) {
    return null;
  }

  return (
    <>
      <div className="p-2 sm:p-6 max-w-3xl mx-auto w-full">
        <h1 className="mb-6 text-2xl font-bold">{t("profile.settings")}</h1>
        <Card className="p-2 sm:p-6">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Avatar style={{ width: 130, height: 130 }}>
                  <AvatarImage
                    src={selectedCustomer.avatarUrl || "/default.webp"}
                    alt={selectedCustomer.name}
                  />
                </Avatar>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <h3 className="text-3xl font-semibold">
                      {selectedCustomer.name}
                    </h3>
                    <UserStatusButton
                      status={selectedCustomer.status}
                      onClick={() => setIsConfirmOpened(true)}
                    />
                  </div>
                  <Rating value={selectedCustomer.rating} />
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"></div>

            <Separator className="my-6 h-px bg-border" />
            <div>
              <CardTitle className="text-2xl font-bold my-4">
                {t("customers.profile.phones")}
              </CardTitle>
              <Button onClick={() => setIsAddOpened(true)} className="mb-4">
                {t("customers.actions.add_phone")}
                <Plus />
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              {sortedPhones?.map((phone) => (
                <div key={phone.id} className="flex items-center gap-2">
                  <IsPrimaryButton
                    isPrimary={phone.isPrimary}
                    onClick={() =>
                      changeIsPrimaryMutation.mutate({
                        customerId: selectedCustomer.id,
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
          </CardContent>
        </Card>
      </div>
      <DeleteConfirmDialog
        isOpen={isDeleteOpened}
        onOpenChange={(open) => setIsDeleteOpened(open)}
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
        onOpenChange={(open) => setIsConfirmOpened(open)}
        title={
          selectedCustomer.status === "active"
            ? t("customers.actions.block")
            : t("customers.actions.unblock")
        }
        description={
          selectedCustomer.status === "active"
            ? t("customers.actions.block_confirm", {
                name: selectedCustomer.name,
              })
            : t("customers.actions.unblock_confirm", {
                name: selectedCustomer.name,
              })
        }
        cancelLabel={t("customers.actions.cancel")}
        confirmLabel={
          selectedCustomer.status === "active"
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
        fields={registerFields}
        schema={addPhoneSchema}
        cancelLabel={t("customers.register_form.cancel")}
        confirmLabel={t("customers.register_form.submit")}
        onConfirm={handleAddPhone}
        isPending={isAddPending}
      />
    </>
  );
};

export default CustomerPage;
