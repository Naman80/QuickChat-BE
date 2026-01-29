const refreshTokens = new Map<string, string>(); // tokenHash → userId

export const RefreshTokenStore = {
  saveRefreshToken(hash: string, userId: string) {
    refreshTokens.set(hash, userId);
  },

  findRefreshToken(hash: string) {
    return refreshTokens.get(hash);
  },

  revokeRefreshToken(hash: string) {
    refreshTokens.delete(hash);
  },
};
