import express from "express";
import { globalErrorHandler } from "./middlewares/global-error-handler";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 1991;
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'your-cookie-secret-here';
const app = express();


app.use(cookieParser(COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Hello World, from Expense Tracker API",
  });
});

app.use(globalErrorHandler); // handle all global errors here

/// TODO: Add database connection and encapsulate the below code in then()
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ...`);
});
