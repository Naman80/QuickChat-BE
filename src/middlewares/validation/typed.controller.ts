import type { Request, Response, NextFunction } from "express";
import type { AuthUser } from "../../types/auth.types.ts";

export type TypedController<TValidated> = (
  req: Request,
  res: Response & {
    locals: {
      user: AuthUser;
      validated: TValidated;
    };
  },
  next: NextFunction,
) => unknown | Promise<unknown>;
