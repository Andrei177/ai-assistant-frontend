import { api } from "@/shared";

export const manageSessionsApi = {
  logoutAll: async (): Promise<void> => {
    await api.post<void>("/v1/auth/logout-all");
  },
};
