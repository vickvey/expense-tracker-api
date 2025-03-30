import express from "express";
import cors from "cors";
import ApiResponse from "./utils/ApiResponse.js";
import logger from "./middlewares/logger.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/authMiddleware.js";
import expenseRouter from "./routes/expenseRouter.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables!");
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser(JWT_SECRET));
app.use(logger);

// Public Routes
app.get("/", (req, res) => {
  ApiResponse.send(res, 200, "Hey, Express + Prisma", {});
});
app.use("/auth", authRouter);

// Protected Routes
app.use("/expense", authMiddleware, expenseRouter);
app.use("*", (req, res) => {
  ApiResponse.error(res, 404, "Invalid Request");
});

export default app;
