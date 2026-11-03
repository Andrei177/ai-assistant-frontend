import type { User } from "@/entities/user";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  isAuthChecked: boolean;
  token: string;

  setUser: (user: User | null) => void;
  setAuthChecked: (value: boolean) => void;
  setToken: (value: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthChecked: false,
  token: "",

  setUser: (user) => set({ user }),

  setAuthChecked: (value) => set({ isAuthChecked: value }),

  setToken: (value) => set({ token: value }),

  logout: () =>
    set({
      user: null,
      isAuthChecked: true,
      token: "",
    }),
}));
