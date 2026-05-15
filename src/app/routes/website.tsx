import { lazy, Suspense } from "react";
import { type RouteObject } from "react-router-dom";

import { WEBSITE_ROUTES } from "@/features/website/routes";
import Loader from "@/shared/components/common/Loader.tsx";

const WebsiteLayout = lazy(
  () => import("@/features/website/components/WebsiteLayout"),
);
const HomePage = lazy(() => import("@/features/website/pages/home"));
const ContactsPage = lazy(() => import("@/features/website/pages/contacts"));

export const websiteRoutes: RouteObject = {
  element: (
    <Suspense fallback={<Loader />}>
      <WebsiteLayout />
    </Suspense>
  ),
  children: [
    { path: WEBSITE_ROUTES.home, element: <HomePage /> },
    { path: WEBSITE_ROUTES.contacts, element: <ContactsPage /> },
  ],
};
