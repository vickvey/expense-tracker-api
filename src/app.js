import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import cors from "cors";
import ApiResponse from "./utils/ApiResponse.js";
import logger from "./middlewares/logger.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/authMiddleware.js";
import expenseRouter from "./routes/expenseRouter.js";

// Setting up EJS as the view engine for SSR
import path from "path";
import { fileURLToPath } from "url";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables!");
}

const app = express();

// Get the current directory path using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

// Example SSR route (Home Page)
app.get("/home", async (req, res) => {
  res.render("home");
});

app.use("*", (req, res) => {
  ApiResponse.error(res, 404, "Invalid Request");
});

export default app;
