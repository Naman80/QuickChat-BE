import type { TypedController } from "../../middlewares/validation/typed.controller.ts";
import type { CreateUserRequest } from "./user.schema.ts";
import * as UserService from "./user.service.ts";

export const createUser: TypedController<CreateUserRequest> = async (
  _req,
  res,
) => {
  const { body } = res.locals.validated;

  const user = await UserService.createUser({
    ...body,
  });

  res.status(201).json(user);
};
