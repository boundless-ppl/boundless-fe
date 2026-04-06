import type { LoginPayload, RegisterPayload, UserData } from "@/features/auth/types/auth.types";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/features/auth/constants/auth.constants";
import { isAccessTokenExpired, parseAccessToken } from "@/features/auth/utils/access-token";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

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

  const claims = parseAccessToken(accessToken);
  const user: Pick<UserData, "userId" | "email" | "role"> = {
    userId: claims?.userId ?? "",
    email: payload.email,
    role: claims?.role || "user",
  };

  return { tokens: { accessToken, refreshToken }, user };
}

export async function logoutRequest(accessToken: string) {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const hit = cookies.find((entry) => entry.startsWith(`${name}=`));
  if (!hit) return null;

  return decodeURIComponent(hit.substring(name.length + 1));
}

export function getAuthToken(): { accessToken: string; refreshToken: string } | null {
  if (typeof window === "undefined") return null;

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
