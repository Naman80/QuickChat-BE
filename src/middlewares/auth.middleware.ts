import type { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.ts";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({
      error: "User token not found",
    });

  try {
    //@ts-ignore // TODO: add user to req globally
    req.user = verifyJwt(token);
    next();
  } catch {
    res.status(401).json({
      error: "Invalid user token",
    });
  }
}
