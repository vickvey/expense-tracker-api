import express from "express";
import {
  createExpense,
  getExpenses,
} from "../controllers/expenseController.js";

const router = express.Router();
router.get("/", getExpenses);
// router.get("/:id");
router.post("/", createExpense);
// router.put("/:id");
// router.patch("/:id");
// router.delete("/");

export default router;
