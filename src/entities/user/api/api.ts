import { api } from "@/shared";
import type { User } from "../model/User";

export const userApi = {
  getMe: async () => {
    const res = await api.get<User>("/v1/users/me");
    return res.data;
  },
  deleteAcc: async () => {
    const res = await api.delete("/v1/users/me");
    return res.data;
  },
};
