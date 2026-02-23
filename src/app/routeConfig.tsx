import { lazy, Suspense } from "react";
import { Navigate, Outlet, type RouteObject } from "react-router-dom";

import { ROLES } from "@/types/types";

import { ProtectedRoute } from "./ProtectedRoute";

// website
const HomePage = lazy(() => import("@/features/website/pages/home"));
const ContactsPage = lazy(() => import("@/features/website/pages/contacts"));
const UserAccountPage = lazy(
  () => import("@/features/website/pages/user-account"),
);

// auth
const LoginPage = lazy(() => import("@/features/auth/pages/login"));
const RegistrationPage = lazy(
  () => import("@/features/auth/pages/registration"),
);

// backoffice
const CustomersPage = lazy(
  () => import("@/features/backoffice/pages/customers"),
);
const OrdersPage = lazy(() => import("@/features/backoffice/pages/orders"));
const ServicesPage = lazy(() => import("@/features/backoffice/pages/services"));
const UsersPage = lazy(() => import("@/features/backoffice/pages/users"));

// Layouts
const BackofficeLayout = lazy(
  () => import("@/features/backoffice/components/BackofficeLayout"),
);
import WebsiteLayout from "@/features/website/components/WebsiteLayout";

// Shared
const NotFoundPage = lazy(() => import("@/shared/pages/NotFound"));
const ForbiddenPage = lazy(() => import("@/shared/pages/Forbidden"));

export const routeConfig: RouteObject[] = [
  // Public website
  {
    element: (
      <Suspense fallback={<div>Загрузка сайта…</div>}>
        <WebsiteLayout />
      </Suspense>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/contacts", element: <ContactsPage /> },
    ],
  },

  // Auth
  {
    element: (
      <Suspense fallback={<div>Загрузка логина…</div>}>
        <Outlet />
      </Suspense>
    ),
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/registration", element: <RegistrationPage /> },
    ],
  },

  // Client account
  {
    element: <ProtectedRoute allowedRoles={[ROLES.CLIENT]} />,
    children: [
      {
        element: (
          <Suspense fallback={<div>Загрузка бекофиса</div>}>
            <WebsiteLayout />
          </Suspense>
        ),
        children: [
          {
            path: "/account",
            element: <UserAccountPage />,
          },
        ],
      },
    ],
  },

  // 🏢 BACKOFFICE (USER + SUPER_ADMIN)
  {
    path: "/backoffice",
    element: <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.SUPER_ADMIN]} />,
    children: [
      {
        element: (
          <Suspense fallback={<div>Загрузка панели управления…</div>}>
            <BackofficeLayout />
          </Suspense>
        ),
        children: [
          { index: true, element: <Navigate to="orders" replace /> },

          { path: "orders", element: <OrdersPage /> },
          { path: "customers", element: <CustomersPage /> },
          { path: "users", element: <UsersPage /> },

          {
            element: <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />,
            children: [{ path: "services", element: <ServicesPage /> }],
          },
        ],
      },
    ],
  },
  { path: "/403", element: <ForbiddenPage /> },
  { path: "*", element: <NotFoundPage /> },
];
