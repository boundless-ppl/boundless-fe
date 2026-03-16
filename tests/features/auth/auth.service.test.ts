// @vitest-environment jsdom

const fetchMock = vi.fn();

vi.stubGlobal("fetch", fetchMock);

function jsonResponse(body: unknown, init: { status?: number; contentType?: string } = {}) {
  return {
    ok: (init.status ?? 200) >= 200 && (init.status ?? 200) < 300,
    status: init.status ?? 200,
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "content-type" ? init.contentType ?? "application/json" : null,
    },
    json: vi.fn().mockResolvedValue(body),
  };
}

function createToken(payload: string) {
  const encoded = Buffer.from(payload, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${encoded}.signature`;
}

describe("auth.service", () => {
  beforeEach(() => {
    vi.resetModules();
    fetchMock.mockReset();
    document.cookie = "boundless_access_token=; Max-Age=0; Path=/";
    document.cookie = "boundless_refresh_token=; Max-Age=0; Path=/";
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
  });

  it("registers with mapped payload fields", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    const { registerRequest } = await import("@/features/auth/services/auth.service");

    await registerRequest({
      nama_lengkap: "Grace Karin",
      email: "grace@example.com",
      password: "secret",
      role: "admin",
    });

    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama_lengkap: "Grace Karin",
        email: "grace@example.com",
        role: "user",
        password: "secret",
      }),
    });
  });

  it("logs in using token aliases from the API response", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        access_token: createToken("token-id|access|user-1|admin|2000000000"),
        refreshToken: "refresh-token",
      })
    );
    const { loginRequest } = await import("@/features/auth/services/auth.service");

    await expect(
      loginRequest({
        email: "grace@example.com",
        password: "secret",
      })
    ).resolves.toEqual({
      tokens: {
        accessToken: createToken("token-id|access|user-1|admin|2000000000"),
        refreshToken: "refresh-token",
      },
      user: {
        userId: "user-1",
        email: "grace@example.com",
        role: "admin",
      },
    });
  });

  it("falls back to the payload email and default role when claims are missing", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        AccessToken: "not-a-valid-token",
        refresh_token: "refresh-token",
      })
    );
    const { loginRequest } = await import("@/features/auth/services/auth.service");

    await expect(
      loginRequest({
        email: "grace@example.com",
        password: "secret",
      })
    ).resolves.toEqual({
      tokens: {
        accessToken: "not-a-valid-token",
        refreshToken: "refresh-token",
      },
      user: {
        userId: "",
        email: "grace@example.com",
        role: "user",
      },
    });
  });

  it("throws when the auth response does not contain both tokens", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ access_token: "token-only" }));
    const { loginRequest } = await import("@/features/auth/services/auth.service");

    await expect(
      loginRequest({
        email: "grace@example.com",
        password: "secret",
      })
    ).rejects.toThrow("Invalid auth response from server");
  });

  it("throws the server message for failed auth requests", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ message: "Email already used" }, { status: 400 })
    );
    const { registerRequest } = await import("@/features/auth/services/auth.service");

    await expect(
      registerRequest({
        nama_lengkap: "Grace Karin",
        email: "grace@example.com",
        password: "secret",
        role: "user",
      })
    ).rejects.toThrow("Email already used");
  });

  it("falls back to the error field and default message for failed auth requests", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: "Unauthorized" }, { status: 401 }))
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: {
          get: () => "text/plain",
        },
      });
    const { loginRequest, registerRequest } = await import("@/features/auth/services/auth.service");

    await expect(
      loginRequest({
        email: "grace@example.com",
        password: "secret",
      })
    ).rejects.toThrow("Unauthorized");

    await expect(
      registerRequest({
        nama_lengkap: "Grace Karin",
        email: "grace@example.com",
        password: "secret",
        role: "user",
      })
    ).rejects.toThrow("Authentication request failed");
  });

  it("posts logout with a bearer token", async () => {
    fetchMock.mockResolvedValue({ ok: true, headers: { get: () => null } });
    const { logoutRequest } = await import("@/features/auth/services/auth.service");

    await logoutRequest("access-token");

    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/auth/logout", {
      method: "POST",
      headers: { Authorization: "Bearer access-token" },
    });
  });

  it("reads valid auth tokens from cookies", async () => {
    const accessToken = createToken(`token-id|access|user-1|user|${Math.floor(Date.now() / 1000) + 3600}`);
    document.cookie = `boundless_access_token=${encodeURIComponent(accessToken)}`;
    document.cookie = "boundless_refresh_token=refresh-token";
    const { getAuthToken } = await import("@/features/auth/services/auth.service");

    expect(getAuthToken()).toEqual({
      accessToken,
      refreshToken: "refresh-token",
    });
  });

  it("returns null when auth cookies are missing, expired, or access throws", async () => {
    const { getAuthToken } = await import("@/features/auth/services/auth.service");

    expect(getAuthToken()).toBeNull();

    document.cookie = `boundless_access_token=${encodeURIComponent(
      createToken(`token-id|access|user-1|user|${Math.floor(Date.now() / 1000) - 60}`)
    )}`;
    document.cookie = "boundless_refresh_token=refresh-token";
    expect(getAuthToken()).toBeNull();

    const cookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, "cookie");
    Object.defineProperty(document, "cookie", {
      configurable: true,
      get() {
        throw new Error("cookie blocked");
      },
    });

    expect(getAuthToken()).toBeNull();

    if (cookieDescriptor) {
      Object.defineProperty(document, "cookie", cookieDescriptor);
    }
  });
});
