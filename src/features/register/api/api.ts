import { api, type AuthFormData } from "@/shared";
import type { RegisterResponse } from "../model/RegisterResponse";

export const register = async ({ userEmail, password }: AuthFormData) => {
  const res = await api.post<RegisterResponse>("/v1/auth/register", {
    userEmail,
    password,
  });

  return res.data;
};
