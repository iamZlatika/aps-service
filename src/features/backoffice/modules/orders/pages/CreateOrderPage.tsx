import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { AdditionalInfoSection } from "@/features/backoffice/modules/orders/components/form-sections/AdditionalInfoSection.tsx";
import { CustomerSection } from "@/features/backoffice/modules/orders/components/form-sections/CustomerSection.tsx";
import { DeviceSection } from "@/features/backoffice/modules/orders/components/form-sections/DeviceSection.tsx";
import { LeaveConfirmDialog } from "@/features/backoffice/modules/orders/components/LeaveConfirmDialog.tsx";
import { useCreateOrder } from "@/features/backoffice/modules/orders/hooks/useCreateOrder.ts";
import { useLeaveGuard } from "@/features/backoffice/modules/orders/hooks/useLeaveGuard.ts";
import { useOrderFormDefaults } from "@/features/backoffice/modules/orders/hooks/useOrderFormDefaults.ts";
import {
  type NewOrderSchema,
  newOrderSchema,
} from "@/features/backoffice/modules/orders/lib/schema.ts";
import {
  fetchCustomersByName,
  fetchCustomersByPhone,
} from "@/features/backoffice/modules/orders/lib/searchFetchers.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent } from "@/shared/components/ui/card";

const CreateOrderPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const methods = useForm<NewOrderSchema>({
    resolver: zodResolver(newOrderSchema()),
    defaultValues: {
      customerName: "",
      customerPrimaryPhone: "",
      customerSecondaryPhone: "",
      issueType: "",
      deviceType: "",
      manufacturer: "",
      deviceModel: "",
      devicePassword: "",
      managerId: user?.id,
      dueDate: format(addDays(new Date(), 5), "yyyy-MM-dd"),
    },
  });

  const { blocker, bypass } = useLeaveGuard(methods.formState.isDirty);
  const { onSubmit, isPending } = useCreateOrder(methods.setError, bypass);
  const { users, isLoadingUsers, locations, isLoadingLocations } =
    useOrderFormDefaults(methods.setValue, methods.getValues, user);

  return (
    <>
      <LeaveConfirmDialog blocker={blocker} />
      <div className="p-2 sm:p-6 max-w-3xl lg:max-w-7xl mx-auto w-full">
        <h1 className="mb-6 text-2xl font-bold">{t("orders.createNew")}</h1>
        <Card className="p-2 sm:p-6">
          <CardContent>
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <CustomerSection
                  fetchCustomersByName={fetchCustomersByName}
                  fetchCustomersByPhone={fetchCustomersByPhone}
                />
                <DeviceSection />
                <AdditionalInfoSection
                  users={users}
                  isLoadingUsers={isLoadingUsers}
                  locations={locations}
                  isLoadingLocations={isLoadingLocations}
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="lg:col-span-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  {t("orders.actions.create")}
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateOrderPage;
