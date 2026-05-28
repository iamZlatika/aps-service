import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

import { WebsiteLayout } from "@/features/website/components/WebsiteLayout";
import HomePage from "@/features/website/pages/home";
import { WEBSITE_ROUTES } from "@/features/website/routes";

const ContactsPage = lazy(() => import("@/features/website/pages/contacts"));
const ReviewsPage = lazy(() => import("@/features/website/pages/reviews"));
const UserAccountPage = lazy(
  () => import("@/features/website/pages/user-account"),
);
const TrackPage = lazy(() => import("@/features/website/pages/track"));

export const websiteRoutes: RouteObject = {
  element: <WebsiteLayout />,
  children: [
    { path: WEBSITE_ROUTES.home, element: <HomePage /> },
    { path: WEBSITE_ROUTES.contacts, element: <ContactsPage /> },
    { path: WEBSITE_ROUTES.reviews, element: <ReviewsPage /> },
    { path: WEBSITE_ROUTES.account, element: <UserAccountPage /> },
    { path: WEBSITE_ROUTES.track, element: <TrackPage /> },
  ],
};
