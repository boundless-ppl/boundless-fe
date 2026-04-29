import {
  ACCESS_TOKEN_COOKIE,
  COOKIE_MAX_AGE_SECONDS,
  REFRESH_TOKEN_COOKIE,
  USER_COOKIE,
} from "@/features/auth/constants/auth.constants";
import { isAccessTokenExpired, parseAccessToken } from "@/features/auth/utils/access-token";
import type { AuthTokens, UserData } from "@/features/auth/types/auth.types";

function getCookieValue(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const hit = cookies.find((entry) => entry.startsWith(`${name}=`));
  if (!hit) {
    return null;
  }

  return decodeURIComponent(hit.substring(name.length + 1));
}

function setCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE_SECONDS) {
  if (typeof document === "undefined") {
    return;
  }

  const secureSuffix = globalThis.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secureSuffix}`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function tokenMaxAgeSeconds(token: string) {
  const claims = parseAccessToken(token);
  if (!claims) {
    return COOKIE_MAX_AGE_SECONDS;
  }

  return Math.max(Math.floor((claims.expiresAt.getTime() - Date.now()) / 1000), 0);
}

export function saveAuthToCookies(tokens: AuthTokens, user: UserData) {
  const accessMaxAge = tokenMaxAgeSeconds(tokens.accessToken);
  const refreshMaxAge = tokenMaxAgeSeconds(tokens.refreshToken);

  setCookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, accessMaxAge);
  setCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, refreshMaxAge);
  setCookie(USER_COOKIE, JSON.stringify(user), refreshMaxAge);
}

export function clearAuthCookies() {
  deleteCookie(ACCESS_TOKEN_COOKIE);
  deleteCookie(REFRESH_TOKEN_COOKIE);
  deleteCookie(USER_COOKIE);
}

export function readAuthFromCookies() {
  const accessToken = getCookieValue(ACCESS_TOKEN_COOKIE);
  const refreshToken = getCookieValue(REFRESH_TOKEN_COOKIE);
  const serializedUser = getCookieValue(USER_COOKIE);

  if (!accessToken || !refreshToken || !serializedUser) {
    return null;
  }
  if (isAccessTokenExpired(accessToken)) {
    clearAuthCookies();
    return null;
  }

  try {
    const user = JSON.parse(serializedUser) as UserData;

    return {
      tokens: {
        accessToken,
        refreshToken,
      },
      user,
    };
  } catch {
    return null;
  }
}
