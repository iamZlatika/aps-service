import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useCustomerOrders } from "@/features/backoffice/modules/customers/hooks/useCustomerOrders.ts";
import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";
import { StatusBadge } from "@/shared/components/common/StatusBadge.tsx";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination.tsx";
import { useLocalizedName } from "@/shared/hooks/useLocalizedName.ts";
import { getPageNumbers } from "@/shared/lib/pagination.ts";
import { cn, formatDate } from "@/shared/lib/utils.ts";

interface CustomerOrdersSectionProps {
  customerId: number;
  currentOrderId?: number;
  backSearch?: string;
}

export const CustomerOrdersSection = ({
  customerId,
  currentOrderId,
  backSearch,
}: CustomerOrdersSectionProps) => {
  const { t } = useTranslation();
  const { orders, isLoading, isError, page, lastPage, setPage } =
    useCustomerOrders(customerId);
  const getLocalizedName = useLocalizedName();

  return (
    <div className="mt-4">
      <h2 className="mb-3 text-lg font-semibold">
        {t("customers.orders.title")}
      </h2>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <p className="text-sm text-destructive">
          {t("customers.orders.error")}
        </p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t("customers.orders.empty")}
        </p>
      ) : (
        <>
          <div className="flex flex-col divide-y rounded-lg border">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={ORDERS_LINKS.detail(order.id)}
                state={backSearch ? { back: backSearch } : undefined}
                className={cn(
                  "flex items-center justify-between px-4 py-3 border-l-2",
                  order.id === currentOrderId
                    ? "bg-primary/10 border-primary cursor-default"
                    : "border-transparent hover:bg-accent",
                )}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {order.manufacturer} {order.deviceModel}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge
                    name={getLocalizedName(order.status)}
                    color={order.status.color}
                  />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {lastPage > 1 && (
            <Pagination className="mt-3 justify-start">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(page - 1)}
                    aria-disabled={page === 1}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {getPageNumbers(page, lastPage).map((p, i) => (
                  <PaginationItem key={i}>
                    {p === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={p === page}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(page + 1)}
                    aria-disabled={page === lastPage}
                    className={
                      page === lastPage ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};
