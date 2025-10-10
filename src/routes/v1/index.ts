// src/routes/v1/index.ts
import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes"; // Import v1 auth routes
import expenseRoutes from "@/modules/expense/expense.routes"; // Import v1 expense routes

const router = Router();

// Mount versioned routes
router.use("/auth", authRoutes); // All auth routes go under /v1/auth
router.use("/expenses", expenseRoutes); // All expense routes go under /v1/expenses

export default router;
