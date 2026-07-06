import { Helmet } from "react-helmet-async";

import { useWebsiteSeo } from "@/features/website/hooks/useWebsiteSeo";

const WebsitePageSeo = () => {
  const seo = useWebsiteSeo();

  if (!seo) return null;

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.canonical} />
    </Helmet>
  );
};

export default WebsitePageSeo;
