import { isAccessTokenExpired, parseAccessToken } from "@/features/auth/utils/access-token";

function createToken(payload: string) {
  const encoded = Buffer.from(payload, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${encoded}.signature`;
}

describe("access-token utils", () => {
  it("parses a valid access token", () => {
    const token = createToken("token-id|access|user-1|admin|2000000000");

    expect(parseAccessToken(token)).toEqual({
      tokenId: "token-id",
      tokenType: "access",
      userId: "user-1",
      role: "admin",
      expiresAt: new Date(2000000000 * 1000),
    });
  });

  it("returns null when token does not have two parts", () => {
    expect(parseAccessToken("invalid-token")).toBeNull();
  });

  it("returns null when payload parts are incomplete", () => {
    const token = createToken("token-id|access|user-1");

    expect(parseAccessToken(token)).toBeNull();
  });

  it("returns null when expiry is invalid", () => {
    const token = createToken("token-id|access|user-1|user|not-a-number");

    expect(parseAccessToken(token)).toBeNull();
  });

  it("returns null when payload is not valid base64url", () => {
    expect(parseAccessToken("%%%bad%%%.signature")).toBeNull();
  });

  it("treats invalid tokens as expired", () => {
    expect(isAccessTokenExpired("invalid-token")).toBe(true);
  });

  it("treats non-access tokens as expired", () => {
    const token = createToken("token-id|refresh|user-1|user|2000000000");

    expect(isAccessTokenExpired(token)).toBe(true);
  });

  it("treats past expiry as expired", () => {
    const token = createToken(`token-id|access|user-1|user|${Math.floor(Date.now() / 1000) - 10}`);

    expect(isAccessTokenExpired(token)).toBe(true);
  });

  it("treats future expiry as not expired", () => {
    const token = createToken(`token-id|access|user-1|user|${Math.floor(Date.now() / 1000) + 3600}`);

    expect(isAccessTokenExpired(token)).toBe(false);
  });
});
