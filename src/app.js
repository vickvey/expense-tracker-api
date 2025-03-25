import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import cors from "cors";
import ApiResponse from "./utils/ApiResponse.js";
import logger from "./middlewares/logger.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser(JWT_SECRET));
app.use(logger);

app.get("/", (req, res) => {
  ApiResponse.send(res, 200, "Hey, Express + Prisma", {});
});
app.use("/auth", authRouter);
app.use("*", (req, res) => {
  ApiResponse.error(res, 404, "Invalid Request");
});

export default app;
