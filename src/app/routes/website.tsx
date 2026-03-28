import { lazy, Suspense } from "react";
import { type RouteObject } from "react-router-dom";

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
    { path: "/", element: <HomePage /> },
    { path: "/contacts", element: <ContactsPage /> },
  ],
};
