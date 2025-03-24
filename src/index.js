import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import cors from "cors";
import ApiResponse from "./utils/ApiResponse.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  ApiResponse.send(res, 200, "Hey, Express + Prisma", {});
});

const PORT = process.env.PORT || 8079;
app.listen(PORT);
