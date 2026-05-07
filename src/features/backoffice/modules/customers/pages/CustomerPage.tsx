import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { CustomerInfoCard } from "@/features/backoffice/modules/customers/components/CustomerInfoCard.tsx";
import { useCustomer } from "@/features/backoffice/modules/customers/hooks/useCustomer.ts";
import Loader from "@/shared/components/common/Loader.tsx";

const CustomerPage = () => {
  const { id } = useParams<{ id: string }>();
  const customerId = id ? parseInt(id, 10) : null;
  const { t } = useTranslation();

  const { selectedCustomer, isLoading } = useCustomer(customerId);

  if (isLoading) return <Loader />;
  if (!selectedCustomer) return null;

  return (
    <div className="p-2 sm:p-6 max-w-3xl mx-auto w-full">
      <h1 className="mb-6 text-2xl font-bold">{t("profile.settings")}</h1>
      <CustomerInfoCard customer={selectedCustomer} />
    </div>
  );
};

export default CustomerPage;
