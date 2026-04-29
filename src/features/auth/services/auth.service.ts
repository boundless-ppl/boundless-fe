import type { LoginPayload, RegisterPayload, UserData } from "@/features/auth/types/auth.types";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/features/auth/constants/auth.constants";
import { isAccessTokenExpired } from "@/features/auth/utils/access-token";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export class AuthApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

function toText(value: unknown) {
  return typeof value === "string" ? value : "";
}

async function postAuth(endpoint: string, body: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const message =
      (payload as { message?: string } | null)?.message ||
      (payload as { error?: string } | null)?.error ||
      "Authentication request failed";
    throw new Error(message);
  }

  return payload;
}

export async function registerRequest(payload: RegisterPayload) {
  await postAuth("/auth/register", {
    nama_lengkap: payload.nama_lengkap,
    email: payload.email,
    role: "user",
    password: payload.password,
  });
}

export async function loginRequest(payload: LoginPayload) {
  const result = await postAuth("/auth/login", {
    email: payload.email,
    password: payload.password,
  });

  const accessToken = toText(result.access_token) || toText(result.accessToken) || toText(result.AccessToken);
  const refreshToken = toText(result.refresh_token) || toText(result.refreshToken);

  if (!accessToken || !refreshToken) throw new Error("Invalid auth response from server");

  return { accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
  const result = await postAuth("/auth/refresh", { refresh_token: refreshToken });
  const accessToken = toText(result.access_token) || toText(result.accessToken);
  if (!accessToken) throw new Error("Invalid refresh response from server");
  return { accessToken };
}

export async function logoutRequest(accessToken: string) {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function getMe(accessToken: string): Promise<UserData> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new AuthApiError("Failed to fetch user data", response.status);
  }

  const data = await response.json();

  return {
    userId: data.user_id,
    nama_lengkap: data.nama_lengkap,
    email: data.email,
    role: data.role,
    hasPendingPayment: Boolean(data.has_pending_payment),
    transactionId: toText(data.transaction_id) || null,
    isPremium: Boolean(data.is_premium),
    premiumStartAt: toText(data.premium_start_at) || null,
    premiumEndAt: toText(data.premium_end_at) || null,
  };
}

export async function updateProfileRequest(accessToken: string, namaLengkap: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ nama_lengkap: namaLengkap }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error((payload as { error?: string } | null)?.error ?? "Failed to update profile");
  }
}

export async function changePasswordRequest(
  accessToken: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/me/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error((payload as { error?: string } | null)?.error ?? "Failed to change password");
  }
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const hit = cookies.find((entry) => entry.startsWith(`${name}=`));
  if (!hit) return null;

  return decodeURIComponent(hit.substring(name.length + 1));
}

export function getAuthToken(): { accessToken: string; refreshToken: string } | null {
  if (globalThis.window === undefined) return null;

  try {
    const accessToken = getCookieValue(ACCESS_TOKEN_COOKIE);
    const refreshToken = getCookieValue(REFRESH_TOKEN_COOKIE);

    if (!accessToken || !refreshToken) return null;
    if (isAccessTokenExpired(accessToken)) return null;

    return { accessToken, refreshToken };
  } catch {
    return null;
  }
}
