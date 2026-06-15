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
const PriceListPage = lazy(() => import("@/features/website/pages/price-list"));
const WorksPage = lazy(() => import("@/features/website/pages/works"));
const WarrantyPage = lazy(() => import("@/features/website/pages/warranty"));
const AboutPage = lazy(() => import("@/features/website/pages/about"));
const EmailVerifyPage = lazy(
  () => import("@/features/auth/website/pages/email-verify/EmailVerifyPage"),
);

export const websiteRoutes: RouteObject = {
  element: <WebsiteLayout />,
  children: [
    { path: WEBSITE_ROUTES.home, element: <HomePage /> },
    { path: WEBSITE_ROUTES.contacts, element: <ContactsPage /> },
    { path: WEBSITE_ROUTES.reviews, element: <ReviewsPage /> },
    { path: WEBSITE_ROUTES.account, element: <UserAccountPage /> },
    { path: WEBSITE_ROUTES.track, element: <TrackPage /> },
    { path: WEBSITE_ROUTES.priceList, element: <PriceListPage /> },
    { path: WEBSITE_ROUTES.works, element: <WorksPage /> },
    { path: WEBSITE_ROUTES.warranty, element: <WarrantyPage /> },
    { path: WEBSITE_ROUTES.about, element: <AboutPage /> },
    { path: WEBSITE_ROUTES.emailVerify, element: <EmailVerifyPage /> },
  ],
};
