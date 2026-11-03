import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_URL = "http://localhost:8080/api";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let onTokenRefresh: ((token: string) => void) | null = null;
let onLogout: (() => void) | null = null;

export const injectAuthCallbacks = (callbacks: {
  onTokenRefresh: (token: string) => void;
  onLogout: () => void;
}) => {
  onTokenRefresh = callbacks.onTokenRefresh;
  onLogout = callbacks.onLogout;
};

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  accessToken: string;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | CustomAxiosRequestConfig
      | undefined;

    const isRefreshRequest = originalRequest?.url?.includes("/v1/auth/refresh");

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post<RefreshResponse>("/v1/auth/refresh");
        const newAccessToken = response.data.accessToken;

        if (onTokenRefresh) {
          onTokenRefresh(newAccessToken);
        }

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        if (onLogout) {
          onLogout();
        }
        return Promise.reject(refreshError);
      }
    }

    if (isRefreshRequest) {
      if (onLogout) {
        onLogout();
      }
    }

    return Promise.reject(error);
  },
);
