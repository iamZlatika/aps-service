import { lazy, Suspense } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import { authRoutes } from "@/app/routes/auth.tsx";
import { modulesRoutes } from "@/app/routes/modules.tsx";
import { AuthRoutes } from "@/features/auth/api/routes.ts";
import { ORDERS_ROUTES } from "@/features/orders/routes";
import { SharedRoutes } from "@/shared/api/routes.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";

import { ProtectedRoute } from "./ProtectedRoute";

// Layouts
const Layout = lazy(() => import("@/shared/components/Layout"));

// Shared
const NotFoundPage = lazy(
  () => import("@/shared/components/errors/NotFound.tsx"),
);
const ForbiddenPage = lazy(
  () => import("@/shared/components/errors/Forbidden.tsx"),
);
const BlockedPage = lazy(
  () => import("@/shared/components/errors/Blocked.tsx"),
);
const MaintenancePage = lazy(
  () => import("@/shared/components/errors/Maintenance.tsx"),
);

export const routeConfig: RouteObject[] = [
  {
    path: AuthRoutes.root(),

    children: [
      authRoutes,

      // admin panel
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: (
              <Suspense fallback={<Loader />}>
                <Layout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <Navigate to={ORDERS_ROUTES.root} replace />,
              },
              modulesRoutes,
            ],
          },
        ],
      },
    ],
  },
  { path: SharedRoutes.forbidden(), element: <ForbiddenPage /> },
  { path: SharedRoutes.blocked(), element: <BlockedPage /> },
  { path: SharedRoutes.maintenance(), element: <MaintenancePage /> },
  { path: "*", element: <NotFoundPage /> },
];
