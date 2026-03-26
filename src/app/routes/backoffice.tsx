import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

import { ProtectedRoute } from "@/app/ProtectedRoute";
import { CUSTOMERS_ROUTES } from "@/features/backoffice/modules/customers/routes";
import { DICTIONARIES_ROUTES } from "@/features/backoffice/modules/dictionaries/routes";
import { ORDERS_ROUTES } from "@/features/backoffice/modules/orders/routes";
import { USERS_ROUTES } from "@/features/backoffice/modules/users/routes";
import { ROLES } from "@/shared/types.ts";
import { PROFILE_ROUTES } from "@/features/backoffice/modules/profile/routes.ts";

const OrdersPage = lazy(() => import("@/features/backoffice/modules/orders"));
const CustomersPage = lazy(
  () => import("@/features/backoffice/modules/customers"),
);
const UsersPage = lazy(
  () => import("@/features/backoffice/modules/users/pages"),
);
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
    import("@/features/backoffice/modules/dictionaries/pages/RepairOperations.tsx"),
);

export const backofficeRoutes: RouteObject = {
  children: [
    { path: ORDERS_ROUTES.root, element: <OrdersPage /> },
    { path: CUSTOMERS_ROUTES.root, element: <CustomersPage /> },
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
      ],
    },
  ],
};
