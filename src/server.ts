import "dotenv/config";
import express from "express";
import { globalErrorHandler } from "./middlewares/global-error-handler";
import cookieParser from "cookie-parser";
import { connectDb } from "./db/connectDb";
import apiRoutes from "./routes/index";

const PORT = process.env.PORT || 1991;
const COOKIE_SECRET = process.env.COOKIE_SECRET || "your-cookie-secret-here";
const app = express();

app.use(cookieParser(COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Hello World, from Expense Tracker API",
  });
});

app.use("/api", apiRoutes);

app.use(globalErrorHandler); // handle all global errors here

const startServer = async () => {
  try {
    await connectDb(); // Check DB connection before starting server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} ...`);
    });
  } catch (error) {
    console.error(
      "Failed to start server due to database connection issue: ",
      error
    );
    process.exit(1); // Exit the process if DB connection fails
  }
};

startServer();
