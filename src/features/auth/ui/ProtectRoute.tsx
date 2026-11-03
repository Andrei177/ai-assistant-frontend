import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../model/auth-store";
import { Routes } from "@/shared";
type Props = {
  redirectTo?: string;
};

export const ProtectRoute = ({ redirectTo = Routes.LOGIN }: Props) => {
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);

  if (!isAuthChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Пожалуйста подожите...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
};
