import { z } from "zod";

export const createUserBodySchema = z.object({
  phone: z.string().min(8),
});

export const createUserRequestSchema = z.object({
  body: createUserBodySchema,
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
