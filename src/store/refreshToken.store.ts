const refreshTokens = new Map<string, string>(); // tokenHash → userId

export function saveRefreshToken(hash: string, userId: string) {
  refreshTokens.set(hash, userId);
}

export function findRefreshToken(hash: string) {
  return refreshTokens.get(hash);
}

export function revokeRefreshToken(hash: string) {
  refreshTokens.delete(hash);
}
