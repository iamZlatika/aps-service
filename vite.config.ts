import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Manifest and service worker registration are wired up manually
      // (see useBackofficePwa).
      injectRegister: null,
      manifest: false,
      workbox: {
        // New SW activates immediately and takes control of open tabs,
        // instead of waiting for every tab to be closed first.
        skipWaiting: true,
        clientsClaim: true,
        // HTML must not be served cache-first from precache (that's what
        // kept stale app shells alive after a deploy) — disable the
        // default precache-bound navigate fallback and use a
        // network-first runtimeCaching rule for navigations instead.
        navigateFallback: undefined,
        globPatterns: ["**/*.{js,css,svg,png,webp,woff2}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "app-shell",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 5,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    sourcemap: "hidden",
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": [
            "react",
            "react-dom",
            "react-dom/client",
            "react-router-dom",
          ],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-ui": [
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-progress",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-tooltip",
          ],
          "vendor-dates": ["date-fns"],
          "vendor-sentry": ["@sentry/react"],
          "vendor-i18n": ["i18next", "react-i18next"],
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-icons": ["lucide-react"],
          "vendor-utils": [
            "axios",
            "clsx",
            "tailwind-merge",
            "class-variance-authority",
          ],
          "vendor-sonner": ["sonner"],
          "vendor-pdf": ["pdf-lib"],
          "vendor-ably": ["ably", "@ably/laravel-echo"],
        },
      },
    },
  },
  // esbuild: {
  //   drop: ["console", "debugger"],
  // },
  server: {
    port: 3000,
    open: true,
    host: true,
    hmr: {
      host: "192.168.0.102",
    },
  },
});
