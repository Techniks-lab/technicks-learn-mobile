import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { tokenStorage } from './token-storage';
import { sessionEvents } from './session-events';
import { serverPath } from '@/sdk/setup';

export const http = axios.create({
  baseURL: serverPath,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function onRefreshFailed(error: AxiosError) {
  refreshSubscribers.forEach((cb) => cb(''));
  refreshSubscribers = [];
  isRefreshing = false;
  void error;
}

http.interceptors.request.use(
  async (config) => {
    const accessToken = await tokenStorage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & {
      _retry?: boolean;
    });

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const refreshToken = await tokenStorage.getRefreshToken();

      if (!refreshToken) {
        await tokenStorage.clear();
        sessionEvents.emitSessionExpired();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((token) => {
            if (!token) {
              reject(error);
              return;
            }
            originalRequest._retry = true;
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            resolve(http(originalRequest));
          });
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const { data } = await http.post<RefreshResponse>(
          '/api/v1/auth/refresh',
          { refreshToken },
          { _retry: true } as AxiosRequestConfig,
        );

        await tokenStorage.setTokens(data.accessToken, data.refreshToken);
        onTokenRefreshed(data.accessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.accessToken}`,
        };
        return http(originalRequest);
      } catch (refreshError) {
        const status = (refreshError as AxiosError).response?.status;
        if (status && status >= 400 && status < 500) {
          // Refresh token was rejected — the session is dead. Drop it so the
          // app stops acting authenticated and the user is prompted to re-login.
          await tokenStorage.clear();
          sessionEvents.emitSessionExpired();
        }
        onRefreshFailed(refreshError as AxiosError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);