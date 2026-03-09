import i18next from "i18next";
import { lazy, Suspense } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import { authRoutes } from "@/app/routes/auth.tsx";
import { backofficeRoutes } from "@/app/routes/backoffice.tsx";
import { websiteRoutes } from "@/app/routes/website.tsx";
import { AuthRoutes } from "@/features/auth/routes.ts";
import { OrdersRoutes } from "@/features/backoffice/modules/orders/routers.ts";
import { SharedRoutes } from "@/shared/api/routes.ts";
import Loader from "@/shared/components/common/Loader.tsx";
import { ROLES } from "@/types/types";

import { ProtectedRoute } from "./ProtectedRoute";

// website
const UserAccountPage = lazy(
  () => import("@/features/website/pages/user-account"),
);

// Layouts
const BackofficeLayout = lazy(
  () => import("@/features/backoffice/components/BackofficeLayout"),
);

const WebsiteLayout = lazy(
  () => import("@/features/website/components/WebsiteLayout"),
);

// Shared
const NotFoundPage = lazy(() => import("@/shared/pages/NotFound"));
const ForbiddenPage = lazy(() => import("@/shared/pages/Forbidden"));
const GlobalErrorPage = lazy(() => import("@/shared/pages/GlobalError"));

export const routeConfig: RouteObject[] = [
  {
    path: "/",
    errorElement: <GlobalErrorPage />,
  },
  // public website
  websiteRoutes,

  // client account
  {
    element: <ProtectedRoute allowedRoles={[ROLES.CLIENT]} />,
    children: [
      {
        element: (
          <Suspense fallback={<Loader text={i18next.t("loader.backoffice")} />}>
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
  // backoffice auth
  {
    path: AuthRoutes.backofficeRoot(),

    children: [
      authRoutes,

      // admin panel
      {
        element: (
          <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.HEAD_MANAGER]} />
        ),
        children: [
          {
            element: (
              <Suspense
                fallback={<Loader text={i18next.t("loader.control_panel")} />}
              >
                <BackofficeLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <Navigate to={OrdersRoutes.ordersList()} replace />,
              },
              backofficeRoutes,
            ],
          },
        ],
      },
    ],
  },
  { path: SharedRoutes.forbidden(), element: <ForbiddenPage /> },
  { path: "*", element: <NotFoundPage /> },
];
