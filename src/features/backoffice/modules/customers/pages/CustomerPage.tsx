import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { CustomerInfoCard } from "@/features/backoffice/modules/customers/components/CustomerInfoCard";
import { CustomerOrdersSection } from "@/features/backoffice/modules/customers/components/CustomerOrdersSection.tsx";
import { useCustomer } from "@/features/backoffice/modules/customers/hooks/useCustomer.ts";
import { useCreateOrderForCustomer } from "@/features/backoffice/modules/orders/hooks/useCreateOrderForCustomer.ts";
import { CreateOrderForCustomerButton } from "@/shared/components/common/buttons/index.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";

const CustomerPage = () => {
  const { id } = useParams<{ id: string }>();
  const customerId = id ? parseInt(id, 10) : null;
  const { t } = useTranslation();

  const { selectedCustomer, isLoading } = useCustomer(customerId);
  const { createOrderForCustomer } = useCreateOrderForCustomer();

  if (isLoading) return <Loader />;
  if (!selectedCustomer || !customerId) return null;

  return (
    <div className="p-2 sm:p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("customers.page_title")}</h1>
        <CreateOrderForCustomerButton
          onClick={() => createOrderForCustomer(selectedCustomer)}
        />
      </div>
      <CustomerInfoCard customer={selectedCustomer} />
      <CustomerOrdersSection customerId={customerId} />
    </div>
  );
};

export default CustomerPage;
