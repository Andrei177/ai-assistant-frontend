import type { User } from "@/entities/user";

export type LoginResponse = {
  user: User;
  accessToken: string;
};
