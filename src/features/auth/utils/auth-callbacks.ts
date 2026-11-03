import { useAuthStore } from "@/features/auth";
import { injectAuthCallbacks } from "@/shared";

injectAuthCallbacks({
  onTokenRefresh: (newToken) => {
    useAuthStore.getState().setToken(newToken);
  },
  onLogout: () => {
    useAuthStore.getState().logout();
  },
});
