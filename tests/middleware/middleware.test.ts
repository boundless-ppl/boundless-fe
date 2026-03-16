import { NextRequest } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/features/auth/constants/auth.constants";
import { middleware } from "@/middleware";

function createToken(expiresAtUnixSeconds: number) {
  const payload = Buffer.from(
    `token-id|access|user-id|user|${expiresAtUnixSeconds}`,
    "utf8"
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${payload}.signature`;
}

describe("middleware", () => {
  it("redirects guests away from protected routes", () => {
    const request = new NextRequest("https://example.com/dashboard");

    const response = middleware(request);

    expect(response?.status).toBe(307);
    expect(response?.headers.get("location")).toContain("/login?next=%2Fdashboard");
  });

  it("redirects expired-token users away from protected routes", () => {
    const request = new NextRequest("https://example.com/globalmatch");
    request.cookies.set(ACCESS_TOKEN_COOKIE, createToken(Math.floor(Date.now() / 1000) - 60));

    const response = middleware(request);

    expect(response?.status).toBe(307);
    expect(response?.headers.get("location")).toContain("/login?next=%2Fglobalmatch");
  });

  it("allows valid-token users through protected routes", () => {
    const request = new NextRequest("https://example.com/dashboard");
    request.cookies.set(ACCESS_TOKEN_COOKIE, createToken(Math.floor(Date.now() / 1000) + 3600));

    const response = middleware(request);

    expect(response?.status).toBe(200);
  });
});
