import { api } from "@/shared";

export const logoutApi = {
  logout: async (): Promise<void> => {
    await api.post<void>("/v1/auth/logout");
  },
};
