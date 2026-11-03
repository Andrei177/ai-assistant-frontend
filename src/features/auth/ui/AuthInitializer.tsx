import { useEffect } from "react";
import { type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user";
import { useAuthStore } from "../model/auth-store";
import { initializeAuthCallbacks } from "../utils/auth-callbacks";
import { toast } from "sonner";

initializeAuthCallbacks();

type Props = {
  children: ReactNode;
};

export const AuthInitializer = ({ children }: Props) => {
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthChecked = useAuthStore((state) => state.setAuthChecked);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["auth-user"],
    queryFn: userApi.getMe,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
      setAuthChecked(true);
    }
  }, [data, setUser, setAuthChecked]);

  useEffect(() => {
    if (isError) {
      setUser(null);
      setAuthChecked(true);
      toast.error(error.message);
    }
  }, [isError, setUser, setAuthChecked, error]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
};
