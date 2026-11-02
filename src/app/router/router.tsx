import { Login } from "@/pages/login";
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
    path: Routes.CHAT,
    element: <h1>Chat</h1>,
  },
  {
    path: Routes.PROFILE,
    element: <h1>Profile</h1>,
  },
]);
