type AccessTokenClaims = {
  tokenId: string;
  tokenType: string;
  userId: string;
  role: string;
  expiresAt: Date;
};

function decodeBase64Url(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

export function parseAccessToken(token: string): AccessTokenClaims | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  try {
    const payload = decodeBase64Url(parts[0]).split("|");
    if (payload.length !== 5) return null;

    const expiresAt = new Date(Number(payload[4]) * 1000);
    if (Number.isNaN(expiresAt.getTime())) return null;

    return {
      tokenId: payload[0],
      tokenType: payload[1],
      userId: payload[2],
      role: payload[3],
      expiresAt,
    };
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(token: string) {
  const claims = parseAccessToken(token);
  if (claims?.tokenType !== "access") return true;

  return claims.expiresAt.getTime() <= Date.now();
}
