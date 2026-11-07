import { api } from "@/shared";
import type { User } from "../model/User";
import type { UserSession } from "../model/UserSession";

export const userApi = {
  getMe: async () => {
    const res = await api.get<User>("/v1/users/me");
    return res.data;
  },
  deleteMe: async (): Promise<void> => {
    await api.delete("/v1/users/me");
  },
  getSessions: async (): Promise<UserSession[]> => {
    const res = await api.get<UserSession[]>("/v1/users/me/sessions");
    return res.data;
  },
  revokeSession: async (tokenId: number): Promise<void> => {
    await api.delete(`/v1/users/me/sessions/${tokenId}`);
  },
};
