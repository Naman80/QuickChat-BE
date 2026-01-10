import { verifyJwt } from "../utils/jwt.ts";

export function authenticateWs(req: any) {
  console.log(req, " ", req.url, "WS AUTH");

  const token = new URL(req.url, "http://x").searchParams.get("token");

  if (!token) throw new Error("No token");

  const payload = verifyJwt(token);

  return payload.sub as string;
}
