import type { User } from "@/entities/user";

export type RegisterResponse = {
  user: User;
  accessToken: string;
};
