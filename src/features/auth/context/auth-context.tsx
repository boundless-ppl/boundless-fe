"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import {
  AuthApiError,
  getMe,
  loginRequest,
  logoutRequest,
  refreshAccessToken,
  registerRequest,
} from "@/features/auth/services/auth.service";
import { clearAuthCookies, readAuthFromCookies, saveAuthToCookies } from "@/features/auth/utils/auth-cookies";
import { isAccessTokenExpired, parseAccessToken } from "@/features/auth/utils/access-token";
import type {
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  UserData,
} from "@/features/auth/types/auth.types";

type AuthContextValue = {
  user: UserData | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUserData: (nextUser: UserData) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<UserData | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const latestAccessTokenRef = useRef<string | null>(null);
  const isLoading = !hasHydrated;

  const clearAuthState = useCallback((expectedAccessToken?: string) => {
    if (expectedAccessToken && latestAccessTokenRef.current !== expectedAccessToken) {
      return;
    }

    latestAccessTokenRef.current = null;
    setUser(null);
    setTokens(null);
    clearAuthCookies();
  }, []);

  useEffect(() => {
    const bootstrappedAuth = readAuthFromCookies();
    latestAccessTokenRef.current = bootstrappedAuth?.tokens.accessToken ?? null;
    setUser(bootstrappedAuth?.user ?? null);
    setTokens(bootstrappedAuth?.tokens ?? null);
    setHasHydrated(true);
  }, []);

  const refreshUserRef = useRef<(options?: { allowUnauthorizedLogout?: boolean }) => Promise<void>>(
    async () => {}
  );

  const updateAuthState = (nextTokens: AuthTokens, nextUser: UserData) => {
    latestAccessTokenRef.current = nextTokens.accessToken;
    setTokens(nextTokens);
    setUser(nextUser);
    saveAuthToCookies(nextTokens, nextUser);
  };

  const shouldLogoutForAuthError = (error: unknown, allowUnauthorizedLogout: boolean) => {
    if (!allowUnauthorizedLogout) {
      return false;
    }
    return error instanceof AuthApiError && error.statusCode === 401;
  };

  const login = async (payload: LoginPayload) => {
    const nextTokens = await loginRequest(payload);
    const claims = parseAccessToken(nextTokens.accessToken);

    if (!claims) {
      clearAuthCookies();
      throw new Error("Session expired");
    }

    let userData: UserData = {
      userId: claims.userId,
      nama_lengkap: "",
      email: payload.email,
      role: claims.role,
    };

    try {
      userData = await getMe(nextTokens.accessToken);
    } catch {
    }

    updateAuthState(nextTokens, userData);
  };

  const register = async (payload: RegisterPayload) => {
    await registerRequest(payload);
  };

  const logout = async () => {
    const accessToken = tokens?.accessToken;
    clearAuthState();

    if (accessToken) {
      try {
        await logoutRequest(accessToken);
      } catch {
      }
    }
  };

  const setUserData = (nextUser: UserData) => {
    setUser(nextUser);
    if (tokens) {
      saveAuthToCookies(tokens, nextUser);
    }
  };

  const refreshUser = useCallback(async (options?: { allowUnauthorizedLogout?: boolean }) => {
    if (!tokens?.accessToken) {
      return;
    }

    const activeAccessToken = tokens.accessToken;

    if (isAccessTokenExpired(tokens.accessToken)) {
      if (!tokens.refreshToken) {
        clearAuthState(activeAccessToken);
        return;
      }

      try {
        const { accessToken: newAccessToken } = await refreshAccessToken(tokens.refreshToken);
        if (latestAccessTokenRef.current !== activeAccessToken) {
          return;
        }

        const newTokens: AuthTokens = { accessToken: newAccessToken, refreshToken: tokens.refreshToken };
        const latestUser = await getMe(newAccessToken);
        updateAuthState(newTokens, latestUser);
      } catch {
        clearAuthState(activeAccessToken);
      }
      return;
    }

    const allowUnauthorizedLogout = options?.allowUnauthorizedLogout ?? true;

    try {
      const latestUser = await getMe(tokens.accessToken);
      if (latestAccessTokenRef.current === activeAccessToken) {
        setUser(latestUser);
        saveAuthToCookies(tokens, latestUser);
      }
    } catch (error) {
      if (shouldLogoutForAuthError(error, allowUnauthorizedLogout)) {
        clearAuthState(activeAccessToken);
      }
    }
  }, [clearAuthState, tokens]);

  useEffect(() => {
    refreshUserRef.current = refreshUser;
  }, [refreshUser]);

  useEffect(() => {
    if (!tokens?.accessToken) {
      return;
    }

    if (isAccessTokenExpired(tokens.accessToken)) {
      const timeout = globalThis.setTimeout(() => {
        void refreshUserRef.current({ allowUnauthorizedLogout: true });
      }, 0);
      return () => globalThis.clearTimeout(timeout);
    }

    const claims = parseAccessToken(tokens.accessToken);
    if (!claims) {
      const timeout = globalThis.setTimeout(clearAuthState, 0);
      return () => globalThis.clearTimeout(timeout);
    }

    const msUntilExpiry = Math.max(claims.expiresAt.getTime() - Date.now(), 0);
    const timeout = globalThis.setTimeout(() => {
      void refreshUserRef.current({ allowUnauthorizedLogout: true });
    }, msUntilExpiry);

    return () => globalThis.clearTimeout(timeout);
  }, [clearAuthState, tokens]);

  useEffect(() => {
    if (!tokens?.accessToken) {
      return;
    }

    void refreshUser({ allowUnauthorizedLogout: false });

    const intervalId = globalThis.setInterval(() => {
      void refreshUser({ allowUnauthorizedLogout: true });
    }, 60_000);

    const handleFocus = () => {
      void refreshUser({ allowUnauthorizedLogout: false });
    };

    const handleVisibilityChange = () => {
      if (globalThis.document.visibilityState === "visible") {
        void refreshUser({ allowUnauthorizedLogout: false });
      }
    };

    globalThis.window.addEventListener("focus", handleFocus);
    globalThis.document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      globalThis.clearInterval(intervalId);
      globalThis.window.removeEventListener("focus", handleFocus);
      globalThis.document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tokens?.accessToken, refreshUser]);

  const value: AuthContextValue = {
    user,
    tokens,
    isAuthenticated: !!tokens?.accessToken,
    isLoggedIn: !!tokens?.accessToken,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    setUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
