import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth";
import { logoutApi } from "../api/logout-api";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi.logout,
    onSuccess: () => {
      useAuthStore.getState().logout();
      queryClient.setQueryData(["auth-user"], null);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "auth-user",
      });
    },
  });
};
