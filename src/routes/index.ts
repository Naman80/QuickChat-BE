import express, { Router } from "express";
import healthRoute from "./health.route.ts";
import authRoutes from "../modules/auth/auth.routes.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import validUserRoute from "./validUser.route.ts";
import userRoutes from "../modules/user/user.routes.ts";
import conversationRoutes from "../modules/conversation/conversation.routes.ts";
import messageRoutes from "../modules/messages/messages.routes.ts";

const router = Router();
// global middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

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
router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);

export default router;
