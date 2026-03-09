"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

import { loginRequest, logoutRequest, registerRequest } from "@/lib/services/auth.service"

export type UserData = {
  userId: string
  nama_lengkap: string
  email: string
  role: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  nama_lengkap: string
  email: string
  password: string
}

const ACCESS_TOKEN_COOKIE = "boundless_access_token"
const REFRESH_TOKEN_COOKIE = "boundless_refresh_token"
const USER_COOKIE = "boundless_user"
const COOKIE_MAX_AGE_SECONDS = 24 * 60 * 60

function getCookieValue(name: string) {
  if (typeof document === "undefined") {
    return null
  }

  const cookies = document.cookie ? document.cookie.split("; ") : []
  const hit = cookies.find((entry) => entry.startsWith(`${name}=`))
  if (!hit) {
    return null
  }

  return decodeURIComponent(hit.substring(name.length + 1))
}

function setCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE_SECONDS) {
  if (typeof document === "undefined") {
    return
  }

  const secureSuffix = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secureSuffix}`
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
}

function saveAuthToCookies(tokens: AuthTokens, user: UserData) {
  setCookie(ACCESS_TOKEN_COOKIE, tokens.accessToken)
  setCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken)
  setCookie(USER_COOKIE, JSON.stringify(user))
}

function clearAuthCookies() {
  deleteCookie(ACCESS_TOKEN_COOKIE)
  deleteCookie(REFRESH_TOKEN_COOKIE)
  deleteCookie(USER_COOKIE)
}

function readAuthFromCookies() {
  const accessToken = getCookieValue(ACCESS_TOKEN_COOKIE)
  const refreshToken = getCookieValue(REFRESH_TOKEN_COOKIE)
  const serializedUser = getCookieValue(USER_COOKIE)

  if (!accessToken || !refreshToken || !serializedUser) {
    return null
  }

  try {
    const user = JSON.parse(serializedUser) as UserData

    return {
      tokens: {
        accessToken,
        refreshToken,
      },
      user,
    }
  } catch {
    return null
  }
}

type AuthContextValue = {
  user: UserData | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  setUserData: (nextUser: UserData) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [bootstrappedAuth] = useState(() => readAuthFromCookies())
  const [user, setUser] = useState<UserData | null>(bootstrappedAuth?.user ?? null)
  const [tokens, setTokens] = useState<AuthTokens | null>(bootstrappedAuth?.tokens ?? null)
  const isLoading = false

  const updateAuthState = (nextTokens: AuthTokens, partialUser: Partial<UserData>) => {
    const hydratedUser: UserData = {
      userId: partialUser.userId ?? user?.userId ?? "",
      nama_lengkap: partialUser.nama_lengkap ?? user?.nama_lengkap ?? "",
      email: partialUser.email ?? user?.email ?? "",
      role: partialUser.role ?? user?.role ?? "student",
    }

    setTokens(nextTokens)
    setUser(hydratedUser)
    saveAuthToCookies(nextTokens, hydratedUser)
  }

  const login = async (payload: LoginPayload) => {
    const response = await loginRequest(payload)
    updateAuthState(response.tokens, response.user)
  }

  const register = async (payload: RegisterPayload) => {
    await registerRequest(payload)
  }

  const logout = async () => {
    if (tokens?.accessToken) {
      try {
        await logoutRequest(tokens.accessToken)
      } catch {
        // Client should still clear state even if backend logout fails.
      }
    }

    setUser(null)
    setTokens(null)
    clearAuthCookies()
  }

  const setUserData = (nextUser: UserData) => {
    setUser(nextUser)
    if (tokens) {
      saveAuthToCookies(tokens, nextUser)
    }
  }

  const value: AuthContextValue = {
    user,
    tokens,
    isAuthenticated: !!tokens?.accessToken,
    isLoading,
    login,
    register,
    logout,
    setUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}
