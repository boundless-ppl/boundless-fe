"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import {
  getMe,
  loginRequest,
  logoutRequest,
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
  const [bootstrappedAuth] = useState(() => readAuthFromCookies());
  const [user, setUser] = useState<UserData | null>(bootstrappedAuth?.user ?? null);
  const [tokens, setTokens] = useState<AuthTokens | null>(bootstrappedAuth?.tokens ?? null);
  const isLoading = false;

  useEffect(() => {
    if (!tokens?.accessToken) {
      return;
    }

    const clearAuthState = () => {
      setUser(null);
      setTokens(null);
      clearAuthCookies();
    };

    if (isAccessTokenExpired(tokens.accessToken)) {
      const timeout = globalThis.setTimeout(clearAuthState, 0);
      return () => globalThis.clearTimeout(timeout);
    }

    const claims = parseAccessToken(tokens.accessToken);
    if (!claims) {
      const timeout = globalThis.setTimeout(clearAuthState, 0);
      return () => globalThis.clearTimeout(timeout);
    }

    const timeout = globalThis.setTimeout(() => {
      clearAuthState();
    }, Math.max(claims.expiresAt.getTime() - Date.now(), 0));

    return () => globalThis.clearTimeout(timeout);
  }, [tokens]);

  const updateAuthState = (nextTokens: AuthTokens, nextUser: UserData) => {
    setTokens(nextTokens);
    setUser(nextUser);
    saveAuthToCookies(nextTokens, nextUser);
  };

  const login = async (payload: LoginPayload) => {
    const tokens = await loginRequest(payload);
    const claims = parseAccessToken(tokens.accessToken);

    if (!claims) {
      clearAuthCookies();
      throw new Error("Session expired");
    }

    updateAuthState(tokens, {
      userId: claims.userId,
      nama_lengkap: "",
      email: payload.email,
      role: claims.role,
    });
  };

  const register = async (payload: RegisterPayload) => {
    await registerRequest(payload);
  };

  const logout = async () => {
    if (tokens?.accessToken) {
      try {
        await logoutRequest(tokens.accessToken);
      } catch {
      }
    }

    setUser(null);
    setTokens(null);
    clearAuthCookies();
  };

  const setUserData = (nextUser: UserData) => {
    setUser(nextUser);
    if (tokens) {
      saveAuthToCookies(tokens, nextUser);
    }
  };

  const refreshUser = useCallback(async () => {
    if (!tokens?.accessToken) {
      return;
    }

    try {
      const latestUser = await getMe(tokens.accessToken);
      setUser(latestUser);
      saveAuthToCookies(tokens, latestUser);
    } catch {
      if (isAccessTokenExpired(tokens.accessToken)) {
        setUser(null);
        setTokens(null);
        clearAuthCookies();
      }
    }
  }, [tokens]);

  useEffect(() => {
    if (!tokens?.accessToken) {
      return;
    }

    setTimeout(() => {
      void refreshUser();
    }, 0);

    const intervalId = globalThis.setInterval(() => {
      void refreshUser();
    }, 60_000);

    const handleFocus = () => {
      void refreshUser();
    };

    const handleVisibilityChange = () => {
      if (globalThis.document.visibilityState === "visible") {
        void refreshUser();
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

  // existing memoization could not be preserved
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
      setUserData
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
