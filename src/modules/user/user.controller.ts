import { TypedController } from "../../middlewares/validation/typed.controller.ts";
import type { CreateUserRequest } from "./user.schema.ts";
import { UserService } from "./user.service.ts";

// we wont be having this controller // for test purpose only

export const UserController = {
  createUser: TypedController<CreateUserRequest>(async (_req, res) => {
    const { body } = res.locals.validated;

    const user = await UserService.createUser({
      ...body,
    });

    res.status(201).json(user);
  }),
};
