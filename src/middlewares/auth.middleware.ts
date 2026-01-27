import type { Request, Response, NextFunction } from "express";
import type { AuthUser } from "../types/auth.types.ts";
import { verifyJwt } from "../utils/jwt.ts";

export function authMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = res.req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({
      error: "User token not found",
    });
  }

  try {
    const user = verifyJwt(token) as AuthUser;

    // attach authenticated user to request context
    res.locals.user = user;

    next();
  } catch {
    return res.status(401).json({
      error: "Invalid user token",
    });
  }
}
