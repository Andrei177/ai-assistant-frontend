import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/api";

export const userKeys = {
  all: ["users"] as const,
  sessions: () => [...userKeys.all, "me", "sessions"] as const,
};

export const useUserSessions = () =>
  useQuery({
    queryKey: userKeys.sessions(),
    queryFn: userApi.getSessions,
  });

export const useRevokeUserSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.revokeSession,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: userKeys.sessions() }),
  });
};
