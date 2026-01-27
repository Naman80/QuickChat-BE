import { Router } from "express";
import { validateHttp } from "../../middlewares/validation/validate.http.ts";

import { createUser } from "./user.controller.ts";
import { createUserRequestSchema } from "./user.schema.ts";

const router = Router();

router.post("/", validateHttp(createUserRequestSchema), createUser);

export default router;
