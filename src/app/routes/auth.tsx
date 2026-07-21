import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

import { GuestRoute } from "@/app/GuestRoute.tsx";
import { AuthRoutes } from "@/features/auth/api/routes.ts";

const LoginPage = lazy(() => import("@/features/auth/pages/login"));
const ForgotPasswordPage = lazy(() => import("@/features/auth/pages/forgot"));
const EmailSentPage = lazy(
  () => import("@/features/auth/pages/forgot/EmailSentPage"),
);
const ResetPasswordPage = lazy(
  () => import("@/features/auth/pages/forgot/ResetPasswordPage"),
);

export const authRoutes: RouteObject = {
  path: AuthRoutes.auth(),
  children: [
    {
      // The login page manages its own freeze + loader through both the
      // login request and the profile fetch, so it opts out of GuestRoute's
      // loader to avoid showing a second, competing one.
      element: <GuestRoute showLoader={false} />,
      children: [{ path: AuthRoutes.login(), element: <LoginPage /> }],
    },
    {
      element: <GuestRoute />,
      children: [
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
    },
  ],
};
