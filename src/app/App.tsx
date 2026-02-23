import "../styles/App.css";

import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";

import { router } from "./router";

function App() {
  return (
    <Suspense fallback={<div>Загрузка приложения…</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
