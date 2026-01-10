import { Router } from "express";
import healthRoute from "./health.route.ts";
import authRoutes from "../modules/auth/auth.routes.ts";
import validUserRoute from "./validUser.route.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(healthRoute);
router.use(authRoutes);

// Protected Routes
router.use(authMiddleware);

router.use(validUserRoute);

export default router;
