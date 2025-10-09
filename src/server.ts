import express from "express";
import { globalErrorHandler } from "./middlewares/global-error-handler";

const PORT = process.env.PORT || 1991;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Hello World, from Expense Tracker API",
  });
});

app.use(globalErrorHandler); // handle all global errors here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ...`);
});
