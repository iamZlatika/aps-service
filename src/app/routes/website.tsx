import { lazy, Suspense } from "react";
import { type RouteObject } from "react-router-dom";

import { WEBSITE_ROUTES } from "@/features/website/routes";
import Loader from "@/shared/components/common/Loader.tsx";

const WebsiteLayout = lazy(
  () => import("@/features/website/components/WebsiteLayout"),
);
const HomePage = lazy(() => import("@/features/website/pages/home"));
const ContactsPage = lazy(() => import("@/features/website/pages/contacts"));
const ReviewsPage = lazy(() => import("@/features/website/pages/reviews"));
const UserAccountPage = lazy(
  () => import("@/features/website/pages/user-account"),
);
const TrackPage = lazy(() => import("@/features/website/pages/track"));

export const websiteRoutes: RouteObject = {
  element: (
    <Suspense fallback={<Loader />}>
      <WebsiteLayout />
    </Suspense>
  ),
  children: [
    { path: WEBSITE_ROUTES.home, element: <HomePage /> },
    { path: WEBSITE_ROUTES.contacts, element: <ContactsPage /> },
    { path: WEBSITE_ROUTES.reviews, element: <ReviewsPage /> },
    { path: WEBSITE_ROUTES.account, element: <UserAccountPage /> },
    { path: WEBSITE_ROUTES.track, element: <TrackPage /> },
  ],
};
