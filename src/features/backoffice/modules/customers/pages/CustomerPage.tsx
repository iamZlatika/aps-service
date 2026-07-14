import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { CustomerInfoCard } from "@/features/backoffice/modules/customers/components/CustomerInfoCard";
import { CustomerOrdersSection } from "@/features/backoffice/modules/customers/components/CustomerOrdersSection.tsx";
import { MergeCustomerDialog } from "@/features/backoffice/modules/customers/components/MergeCustomerDialog.tsx";
import { useCustomer } from "@/features/backoffice/modules/customers/hooks/useCustomer.ts";
import { useCustomerTelegramSocket } from "@/features/backoffice/modules/customers/hooks/useCustomerTelegramSocket.ts";
import { useCreateOrderForCustomer } from "@/features/backoffice/modules/orders/hooks/useCreateOrderForCustomer.ts";
import { CreateOrderForCustomerButton } from "@/shared/components/common/buttons/index.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";

const CustomerPage = () => {
  const { id } = useParams<{ id: string }>();
  const customerId = id ? parseInt(id, 10) : null;
  const { t } = useTranslation();
  const [isMergeOpen, setIsMergeOpen] = useState(false);

  const { selectedCustomer, isLoading } = useCustomer(customerId);
  useCustomerTelegramSocket(customerId);
  const { createOrderForCustomer } = useCreateOrderForCustomer();
  const { can } = useAuth();
  const canManageOrders = can("orders_manage");
  const canMerge = can("customers_merge");

  if (isLoading) return <Loader />;
  if (!selectedCustomer || !customerId) return null;

  return (
    <div className="p-2 sm:p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("customers.page_title")}</h1>
        <div className="flex items-center gap-2">
          {canManageOrders && (
            <CreateOrderForCustomerButton
              onClick={() => createOrderForCustomer(selectedCustomer)}
            />
          )}
          {canMerge && (
            <button
              type="button"
              className="h-9 w-9 sm:h-12 sm:w-12 flex items-center justify-center rounded-md border bg-card text-muted-foreground hover:text-foreground shadow-sm transition-colors"
              onClick={() => setIsMergeOpen(true)}
            >
              <RefreshCcw className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </div>
      </div>
      <CustomerInfoCard customer={selectedCustomer} />
      <CustomerOrdersSection customerId={customerId} />
      <MergeCustomerDialog
        isOpen={isMergeOpen}
        onOpenChange={setIsMergeOpen}
        initialSurvivor={{
          id: selectedCustomer.id,
          name: selectedCustomer.name,
        }}
      />
    </div>
  );
};

export default CustomerPage;
