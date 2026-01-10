import jwt, { type SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "randomsecret";

export function signJwt(payload: object, options?: SignOptions) {
  return jwt.sign(payload, JWT_SECRET, {
    ...options,
    expiresIn: options?.expiresIn ?? "15min",
  });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
