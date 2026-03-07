import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

import { ProtectedRoute } from "@/app/ProtectedRoute";
import { CustomersRoutes } from "@/features/backoffice/modules/customers/routers.ts";
import { DictionariesRoutes } from "@/features/backoffice/modules/dictionaries/routers.ts";
import { OrdersRoutes } from "@/features/backoffice/modules/orders/routers.ts";
import { UsersRoutes } from "@/features/backoffice/modules/users/api/routers.ts";
import { ROLES } from "@/types/types";

const OrdersPage = lazy(() => import("@/features/backoffice/modules/orders"));
const CustomersPage = lazy(
  () => import("@/features/backoffice/modules/customers"),
);
const UsersPage = lazy(
  () => import("@/features/backoffice/modules/users/pages"),
);
const ServicesPage = lazy(
  () => import("@/features/backoffice/modules/dictionaries"),
);

export const backofficeRoutes: RouteObject = {
  children: [
    { path: OrdersRoutes.ordersList(), element: <OrdersPage /> },
    { path: CustomersRoutes.customersList(), element: <CustomersPage /> },
    { path: UsersRoutes.usersList(), element: <UsersPage /> },

    // super admin panel
    {
      element: <ProtectedRoute allowedRoles={[ROLES.HEAD_MANAGER]} />,
      children: [
        {
          path: DictionariesRoutes.dictionariesList(),
          element: <ServicesPage />,
        },
      ],
    },
  ],
};
