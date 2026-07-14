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
        .register(SERVICE_WORKER_URL, {
          scope: SERVICE_WORKER_SCOPE,
          updateViaCache: "none",
        })
        .catch(() => undefined);

      // skipWaiting + clientsClaim (see vite.config.ts) mean a newly
      // deployed SW takes control of this tab without waiting for it to
      // close. Reload once so the already-loaded JS/CSS is refreshed too,
      // guarded to avoid a reload loop if control changes more than once.
      let hasReloaded = false;
      const handleControllerChange = (): void => {
        if (hasReloaded) return;
        hasReloaded = true;
        window.location.reload();
      };
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        handleControllerChange,
      );

      return () => {
        document.head.removeChild(manifestLink);
        navigator.serviceWorker.removeEventListener(
          "controllerchange",
          handleControllerChange,
        );
      };
    }

    return () => {
      document.head.removeChild(manifestLink);
    };
  }, []);
};
