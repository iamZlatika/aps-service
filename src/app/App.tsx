import "../styles/index.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";

import { queryClient } from "@/shared/api/queryClient.ts";
import Loader from "@/shared/components/common/Loader.tsx";

import { router } from "./router";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
