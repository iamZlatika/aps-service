import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import HistorySidebar from "@/features/backoffice/modules/orders/components/HistorySidebar.tsx";
import { useOrder } from "@/features/backoffice/modules/orders/hooks/useOrder.ts";
import Loader from "@/shared/components/common/Loader.tsx";
import { Card, CardContent } from "@/shared/components/ui/card";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : null;
  const { t } = useTranslation();
  const { selectedOrder, isLoading } = useOrder(orderId);

  if (isLoading) {
    return <Loader />;
  }

  if (!selectedOrder) {
    return null;
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-2 sm:p-6">
        <h1 className="mb-6 text-2xl font-bold">
          {t("orders.order")} {selectedOrder.orderNumber}
        </h1>
        <Card className="p-2 sm:p-6">
          <CardContent></CardContent>
        </Card>
      </div>
      <HistorySidebar />
    </div>
  );
};

export default OrderPage;
