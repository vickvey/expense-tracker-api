import express from "express";
import { getExpenses } from "../controllers/expenseController.js";

const router = express.Router();
router.get("/", getExpenses);
// router.get("/:id");
// router.post("/");
// router.put("/:id");
// router.patch("/:id");
// router.delete("/");

export default router;
