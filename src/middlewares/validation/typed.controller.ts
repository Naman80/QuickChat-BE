import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { AuthUser } from "../../types/auth.types.ts";

export function TypedController<TValidated = unknown>(
  handler: (
    req: Request,
    res: Response & {
      locals: {
        user: AuthUser;
        validated: TValidated;
      };
    },
    next: NextFunction,
  ) => Promise<void> | void,
): RequestHandler {
  return async (req, res, next) => {
    try {
      await handler(
        req,
        res as Response & {
          locals: { user: AuthUser; validated: TValidated };
        },
        next,
      );

      // Optional safety check
      if (!res.headersSent) {
        next(new Error("Handler finished without sending a response"));
      }
    } catch (err) {
      next(err);
    }
  };
}
