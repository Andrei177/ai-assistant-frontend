import { useMutation } from "@tanstack/react-query";
import { manageSessionsApi } from "../api/manage-sessions-api";

export const useLogoutAllSessions = () =>
  useMutation({
    mutationFn: manageSessionsApi.logoutAll,
  });
