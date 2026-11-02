import { api, type AuthFormData } from "@/shared";
import type { LoginResponse } from "../model/LoginResponse";

export const login = async ({ userEmail, password }: AuthFormData) => {
  const res = await api.post<LoginResponse>("/v1/auth/login", {
    userEmail,
    password,
  });
  return res.data;
};
