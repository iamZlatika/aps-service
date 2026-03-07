import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

import { GuestRoute } from "@/app/GuestRoute.tsx";
import { AuthRoutes } from "@/features/auth/routes.ts";

const BackofficeLoginPage = lazy(
  () => import("@/features/auth/backoffice/pages/login"),
);
const ForgotPasswordPage = lazy(
  () => import("@/features/auth/backoffice/pages/forgot"),
);
const EmailSentPage = lazy(
  () => import("@/features/auth/backoffice/pages/forgot/EmailSentPage"),
);
const ResetPasswordPage = lazy(
  () => import("@/features/auth/backoffice/pages/forgot/ResetPasswordPage"),
);

export const authRoutes: RouteObject = {
  path: AuthRoutes.auth(),
  element: <GuestRoute />,
  children: [
    { path: AuthRoutes.login(), element: <BackofficeLoginPage /> },
    {
      path: AuthRoutes.forgotPassword(),
      element: <ForgotPasswordPage />,
    },
    { path: AuthRoutes.emailSent(), element: <EmailSentPage /> },
    {
      path: AuthRoutes.resetPassword(),
      element: <ResetPasswordPage />,
    },
  ],
};
