import { ProtectRoute } from "@/features/auth";
import { ProtectLayout } from "@/pages/layouts";
import { Login } from "@/pages/login";
import { Profile } from "@/pages/profile";
import { Register } from "@/pages/register";
import { Routes } from "@/shared";
import { createBrowserRouter, Navigate } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={Routes.CHAT} />,
  },
  {
    path: Routes.LOGIN,
    element: <Login />,
  },
  {
    path: Routes.REGISTER,
    element: <Register />,
  },
  {
    element: <ProtectRoute />,
    children: [
      {
        element: <ProtectLayout />,
        children: [
          {
            path: Routes.CHAT,
            element: <h1>Chat</h1>,
          },
          {
            path: Routes.PROFILE,
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);
