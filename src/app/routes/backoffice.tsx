import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

import { ProtectedRoute } from "@/app/ProtectedRoute";
import { CUSTOMERS_ROUTES } from "@/features/backoffice/modules/customers/routes";
import { DICTIONARIES_ROUTES } from "@/features/backoffice/modules/dictionaries/routes";
import { ORDERS_ROUTES } from "@/features/backoffice/modules/orders/routes";
import { PROFILE_ROUTES } from "@/features/backoffice/modules/profile/routes.ts";
import { USERS_ROUTES } from "@/features/backoffice/modules/users/routes";
import { ROLES } from "@/shared/types.ts";

const OrdersPage = lazy(
  () => import("@/features/backoffice/modules/orders/pages"),
);
const CreateOrderPage = lazy(
  () => import("@/features/backoffice/modules/orders/pages/CreateOrderPage"),
);
const CustomersPage = lazy(
  () => import("@/features/backoffice/modules/customers/pages"),
);
const CustomerPage = lazy(
  () => import("@/features/backoffice/modules/customers/pages/CustomerPage"),
);
const UsersPage = lazy(() => import("@/features/backoffice/modules/users"));
const ProfilePage = lazy(() => import("@/features/backoffice/modules/profile"));
const DictionariesPage = lazy(
  () => import("@/features/backoffice/modules/dictionaries"),
);
const AccessoriesPage = lazy(
  () => import("@/features/backoffice/modules/dictionaries/pages/Accessories"),
);
const DeviceConditionsPage = lazy(
  () =>
    import("@/features/backoffice/modules/dictionaries/pages/DeviceConditions"),
);
const IssueTypesPage = lazy(
  () => import("@/features/backoffice/modules/dictionaries/pages/IssueTypes"),
);
const DeviceModelsPage = lazy(
  () => import("@/features/backoffice/modules/dictionaries/pages/DeviceModels"),
);
const DeviceTypesPage = lazy(
  () => import("@/features/backoffice/modules/dictionaries/pages/DeviceTypes"),
);
const IntakeNotesPage = lazy(
  () => import("@/features/backoffice/modules/dictionaries/pages/IntakeNotes"),
);
const ManufacturersPage = lazy(
  () =>
    import("@/features/backoffice/modules/dictionaries/pages/Manufacturers"),
);
const RepairOperationsPage = lazy(
  () =>
    import("@/features/backoffice/modules/dictionaries/pages/RepairOperations"),
);
const OrderStatusesPage = lazy(
  () =>
    import("@/features/backoffice/modules/dictionaries/pages/OrderStatuses"),
);
const SuppliersPage = lazy(
  () => import("@/features/backoffice/modules/dictionaries/pages/Suppliers"),
);
const ProductsPage = lazy(
  () => import("@/features/backoffice/modules/dictionaries/pages/Products"),
);

export const backofficeRoutes: RouteObject = {
  children: [
    { path: ORDERS_ROUTES.root, element: <OrdersPage /> },
    { path: ORDERS_ROUTES.createNewOrder, element: <CreateOrderPage /> },
    { path: CUSTOMERS_ROUTES.root, element: <CustomersPage /> },
    { path: CUSTOMERS_ROUTES.customer, element: <CustomerPage /> },
    { path: USERS_ROUTES.root, element: <UsersPage /> },
    { path: PROFILE_ROUTES.root, element: <ProfilePage /> },

    // super admin panel
    {
      element: <ProtectedRoute allowedRoles={[ROLES.HEAD_MANAGER]} />,
      children: [
        {
          path: DICTIONARIES_ROUTES.root,
          element: <DictionariesPage />,
        },
        {
          path: DICTIONARIES_ROUTES.accessories,
          element: <AccessoriesPage />,
        },
        {
          path: DICTIONARIES_ROUTES.deviceConditions,
          element: <DeviceConditionsPage />,
        },
        {
          path: DICTIONARIES_ROUTES.issueTypes,
          element: <IssueTypesPage />,
        },
        {
          path: DICTIONARIES_ROUTES.deviceModels,
          element: <DeviceModelsPage />,
        },
        {
          path: DICTIONARIES_ROUTES.deviceTypes,
          element: <DeviceTypesPage />,
        },
        {
          path: DICTIONARIES_ROUTES.intakeNotes,
          element: <IntakeNotesPage />,
        },
        {
          path: DICTIONARIES_ROUTES.manufacturers,
          element: <ManufacturersPage />,
        },
        {
          path: DICTIONARIES_ROUTES.repairOperations,
          element: <RepairOperationsPage />,
        },
        {
          path: DICTIONARIES_ROUTES.orderStatuses,
          element: <OrderStatusesPage />,
        },
        {
          path: DICTIONARIES_ROUTES.suppliers,
          element: <SuppliersPage />,
        },
        {
          path: DICTIONARIES_ROUTES.products,
          element: <ProductsPage />,
        },
      ],
    },
  ],
};
