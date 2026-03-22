import i18next from "i18next";
import { lazy, Suspense } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import { authRoutes } from "@/app/routes/auth.tsx";
import { backofficeRoutes } from "@/app/routes/backoffice.tsx";
import { websiteRoutes } from "@/app/routes/website.tsx";
import { AuthRoutes } from "@/features/auth/api/routes.ts";
import { OrdersRoutes } from "@/features/backoffice/modules/orders/routers.ts";
import { SharedRoutes } from "@/shared/api/routes.ts";
import Loader from "@/shared/components/common/Loader.tsx";
import { ROLES } from "@/shared/types.ts";

import { ProtectedRoute } from "./ProtectedRoute";

// website
const UserAccountPage = lazy(
  () => import("@/features/website/pages/user-account"),
);

// Layouts
const BackofficeLayout = lazy(
  () => import("@/features/backoffice/components/Layout"),
);

const WebsiteLayout = lazy(
  () => import("@/features/website/components/WebsiteLayout"),
);

// Shared
const NotFoundPage = lazy(
  () => import("@/shared/components/errors/NotFound.tsx"),
);
const ForbiddenPage = lazy(
  () => import("@/shared/components/errors/Forbidden.tsx"),
);

export const routeConfig: RouteObject[] = [
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
          <ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.HEAD_MANAGER]} />
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
