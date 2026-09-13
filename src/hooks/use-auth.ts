import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { authController } from "@/config/sdk";
import { sessionEvents } from "@/config/session-events";
import { tokenStorage } from "@/config/token-storage";

type AuthStatus = "loading" | "authenticated" | "guest";

export interface AuthUser {
  id: string;
  email: string;
  username: string | null;
  role: string;
  isVerified: boolean;
  fullName?: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

interface AuthResponseData {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  emailVerificationPending?: boolean;
  devOtp?: string;
}

type SessionData = { user: AuthUser; accessToken: string } | null;

const SESSION_KEY = ["auth", "session"] as const;

async function readStoredSession(): Promise<SessionData> {
  const accessToken = await tokenStorage.getAccessToken();
  const storedUser = await tokenStorage.getUser<AuthUser>();
  return accessToken && storedUser ? { user: storedUser, accessToken } : null;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: SESSION_KEY,
    queryFn: readStoredSession,
    staleTime: Infinity,
  });

  const user = sessionQuery.data?.user ?? null;
  const status: AuthStatus = sessionQuery.isLoading
    ? "loading"
    : user
      ? "authenticated"
      : "guest";

  const writeSession = useCallback(
    async (data: AuthResponseData) => {
      await tokenStorage.setTokens(data.accessToken, data.refreshToken);
      await tokenStorage.setUser(data.user);
      queryClient.setQueryData(SESSION_KEY, {
        user: data.user,
        accessToken: data.accessToken,
      } satisfies SessionData);
    },
    [queryClient],
  );

  const clearSession = useCallback(async () => {
    await tokenStorage.clear();
    queryClient.setQueryData<SessionData>(SESSION_KEY, null);
  }, [queryClient]);

  // When the refresh token is rejected (e.g. expired), the axios interceptor
  // drops the stored session. Keep the in-memory auth state in sync so the UI
  // flips back to guest instead of limping along with dead tokens.
  useEffect(() => {
    return sessionEvents.subscribe(() => {
      void clearSession();
    });
  }, [clearSession]);

  const signUpMutation = useMutation({
    mutationFn: async (input: SignUpInput) => {
      const data = (await authController
        .authControllerRegisterV1({
          email: input.email,
          password: input.password,
          fullName: input.fullName,
        })
        .then((res) => res.data)) as unknown as Record<string, unknown>;
      const accessToken = data.accessToken as string | undefined;
      const refreshToken = data.refreshToken as string | undefined;
      if (accessToken && refreshToken) {
        await tokenStorage.setTokens(accessToken, refreshToken);
      }
      try {
        const profile = await authController
          .authControllerProfileV1()
          .then((res) => res.data as unknown as AuthUser);
        return { ...data, user: profile };
      } catch {
        return data;
      }
    },
    onSuccess: (data) => writeSession(data as unknown as AuthResponseData),
  });
  const signUp = useCallback(
    (input: SignUpInput) =>
      signUpMutation
        .mutateAsync(input)
        .then((data) => data as unknown as AuthResponseData),
    [signUpMutation],
  );

  const loginMutation = useMutation({
    mutationFn: async (input: LoginInput) => {
      const data = (await authController
        .authControllerLoginV1({
          email: input.email,
          password: input.password,
        })
        .then((res) => res.data)) as unknown as Record<string, unknown>;
      const accessToken = data.accessToken as string | undefined;
      const refreshToken = data.refreshToken as string | undefined;
      if (accessToken && refreshToken) {
        await tokenStorage.setTokens(accessToken, refreshToken);
      }
      try {
        const profile = await authController
          .authControllerProfileV1()
          .then((res) => res.data as unknown as AuthUser);
        return { ...data, user: profile };
      } catch {
        return data;
      }
    },
    onSuccess: (data) => writeSession(data as unknown as AuthResponseData),
  });
  const login = useCallback(
    (input: LoginInput) =>
      loginMutation
        .mutateAsync(input)
        .then((data) => data as unknown as AuthResponseData),
    [loginMutation],
  );

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await authController.authControllerLogoutV1();
      } catch {
        // token may already be expired — local logout still proceeds
      }
    },
    onSettled: () => clearSession(),
  });
  const logout = useCallback(
    () => logoutMutation.mutateAsync(),
    [logoutMutation],
  );

  const refreshProfileMutation = useMutation({
    mutationFn: () =>
      authController.authControllerProfileV1().then((res) => res.data),
    onSuccess: async (data) => {
      const profile = data as unknown as AuthUser;
      await tokenStorage.setUser(profile);
      queryClient.setQueryData<SessionData>(SESSION_KEY, (current) =>
        current ? { ...current, user: profile } : current,
      );
    },
  });
  const refreshProfile = useCallback(
    () => refreshProfileMutation.mutateAsync().then((data) => data as unknown as AuthUser),
    [refreshProfileMutation],
  );

  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) =>
      authController
        .authControllerVerifyEmailV1({ email: user!.email, token })
        .then((res) => res.data),
    onSuccess: () => refreshProfile(),
  });
  const verifyEmail = useCallback(
    (token: string) => verifyEmailMutation.mutateAsync(token),
    [verifyEmailMutation],
  );

  const resendCodeMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      await authController.authControllerResendOtpV1({ email: user.email });
    },
  });
  const resendCode = useCallback(
    () => resendCodeMutation.mutateAsync(),
    [resendCodeMutation],
  );

  const setUsernameMutation = useMutation({
    mutationFn: (username: string) =>
      authController
        .authControllerSetUsernameV1({ username })
        .then((res) => res.data),
    onSuccess: (data) => {
      const result = data as unknown as AuthResponseData;
      if (result.accessToken) {
        return writeSession(result);
      }
      if (result.user) {
        queryClient.setQueryData<SessionData>(SESSION_KEY, (current) =>
          current
            ? { user: result.user, accessToken: current.accessToken }
            : null,
        );
      }
    },
  });
  const setUsername = useCallback(
    (username: string) => setUsernameMutation.mutateAsync(username),
    [setUsernameMutation],
  );

  const clearAuth = useCallback(() => clearSession(), [clearSession]);

  return {
    status,
    user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    signUp,
    login,
    logout,
    verifyEmail,
    resendCode,
    setUsername,
    refreshProfile,
    clearAuth,
  };
}

export function useUsernameAvailable(username: string, enabled: boolean) {
  return useQuery({
    queryKey: ["auth", "username-available", username],
    queryFn: async () => {
      try {
        await authController.authControllerCheckUsernameV1(username);
        return true;
      } catch {
        return false;
      }
    },
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}
