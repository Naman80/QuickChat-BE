import { Router } from "express";
import type { TypedController } from "../middlewares/validation/typed.controller.ts";

const router = Router();

const validateUser: TypedController<{}> = async (_, res) => {
  try {
    const { user } = res.locals;

    if (!user) throw new Error("User not found");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      error: "Invalid user",
    });
  }
};

router.get("/", validateUser);

export default router;
