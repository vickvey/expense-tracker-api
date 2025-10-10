// src/routes/v1/index.ts
import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes"; // Import v1 auth routes
import expenseRoutes from "@/modules/expense/expense.routes"; // Import v1 expense routes
import verifyToken from "@/middlewares/verify-token";

const router = Router();

// Public Routes
router.use("/auth", authRoutes); // All auth routes go under /v1/auth

// Protected Routes
router.use("/expenses", verifyToken, expenseRoutes); // All expense routes go under /v1/expenses

export default router;
