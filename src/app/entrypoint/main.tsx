import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "../router/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/index.css";
import { Toaster } from "@/shared";
import { AuthInitializer } from "@/features/auth";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
      <Toaster position="top-right" />
    </QueryClientProvider>
  </StrictMode>,
);
