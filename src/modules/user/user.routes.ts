import { Router } from "express";
import { validateHttp } from "../../middlewares/validation/validate.http.ts";
import { createUserRequestSchema } from "./user.schema.ts";
import { UserController } from "./user.controller.ts";

const router = Router();

router.post(
  "/",
  validateHttp(createUserRequestSchema),
  UserController.createUser,
);

export default router;
