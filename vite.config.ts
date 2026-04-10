import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
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
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-avatar",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-label",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-tooltip",
          ],
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
        },
      },
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
  server: {
    port: 3000,
    open: true,
  },
});
