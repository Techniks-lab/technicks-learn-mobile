import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "auth.accessToken";
const REFRESH_TOKEN_KEY = "auth.refreshToken";
const USER_KEY = "auth.user";

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    if (typeof accessToken !== "string" || !accessToken) {
      throw new Error(
        `tokenStorage.setTokens: accessToken must be a non-empty string, got ${typeof accessToken} (${accessToken})`,
      );
    }
    if (typeof refreshToken !== "string" || !refreshToken) {
      throw new Error(
        `tokenStorage.setTokens: refreshToken must be a non-empty string, got ${typeof refreshToken} (${refreshToken})`,
      );
    }

    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },
  async setAccessToken(accessToken: string): Promise<void> {
    if (typeof accessToken !== "string" || !accessToken) {
      throw new Error(`Invalid accessToken: ${typeof accessToken}`);
    }
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  },

  async getUser<T = unknown>(): Promise<T | null> {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  },

  async setUser<T>(user: T): Promise<void> {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  },

  async clear(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  },
};
