import type { UserData } from "@/lib/auth-context"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type LoginRequestPayload = {
  email: string
  password: string
}

type RegisterRequestPayload = {
  nama_lengkap: string
  email: string
  password: string
}

function decodeTokenPayload<T = Record<string, unknown>>(token: string): T | null {
  const parts = token.split(".")
  if (parts.length < 2) return null

  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const json = atob(normalized)
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

function toText(value: unknown) {
  return typeof value === "string" ? value : ""
}

async function postAuth(endpoint: string, body: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const contentType = response.headers.get("content-type") ?? ""
  const payload = contentType.includes("application/json") ? await response.json() : null

  if (!response.ok) {
    const message =
      (payload as { message?: string } | null)?.message ||
      (payload as { error?: string } | null)?.error ||
      "Authentication request failed"
    throw new Error(message)
  }

  return payload
}

export async function registerRequest(payload: RegisterRequestPayload) {
  await postAuth("/auth/register", {
    nama_lengkap: payload.nama_lengkap,
    email: payload.email,
    password: payload.password,
  })
}

export async function loginRequest(payload: LoginRequestPayload) {
  const result = await postAuth("/auth/login", {
    email: payload.email,
    password: payload.password,
  })

  const accessToken = toText(result.access_token) || toText(result.accessToken)
  const refreshToken = toText(result.refresh_token) || toText(result.refreshToken)

  if (!accessToken || !refreshToken) throw new Error("Invalid auth response from server")

  const claims = decodeTokenPayload<Record<string, unknown>>(accessToken)
  const user: Pick<UserData, "userId" | "email" | "role"> = {
    userId: toText(claims?.userId) || toText(claims?.user_id) || "",
    email: payload.email,
    role: toText(claims?.role) || "user",
  }

  return { tokens: { accessToken, refreshToken }, user }
}

export async function logoutRequest(accessToken: string) {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}