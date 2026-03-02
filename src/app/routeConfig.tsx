import { lazy, Suspense } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import { AuthRoutes } from "@/features/auth/auth-routes.ts";
import { CustomersRoutes } from "@/features/backoffice/pages/customers/routers.ts";
import { OrdersRoutes } from "@/features/backoffice/pages/orders/routers.ts";
import { ServicesRoutes } from "@/features/backoffice/pages/services/routers.ts";
import { UsersRoutes } from "@/features/backoffice/pages/users/routers.ts";
import { ROLES } from "@/types/types";

import { ProtectedRoute } from "./ProtectedRoute";

// website
const HomePage = lazy(() => import("@/features/website/pages/home"));
const ContactsPage = lazy(() => import("@/features/website/pages/contacts"));
const UserAccountPage = lazy(
  () => import("@/features/website/pages/user-account"),
);

// auth
const BackofficeLoginPage = lazy(
  () => import("@/features/auth/backoffice/pages/login"),
);
const ForgotPasswordPage = lazy(
  () => import("@/features/auth/backoffice/pages/fogot"),
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
  // public website
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

  // auth
  // {
  //   element: (
  //     <Suspense fallback={<div>Загрузка логина…</div>}>
  //       <Outlet />
  //     </Suspense>
  //   ),
  //   children: [
  //     { path: AuthRoutes.login(), element: <BackofficeLoginPage /> },
  //     { path: AuthRoutes.registration(), element: <RegistrationPage /> },
  //   ],
  // },

  // client account
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

  // super admin panel
  {
    path: "/backoffice",
    element: <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.SUPER_ADMIN]} />,
    children: [
      {
        path: AuthRoutes.auth(),
        children: [
          { path: AuthRoutes.login(), element: <BackofficeLoginPage /> },
          {
            path: AuthRoutes.forgotPassword(),
            element: <ForgotPasswordPage />,
          },
        ],
      },
      {
        element: (
          <Suspense fallback={<div>Загрузка панели управления…</div>}>
            <BackofficeLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={OrdersRoutes.ordersList()} replace />,
          },
          { path: OrdersRoutes.ordersList(), element: <OrdersPage /> },
          { path: CustomersRoutes.customersList(), element: <CustomersPage /> },
          { path: UsersRoutes.usersList(), element: <UsersPage /> },

          {
            element: <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />,
            children: [
              {
                path: ServicesRoutes.servicesList(),
                element: <ServicesPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  { path: "/403", element: <ForbiddenPage /> },
  { path: "*", element: <NotFoundPage /> },
];
