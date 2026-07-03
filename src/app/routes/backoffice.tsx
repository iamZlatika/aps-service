import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import { ProtectedRoute } from "@/app/ProtectedRoute";
import { BILLING_LINKS } from "@/features/backoffice/modules/billing/navigation.ts";
import { BILLING_ROUTES } from "@/features/backoffice/modules/billing/routes.ts";
import { CUSTOMERS_ROUTES } from "@/features/backoffice/modules/customers/routes";
import { DICTIONARIES_ROUTES } from "@/features/backoffice/modules/dictionaries/routes";
import { ORDERS_ROUTES } from "@/features/backoffice/modules/orders/routes";
import { PROFILE_ROUTES } from "@/features/backoffice/modules/profile/routes.ts";
import { ROLES_PERMISSIONS_ROUTES } from "@/features/backoffice/modules/roles-permissions/routes.ts";
import { SMS_INTEGRATION_ROUTES } from "@/features/backoffice/modules/sms-integration/routes.ts";
import { USERS_ROUTES } from "@/features/backoffice/modules/users/routes";
import { WORKS_ROUTES } from "@/features/backoffice/modules/works/routes";

const OrdersPage = lazy(
  () => import("@/features/backoffice/modules/orders/pages"),
);
const OrderPage = lazy(
  () =>
    import("@/features/backoffice/modules/orders/pages/order-page/OrderPage.tsx"),
);
const CreateOrderPage = lazy(
  () => import("@/features/backoffice/modules/orders/pages/create-order-page"),
);
const FiltersSettingsPage = lazy(
  () =>
    import("@/features/backoffice/modules/orders/pages/filters-settings-page"),
);
const CustomersPage = lazy(
  () => import("@/features/backoffice/modules/customers/pages"),
);
const CustomerPage = lazy(
  () => import("@/features/backoffice/modules/customers/pages/CustomerPage"),
);
const UsersPage = lazy(
  () => import("@/features/backoffice/modules/users/pages"),
);
const UserPage = lazy(
  () => import("@/features/backoffice/modules/users/pages/UserPage"),
);
const ProfilePage = lazy(
  () => import("@/features/backoffice/modules/profile/pages/profile"),
);
const ProfileFinancePage = lazy(
  () => import("@/features/backoffice/modules/profile/pages/finance"),
);
const RolesPermissionsPage = lazy(
  () => import("@/features/backoffice/modules/roles-permissions/pages"),
);
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
const ServicesPage = lazy(
  () => import("@/features/backoffice/modules/dictionaries/pages/Services"),
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
const LocationsPage = lazy(
  () => import("@/features/backoffice/modules/dictionaries/pages/Locations"),
);
const BankCardsPage = lazy(
  () => import("@/features/backoffice/modules/dictionaries/pages/BankCards"),
);
const PriceListPage = lazy(
  () => import("@/features/backoffice/modules/dictionaries/pages/price-list"),
);
const WorksPage = lazy(
  () => import("@/features/backoffice/modules/works/pages"),
);
const WorkCreatePage = lazy(
  () => import("@/features/backoffice/modules/works/pages/WorkCreatePage"),
);
const WorkEditPage = lazy(
  () => import("@/features/backoffice/modules/works/pages/WorkEditPage"),
);
const OutsourcersPage = lazy(
  () => import("@/features/backoffice/modules/dictionaries/pages/Outsourcers"),
);
const BalancesPage = lazy(
  () => import("@/features/backoffice/modules/billing/pages/balances"),
);
const AllTransactionsPage = lazy(
  () => import("@/features/backoffice/modules/billing/pages/all-transactions"),
);
const WithdrawalRequestsPage = lazy(
  () =>
    import("@/features/backoffice/modules/billing/pages/withdrawal-requests"),
);
const SmsIntegrationPage = lazy(
  () => import("@/features/backoffice/modules/sms-integration/pages"),
);

export const backofficeRoutes: RouteObject = {
  children: [
    { path: ORDERS_ROUTES.root, element: <OrdersPage /> },
    { path: ORDERS_ROUTES.createNewOrder, element: <CreateOrderPage /> },
    { path: ORDERS_ROUTES.order, element: <OrderPage /> },
    {
      path: ORDERS_ROUTES.orderFilterSettings,
      element: <FiltersSettingsPage />,
    },
    { path: CUSTOMERS_ROUTES.root, element: <CustomersPage /> },
    { path: CUSTOMERS_ROUTES.customer, element: <CustomerPage /> },
    { path: USERS_ROUTES.root, element: <UsersPage /> },
    { path: USERS_ROUTES.user, element: <UserPage /> },
    { path: PROFILE_ROUTES.root, element: <ProfilePage /> },
    { path: PROFILE_ROUTES.finance, element: <ProfileFinancePage /> },

    {
      element: (
        <ProtectedRoute requiredAbility="users_roles_permissions_manage" />
      ),
      children: [
        {
          path: ROLES_PERMISSIONS_ROUTES.root,
          element: <RolesPermissionsPage />,
        },
      ],
    },
    {
      element: <ProtectedRoute requiredAbility="billing_view" />,
      children: [
        {
          path: BILLING_ROUTES.root,
          element: <Navigate to={BILLING_LINKS.balances()} replace />,
        },
        { path: BILLING_ROUTES.balances, element: <BalancesPage /> },
        {
          path: BILLING_ROUTES.transactions,
          element: <AllTransactionsPage />,
        },
        {
          path: BILLING_ROUTES.withdrawalRequests,
          element: <WithdrawalRequestsPage />,
        },
      ],
    },
    {
      element: <ProtectedRoute requiredAbility="integrations_sms_view" />,
      children: [
        {
          path: SMS_INTEGRATION_ROUTES.root,
          element: <SmsIntegrationPage />,
        },
      ],
    },
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
      path: DICTIONARIES_ROUTES.services,
      element: <ServicesPage />,
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
      path: DICTIONARIES_ROUTES.outsourcers,
      element: <OutsourcersPage />,
    },
    {
      path: DICTIONARIES_ROUTES.products,
      element: <ProductsPage />,
    },
    {
      path: DICTIONARIES_ROUTES.locations,
      element: <LocationsPage />,
    },
    {
      path: DICTIONARIES_ROUTES.bankCards,
      element: <BankCardsPage />,
    },
    {
      path: DICTIONARIES_ROUTES.priceList,
      element: <PriceListPage />,
    },
    {
      path: WORKS_ROUTES.root,
      element: <WorksPage />,
    },
    {
      path: WORKS_ROUTES.create,
      element: <WorkCreatePage />,
    },
    {
      path: WORKS_ROUTES.edit,
      element: <WorkEditPage />,
    },
  ],
};
