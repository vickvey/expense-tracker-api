import express from "express";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Hello World, from Expense Tracker API",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ...`);
});
