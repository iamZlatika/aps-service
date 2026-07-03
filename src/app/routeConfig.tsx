import { lazy, Suspense } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import { authRoutes } from "@/app/routes/auth.tsx";
import { backofficeRoutes } from "@/app/routes/backoffice.tsx";
import { websiteRoutes } from "@/app/routes/website.tsx";
import { AuthRoutes } from "@/features/auth/backoffice/api/routes.ts";
import { ORDERS_ROUTES } from "@/features/backoffice/modules/orders/routes";
import { SharedRoutes } from "@/shared/api/routes.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";

import { ProtectedRoute } from "./ProtectedRoute";

// Layouts
const BackofficeLayout = lazy(
  () => import("@/features/backoffice/components/Layout"),
);

// Shared
const NotFoundPage = lazy(
  () => import("@/shared/components/errors/NotFound.tsx"),
);
const ForbiddenPage = lazy(
  () => import("@/shared/components/errors/Forbidden.tsx"),
);
const BlockedPage = lazy(() => import("@/features/website/pages/blocked"));

export const routeConfig: RouteObject[] = [
  // public website
  websiteRoutes,

  // backoffice auth
  {
    path: AuthRoutes.backofficeRoot(),

    children: [
      authRoutes,

      // admin panel
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: (
              <Suspense fallback={<Loader />}>
                <BackofficeLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <Navigate to={ORDERS_ROUTES.root} replace />,
              },
              backofficeRoutes,
            ],
          },
        ],
      },
    ],
  },
  { path: SharedRoutes.forbidden(), element: <ForbiddenPage /> },
  { path: SharedRoutes.blocked(), element: <BlockedPage /> },
  { path: "*", element: <NotFoundPage /> },
];
