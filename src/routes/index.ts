import { Router } from "express";
import healthRoute from "./health.route.ts";
import authRoutes from "../modules/auth/auth.routes.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import validUserRoute from "./validUser.route.ts";

import userRoutes from "../modules/user/user.routes.ts";

const router = Router();

/**
 * Public routes
 */
router.use("/health", healthRoute);
router.use("/auth", authRoutes);

/**
 * Protected routes
 */
router.use(authMiddleware);

router.use("/validateUser", validUserRoute);

router.use("/users", userRoutes);

export default router;
