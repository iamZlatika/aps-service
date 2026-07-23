import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import { ProtectedRoute } from "@/app/ProtectedRoute";
import { ABILITIES } from "@/features/auth/abilities.ts";
import { BILLING_LINKS } from "@/features/billing/navigation.ts";
import { BILLING_ROUTES } from "@/features/billing/routes.ts";
import { CUSTOMERS_ROUTES } from "@/features/customers/routes";
import { DICTIONARIES_ROUTES } from "@/features/dictionaries/routes";
import { ORDERS_ROUTES } from "@/features/orders/routes";
import { PROFILE_ROUTES } from "@/features/profile/routes.ts";
import { QUICK_ORDERS_ROUTES } from "@/features/quick-orders/routes.ts";
import { REFERRALS_ROUTES } from "@/features/referrals/routes.ts";
import { ROLES_PERMISSIONS_ROUTES } from "@/features/roles-permissions/routes.ts";
import { SMS_INTEGRATION_ROUTES } from "@/features/sms-integration/routes.ts";
import { STATISTICS_ROUTES } from "@/features/statistics/routes.ts";
import { USERS_ROUTES } from "@/features/users/routes";
import { WORKS_ROUTES } from "@/features/works/routes";

const OrdersPage = lazy(() => import("@/features/orders/pages"));
const OrderPage = lazy(
  () => import("@/features/orders/pages/order-page/OrderPage.tsx"),
);
const CreateOrderPage = lazy(
  () => import("@/features/orders/pages/create-order-page"),
);
const FiltersSettingsPage = lazy(
  () => import("@/features/orders/pages/filters-settings-page"),
);
const CustomersPage = lazy(() => import("@/features/customers/pages"));
const CustomerPage = lazy(
  () => import("@/features/customers/pages/CustomerPage"),
);
const UsersPage = lazy(() => import("@/features/users/pages"));
const UserPage = lazy(() => import("@/features/users/pages/UserPage"));
const ProfilePage = lazy(() => import("@/features/profile/pages/profile"));
const ProfileFinancePage = lazy(
  () => import("@/features/profile/pages/finance"),
);
const RolesPermissionsPage = lazy(
  () => import("@/features/roles-permissions/pages"),
);
const DictionariesPage = lazy(() => import("@/features/dictionaries"));
const AccessoriesPage = lazy(
  () => import("@/features/dictionaries/pages/Accessories"),
);
const DeviceConditionsPage = lazy(
  () => import("@/features/dictionaries/pages/DeviceConditions"),
);
const IssueTypesPage = lazy(
  () => import("@/features/dictionaries/pages/IssueTypes"),
);
const DeviceModelsPage = lazy(
  () => import("@/features/dictionaries/pages/DeviceModels"),
);
const DeviceTypesPage = lazy(
  () => import("@/features/dictionaries/pages/DeviceTypes"),
);
const IntakeNotesPage = lazy(
  () => import("@/features/dictionaries/pages/IntakeNotes"),
);
const ManufacturersPage = lazy(
  () => import("@/features/dictionaries/pages/Manufacturers"),
);
const ServicesPage = lazy(
  () => import("@/features/dictionaries/pages/Services"),
);
const OrderStatusesPage = lazy(
  () => import("@/features/dictionaries/pages/OrderStatuses"),
);
const SuppliersPage = lazy(
  () => import("@/features/dictionaries/pages/Suppliers"),
);
const ProductsPage = lazy(
  () => import("@/features/dictionaries/pages/Products"),
);
const LocationsPage = lazy(
  () => import("@/features/dictionaries/pages/Locations"),
);
const BankCardsPage = lazy(
  () => import("@/features/dictionaries/pages/BankCards"),
);
const PriceListPage = lazy(
  () => import("@/features/dictionaries/pages/price-list"),
);
const WorksPage = lazy(() => import("@/features/works/pages"));
const WorkCreatePage = lazy(
  () => import("@/features/works/pages/WorkCreatePage"),
);
const WorkEditPage = lazy(() => import("@/features/works/pages/WorkEditPage"));
const OutsourcersPage = lazy(
  () => import("@/features/dictionaries/pages/Outsourcers"),
);
const BalancesPage = lazy(() => import("@/features/billing/pages/balances"));
const AllTransactionsPage = lazy(
  () => import("@/features/billing/pages/all-transactions"),
);
const WithdrawalRequestsPage = lazy(
  () => import("@/features/billing/pages/withdrawal-requests"),
);
const OrderPaymentsReportPage = lazy(
  () => import("@/features/billing/pages/order-payments"),
);
const SmsIntegrationPage = lazy(
  () => import("@/features/sms-integration/pages"),
);
const QuickOrdersPage = lazy(() => import("@/features/quick-orders/pages"));
const CreateQuickOrderPage = lazy(
  () => import("@/features/quick-orders/pages/new"),
);
const QuickOrderPage = lazy(
  () =>
    import("@/features/quick-orders/pages/quick-order-page/QuickOrderPage.tsx"),
);
const ReferralsPage = lazy(() => import("@/features/referrals/pages"));
const ReferralTransactionsPage = lazy(
  () => import("@/features/referrals/pages/transactions"),
);
const StatisticsPage = lazy(() => import("@/features/statistics/pages"));

export const modulesRoutes: RouteObject = {
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
        <ProtectedRoute
          requiredAbility={ABILITIES.USERS_ROLES_PERMISSIONS_MANAGE}
        />
      ),
      children: [
        {
          path: ROLES_PERMISSIONS_ROUTES.root,
          element: <RolesPermissionsPage />,
        },
      ],
    },
    {
      element: <ProtectedRoute requiredAbility={ABILITIES.BILLING_VIEW} />,
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
        {
          path: BILLING_ROUTES.orderPayments,
          element: <OrderPaymentsReportPage />,
        },
      ],
    },
    {
      element: (
        <ProtectedRoute requiredAbility={ABILITIES.INTEGRATIONS_SMS_VIEW} />
      ),
      children: [
        {
          path: SMS_INTEGRATION_ROUTES.root,
          element: <SmsIntegrationPage />,
        },
      ],
    },
    {
      element: (
        <ProtectedRoute requiredAbility={ABILITIES.QUICK_ORDERS_MANAGE} />
      ),
      children: [
        {
          path: QUICK_ORDERS_ROUTES.root,
          element: <QuickOrdersPage />,
        },
        {
          path: QUICK_ORDERS_ROUTES.new,
          element: <CreateQuickOrderPage />,
        },
        {
          path: QUICK_ORDERS_ROUTES.quickOrder,
          element: <QuickOrderPage />,
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
      element: <ProtectedRoute requiredAbility={ABILITIES.REFERRALS_MANAGE} />,
      children: [
        { path: REFERRALS_ROUTES.root, element: <ReferralsPage /> },
        {
          path: REFERRALS_ROUTES.transactions,
          element: <ReferralTransactionsPage />,
        },
      ],
    },
    {
      element: <ProtectedRoute requiredAbility={ABILITIES.STATISTICS_VIEW} />,
      children: [{ path: STATISTICS_ROUTES.root, element: <StatisticsPage /> }],
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
