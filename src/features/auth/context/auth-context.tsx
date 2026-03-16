"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
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

  const updateAuthState = (nextTokens: AuthTokens, partialUser: Partial<UserData>) => {
    const hydratedUser: UserData = {
      userId: partialUser.userId ?? user?.userId ?? "",
      nama_lengkap: partialUser.nama_lengkap ?? user?.nama_lengkap ?? "",
      email: partialUser.email ?? user?.email ?? "",
      role: partialUser.role ?? user?.role ?? "student",
    };

    setTokens(nextTokens);
    setUser(hydratedUser);
    saveAuthToCookies(nextTokens, hydratedUser);
  };

  const login = async (payload: LoginPayload) => {
    const response = await loginRequest(payload);
    updateAuthState(response.tokens, response.user);
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

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      tokens,
      isAuthenticated: !!tokens?.accessToken,
      isLoggedIn: !!tokens?.accessToken,
      isLoading,
      login,
      register,
      logout,
      setUserData,
    }),
    [user, tokens, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
