// @vitest-environment jsdom

import {
  clearAuthCookies,
  readAuthFromCookies,
  saveAuthToCookies,
} from "@/features/auth/utils/auth-cookies";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  USER_COOKIE,
} from "@/features/auth/constants/auth.constants";

function createToken(expiresAtUnixSeconds: number) {
  const encoded = Buffer.from(
    `token-id|access|user-1|user|${expiresAtUnixSeconds}`,
    "utf8"
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${encoded}.signature`;
}

describe("auth-cookies utils", () => {
  beforeEach(() => {
    document.cookie = `${ACCESS_TOKEN_COOKIE}=; Max-Age=0; Path=/`;
    document.cookie = `${REFRESH_TOKEN_COOKIE}=; Max-Age=0; Path=/`;
    document.cookie = `${USER_COOKIE}=; Max-Age=0; Path=/`;
  });

  it("saves auth data to cookies", () => {
    saveAuthToCookies(
      {
        accessToken: createToken(Math.floor(Date.now() / 1000) + 3600),
        refreshToken: "refresh-token",
      },
      {
        userId: "user-1",
        nama_lengkap: "Grace Karin",
        email: "grace@example.com",
        role: "user",
      }
    );

    expect(document.cookie).toContain(`${ACCESS_TOKEN_COOKIE}=`);
    expect(document.cookie).toContain(`${REFRESH_TOKEN_COOKIE}=refresh-token`);
    expect(document.cookie).toContain(`${USER_COOKIE}=`);
  });

  it("reads auth data from valid cookies", () => {
    const accessToken = createToken(Math.floor(Date.now() / 1000) + 3600);
    document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(accessToken)}`;
    document.cookie = `${REFRESH_TOKEN_COOKIE}=refresh-token`;
    document.cookie = `${USER_COOKIE}=${encodeURIComponent(
      JSON.stringify({
        userId: "user-1",
        nama_lengkap: "Grace Karin",
        email: "grace@example.com",
        role: "user",
      })
    )}`;

    expect(readAuthFromCookies()).toEqual({
      tokens: {
        accessToken,
        refreshToken: "refresh-token",
      },
      user: {
        userId: "user-1",
        nama_lengkap: "Grace Karin",
        email: "grace@example.com",
        role: "user",
      },
    });
  });

  it("returns null when required cookies are missing", () => {
    document.cookie = `${ACCESS_TOKEN_COOKIE}=token`;

    expect(readAuthFromCookies()).toBeNull();
  });

  it("clears cookies and returns null when the access token is expired", () => {
    document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(
      createToken(Math.floor(Date.now() / 1000) - 60)
    )}`;
    document.cookie = `${REFRESH_TOKEN_COOKIE}=refresh-token`;
    document.cookie = `${USER_COOKIE}=${encodeURIComponent(
      JSON.stringify({
        userId: "user-1",
        nama_lengkap: "Grace Karin",
        email: "grace@example.com",
        role: "user",
      })
    )}`;

    expect(readAuthFromCookies()).toBeNull();
    expect(document.cookie).not.toContain(ACCESS_TOKEN_COOKIE);
  });

  it("returns null when the user cookie is invalid json", () => {
    document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(
      createToken(Math.floor(Date.now() / 1000) + 3600)
    )}`;
    document.cookie = `${REFRESH_TOKEN_COOKIE}=refresh-token`;
    document.cookie = `${USER_COOKIE}=not-json`;

    expect(readAuthFromCookies()).toBeNull();
  });

  it("clears auth cookies explicitly", () => {
    document.cookie = `${ACCESS_TOKEN_COOKIE}=token`;
    document.cookie = `${REFRESH_TOKEN_COOKIE}=refresh-token`;
    document.cookie = `${USER_COOKIE}=user`;

    clearAuthCookies();

    expect(document.cookie).not.toContain(ACCESS_TOKEN_COOKIE);
    expect(document.cookie).not.toContain(REFRESH_TOKEN_COOKIE);
    expect(document.cookie).not.toContain(USER_COOKIE);
  });
});
