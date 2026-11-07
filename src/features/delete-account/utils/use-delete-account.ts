import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/entities/user";
import { useAuthStore } from "@/features/auth";

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteMe,
    onSuccess: () => {
      useAuthStore.getState().logout();
      queryClient.removeQueries();
    },
  });
};
