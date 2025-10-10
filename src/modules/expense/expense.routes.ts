import { Router } from "express";
import * as ExpenseController from "./expense.controller";

const router = Router();

router.get("/", ExpenseController.getAll);
router.get("/:id", ExpenseController.getOne);
router.post("/:id", ExpenseController.createOne);
router.put("/:id", ExpenseController.updateOne);
router.delete("/:id", ExpenseController.deleteOne);

export default router; // expenseRoutes
