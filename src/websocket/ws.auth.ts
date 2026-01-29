import { type AuthUser } from "../types/auth.types.ts";
import { verifyJwt } from "../utils/jwt.ts";

export function authenticateWs(req: any) {
  console.log("Authenticating WS URL:", req.url);

  const token = new URL(req.url, "http://x").searchParams.get("token");

  if (!token) {
    console.log("While authenticating WS token not found in URL");
    throw new Error("No token found in URL");
  }

  const payload = verifyJwt(token);

  const authenticatedUser: AuthUser = { id: payload.sub as string };

  return authenticatedUser;
}
