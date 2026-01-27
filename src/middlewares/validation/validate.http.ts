import type { RequestHandler } from "express";
import { z, type ZodType } from "zod";

export function validateHttp<T>(schema: ZodType<T>): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: z.prettifyError(result.error),
      });
    }

    res.locals.validated = result.data;
    next();
  };
}
