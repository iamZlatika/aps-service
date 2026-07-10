import { useEffect } from "react";

const MANIFEST_HREF = "/backoffice-manifest.webmanifest";
const SERVICE_WORKER_URL = "/sw.js";
const SERVICE_WORKER_SCOPE = "/backoffice/";

export const useBackofficePwa = (): void => {
  useEffect(() => {
    const manifestLink = document.createElement("link");
    manifestLink.rel = "manifest";
    manifestLink.href = MANIFEST_HREF;
    document.head.appendChild(manifestLink);

    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      navigator.serviceWorker
        .register(SERVICE_WORKER_URL, { scope: SERVICE_WORKER_SCOPE })
        .catch(() => undefined);
    }

    return () => {
      document.head.removeChild(manifestLink);
    };
  }, []);
};
