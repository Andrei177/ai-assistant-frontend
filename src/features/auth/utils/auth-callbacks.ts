import { useAuthStore } from "../model/auth-store";
import { injectAuthCallbacks } from "@/shared";

export const initializeAuthCallbacks = () => {
  injectAuthCallbacks({
    onTokenRefresh: (newToken) => {
      useAuthStore.getState().setToken(newToken);
    },
    onLogout: () => {
      useAuthStore.getState().logout();
    },
    getAccessToken: () => useAuthStore.getState().token,
  });
};
